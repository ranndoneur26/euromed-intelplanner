import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client
const getGeminiClient = () => {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        throw new Error("GOOGLE_AI_API_KEY is not defined in environment variables");
    }
    return new GoogleGenAI({ apiKey });
};

// Model configuration - use gemini-2.0-flash for speed
const MODEL_NAME = "gemini-2.0-flash";

/**
 * Enhanced error types for better debugging
 */
interface GeminiError extends Error {
    code?: string;
    status?: number;
    details?: any;
}

/**
 * Configuration for API calls
 */
const API_CONFIG = {
    maxRetries: 3,
    retryDelay: 1000, // ms
    timeout: 30000, // 30 seconds
    enableDebugLogs: process.env.NODE_ENV === 'development',
};

/**
 * Helper function to call Gemini API with Google Search Grounding
 * 
 * IMPROVEMENTS:
 * 1. ✅ Debugging: Comprehensive logging of requests/responses
 * 2. ✅ Error Handling: Retry logic, specific error types, graceful degradation
 * 3. ✅ Google Search Grounding: Enhanced configuration with dynamic grounding
 * 4. ✅ API Management: Timeout handling, rate limit detection, request tracking
 */
async function callGeminiWithSearch(
    prompt: string,
    options: {
        enableGrounding?: boolean;
        maxRetries?: number;
        timeout?: number;
    } = {}
): Promise<string> {
    const {
        enableGrounding = true,
        maxRetries = API_CONFIG.maxRetries,
        timeout = API_CONFIG.timeout,
    } = options;

    const genAI = getGeminiClient();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 1. DEBUGGING: Log request details
    if (API_CONFIG.enableDebugLogs) {
        console.log(`\n🔍 [${requestId}] Gemini API Request Started`);
        console.log(`📋 Model: ${MODEL_NAME}`);
        console.log(`🌐 Google Search Grounding: ${enableGrounding ? 'ENABLED' : 'DISABLED'}`);
        console.log(`📝 Prompt length: ${prompt.length} characters`);
        console.log(`⏱️ Timeout: ${timeout}ms`);
        console.log(`🔄 Max retries: ${maxRetries}`);
    }

    let lastError: GeminiError | null = null;

    // 2. ERROR HANDLING: Retry logic with exponential backoff
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            if (attempt > 0) {
                const delay = API_CONFIG.retryDelay * Math.pow(2, attempt - 1);
                console.log(`⏳ [${requestId}] Retry attempt ${attempt}/${maxRetries} after ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            // 4. API MANAGEMENT: Timeout wrapper
            const responsePromise = genAI.models.generateContent({
                model: MODEL_NAME,
                contents: prompt,
                config: {
                    // 3. GOOGLE SEARCH GROUNDING: Enhanced configuration
                    // Google Search grounding enables real-time web data retrieval
                    ...(enableGrounding && {
                        tools: [{ googleSearch: {} }],
                    }),
                    // Additional safety and quality settings
                    temperature: 0.7,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 8192,
                },
            });

            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => {
                    reject(new Error(`Request timeout after ${timeout}ms`));
                }, timeout);
            });

            const response = await Promise.race([responsePromise, timeoutPromise]);

            // 1. DEBUGGING: Log successful response
            if (API_CONFIG.enableDebugLogs) {
                console.log(`✅ [${requestId}] Gemini response received successfully`);
                console.log(`📊 Response length: ${response.text?.length || 0} characters`);
                if (response.text) {
                    console.log(`📄 Response preview: ${response.text.substring(0, 200)}...`);
                }
            }

            const responseText = response.text || "";

            if (!responseText) {
                throw new Error("Empty response received from Gemini API");
            }

            return responseText;

        } catch (error: any) {
            // 2. ERROR HANDLING: Categorize and handle different error types
            lastError = error as GeminiError;

            // Enhanced error logging
            console.error(`❌ [${requestId}] Gemini API Error (Attempt ${attempt + 1}/${maxRetries + 1})`);
            console.error(`   Error Type: ${error?.constructor?.name || 'Unknown'}`);
            console.error(`   Message: ${error?.message || 'No message'}`);

            if (error?.code) {
                console.error(`   Code: ${error.code}`);
            }

            if (error?.status) {
                console.error(`   HTTP Status: ${error.status}`);
            }

            // Detailed error response logging
            if (error?.response) {
                console.error(`   Response Details:`, JSON.stringify(error.response, null, 2));
            }

            // Check if error is retryable
            const isRetryable = isRetryableError(error);

            if (!isRetryable || attempt === maxRetries) {
                console.error(`🛑 [${requestId}] Non-retryable error or max retries reached. Failing.`);
                break;
            }

            console.log(`🔄 [${requestId}] Error is retryable, will retry...`);
        }
    }

    // If we've exhausted all retries, throw the last error with enhanced context
    const enhancedError: GeminiError = new Error(
        `Gemini API failed after ${maxRetries + 1} attempts: ${lastError?.message || 'Unknown error'}`
    ) as GeminiError;

    enhancedError.code = lastError?.code;
    enhancedError.status = lastError?.status;
    enhancedError.details = {
        requestId,
        originalError: lastError,
        attempts: maxRetries + 1,
    };

    throw enhancedError;
}

/**
 * Determine if an error is retryable
 */
function isRetryableError(error: any): boolean {
    // Network errors
    if (error?.message?.includes('timeout')) return true;
    if (error?.message?.includes('ECONNRESET')) return true;
    if (error?.message?.includes('ETIMEDOUT')) return true;

    // HTTP status codes that are retryable
    const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
    if (error?.status && retryableStatusCodes.includes(error.status)) {
        return true;
    }

    // Rate limiting
    if (error?.code === 'RATE_LIMIT_EXCEEDED') return true;
    if (error?.message?.includes('rate limit')) return true;

    // Temporary API issues
    if (error?.code === 'INTERNAL_ERROR') return true;
    if (error?.code === 'SERVICE_UNAVAILABLE') return true;

    return false;
}

/**
 * Generate strategic marketing analysis based on asset, market, and budget using Gemini + Search
 */
export async function generateStrategyAnalysis(params: {
    seed: string;
    market: string;
    budget: number;
    campaignType: "impact" | "maintenance";
    lang: string;
}) {
    const { seed, market, budget, campaignType, lang } = params;

    const langMap: Record<string, string> = {
        es: "español",
        ca: "catalán",
        en: "inglés"
    };

    const prompt = `Actúa como un estratega de marketing experto con acceso a datos en tiempo real mediante Google Search.
Busca información actual sobre el mercado de "${seed}" en "${market}".

CONTEXTO:
- Ingrediente/Asset: ${seed}
- Mercado objetivo: ${market}
- Presupuesto: €${budget.toLocaleString()}
- Tipo de campaña: ${campaignType === "impact" ? "Alto Impacto (Penetración de Mercado)" : "Mantenimiento de Marca (Fidelización)"}

TAREA:
Genera un análisis estratégico basado en DATOS REALES Y ACTUALES en ${langMap[lang] || "español"}.

1. "Mission Critical": Define el objetivo estratégico principal para ${seed} en ${market} hoy.
2. "Budget Evaluation": Analiza si €${budget.toLocaleString()} es competitivo hoy en día para ${market}. Busca costos reales de medios/ferias en este sector.
3. Recomendaciones: 3 acciones clave basadas en TENDENCIAS ACTUALES (2024-2025).

FORMATO DE SALIDA (JSON válido, SIN markdown):
{
  "missionCritical": "texto...",
  "budgetEvaluation": {
    "assessment": "Bajo" | "Adecuado" | "Alto",
    "analysis": "Análisis basado en precios reales...",
    "recommendedBudget": "€XX,XXX - €XX,XXX"
  },
  "recommendations": [
    { "title": "...", "description": "..." },
    { "title": "...", "description": "..." },
    { "title": "...", "description": "..." }
  ]
}

Responde SOLO con el JSON válido.`;

    try {
        const text = await callGeminiWithSearch(prompt);
        // Clean up potential markdown formatting
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Invalid JSON response from Gemini");
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("Error in Gemini Strategy Analysis:", error);
        throw error;
    }
}

/**
 * Generate competitor gap analysis using Gemini + Search
 */
export async function generateCompetitorAnalysis(params: {
    seed: string;
    competitor: string;
    lang: string;
}) {
    const { seed, competitor, lang } = params;

    const langMap: Record<string, string> = {
        es: "español",
        ca: "catalán",
        en: "inglés"
    };

    const prompt = `Investiga en profundidad al competidor "${competitor}" y compáralo con "${seed}" (Euromed) utilizando Google Search para obtener datos recientes de sus webs y noticias.

 TAREA:
 Genera un análisis de gap competitivo en ${langMap[lang] || "español"}.
 
 1. Dimensiones: 4-5 puntos de comparación (Tecnología, Certificaciones Actuales, Lanzamientos Recientes, Precio).
 2. Fortalezas Reales de ${competitor}: Qué están haciendo bien AHORA.
 3. Debilidades Reales de ${competitor}: Quejas recientes, falta de innovación, etc.
 4. Síntesis y Plan de Acción.
 
 FORMATO JSON (SIN Markdown):
 {
   "analysis": [
     { "dimension": "...", "us": "...", "competitor": "...", "verdict": "✅ Ventaja Nuestra" | "⚖️ Paridad" | "⚠️ Brecha a Cerrar" }
   ],
   "competitorStrengths": ["...", "..."],
   "competitorWeaknesses": ["...", "..."],
   "synthesis": "...",
   "actionPlan": ["...", "...", "..."]
 }`;

    try {
        const text = await callGeminiWithSearch(prompt);
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Invalid JSON response from Gemini");
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("Error in Gemini Competitor Analysis:", error);
        throw error;
    }
}

/**
 * Generate gap detection using Gemini + Search
 */
export async function generateGapDetection(params: {
    seed: string;
    market: string;
    lang: string;
}) {
    const { seed, market, lang } = params;

    const langMap: Record<string, string> = {
        es: "español",
        ca: "catalán",
        en: "inglés"
    };

    const prompt = `Busca tendencias NO cubiertas y oportunidades emergentes para "${seed}" en el mercado "${market || "Global"}" para 2025 usando Google Search.
 
 TAREA:
 Identifica 3 GAPS de mercado reales y actuales.
 
 FORMATO JSON (SIN Markdown):
 {
   "gaps": [
     { "gap": "...", "tacticalResponse": "...", "relevanceScore": 45 },
     { "gap": "...", "tacticalResponse": "...", "relevanceScore": 35 },
     { "gap": "...", "tacticalResponse": "...", "relevanceScore": 20 }
   ]
 }`;

    try {
        const text = await callGeminiWithSearch(prompt);
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Invalid JSON response from Gemini");
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("Error in Gemini Gap Detection:", error);
        throw error;
    }
}

/**
 * Generate deep dive implementation guide using Gemini + Search
 */
export async function generateDeepDive(params: {
    strategy: any;
    seed: string;
    lang: string;
}) {
    const { strategy, seed, lang } = params;
    const recommendationsText = strategy.recommendations?.map((r: any) => r.title).join(", ") || "";

    const langMap: Record<string, string> = {
        es: "español",
        ca: "catalán",
        en: "inglés"
    };

    const prompt = `Actúa como consultor senior. Basado en esta estrategia para ${seed}:
 Misión: ${strategy.missionCritical}
 Recomendaciones: ${recommendationsText}
 
 Busca ejemplos reales, proveedores o eventos específicos relacionados para crear una "GUÍA DE IMPLEMENTACIÓN" práctica usando datos de Google Search.
 
 FORMATO: Markdown (Headers ###, Bullets *, Bold **).
 IDIOMA: ${langMap[lang] || "español"}.
 NO devuelvas JSON. Solo el texto Markdown.`;

    try {
        const text = await callGeminiWithSearch(prompt);
        return text.replace(/```markdown/g, "").replace(/```/g, "");
    } catch (error) {
        console.error("Error in Gemini Deep Dive:", error);
        throw error;
    }
}
