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
 * Helper function to call Gemini API with Google Search Grounding
 */
async function callGeminiWithSearch(prompt: string): Promise<string> {
    const genAI = getGeminiClient();

    try {
        const response = await genAI.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        return response.text || "";
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
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
