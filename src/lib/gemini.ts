import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
const apiKey = process.env.GOOGLE_AI_API_KEY;

if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Use Gemini 2.5 Flash - trying alternative model due to quota limits
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Generate strategic marketing analysis based on asset, market, and budget
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

    const prompt = `Eres un experto estratega de marketing B2B en la industria de ingredientes nutracéuticos y botánicos.

CONTEXTO:
- Ingrediente/Asset: ${seed}
- Mercado objetivo: ${market}
- Presupuesto: €${budget.toLocaleString()}
- Tipo de campaña: ${campaignType === "impact" ? "Alto Impacto (Penetración de Mercado)" : "Mantenimiento de Marca (Fidelización)"}

TAREA:
Genera un análisis estratégico de marketing detallado en ${langMap[lang] || "español"} que incluya:

1. Una "Misión Crítica" (un párrafo de 4-6 líneas) que defina el objetivo estratégico principal para lanzar ${seed} en ${market}.

2. Exactamente 3 recomendaciones clave, cada una debe incluir:
   - Un título descriptivo y específico
   - Una descripción detallada (3-5 líneas) que incluya tácticas concretas y justificación basada en tendencias del mercado

IMPORTANTE:
- Sé específico con nombres de eventos de la industria (ej. Vitafoods Europe para Europa, SupplySide West para USA, Vitafoods Asia para Asia)
- Menciona publicaciones relevantes del sector (NutraIngredients, Nutraceuticals World, etc.)
- Si el presupuesto es bajo (<€10,000), enfócate en tácticas digitales y de bajo costo
- Si el presupuesto es alto (>€50,000), incluye presencia en ferias y campañas multicanal
- Usa terminología técnica del sector: PhytoProof®, Pure-Hydro Process®, EcoVadis, etc.

FORMATO DE SALIDA (JSON):
{
  "missionCritical": "texto de la misión crítica",
  "recommendations": [
    {
      "title": "Título de la recomendación 1",
      "description": "Descripción detallada de la recomendación 1"
    },
    {
      "title": "Título de la recomendación 2",
      "description": "Descripción detallada de la recomendación 2"
    },
    {
      "title": "Título de la recomendación 3",
      "description": "Descripción detallada de la recomendación 3"
    }
  ]
}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Invalid JSON response from AI");
        }

        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
    } catch (error) {
        console.error("Error generating strategy analysis:", error);
        throw error;
    }
}

/**
 * Generate channel mix recommendations
 */
export async function generateChannelMix(params: {
    seed: string;
    market: string;
    audience: string;
    lang: string;
}) {
    const { seed, market, audience, lang } = params;

    const langMap: Record<string, string> = {
        es: "español",
        ca: "catalán",
        en: "inglés"
    };

    const prompt = `Eres un experto en marketing omnicanal para la industria de ingredientes nutracéuticos B2B.

CONTEXTO:
- Ingrediente: ${seed}
- Mercado: ${market}
- Audiencia objetivo: ${audience}

TAREA:
Genera una lista de 4-6 canales de marketing recomendados en ${langMap[lang] || "español"}.

Cada canal debe tener:
- name: Nombre descriptivo del canal
- type: "Digital" o "Traditional"
- relevance: Número entre 0-100 indicando la relevancia para esta campaña
- reasoning: Justificación detallada (2-4 líneas) de por qué este canal es importante

IMPORTANTE:
- Incluye siempre LinkedIn como canal B2B principal
- Si la audiencia es joven (Gen Z, Millennials), incluye Instagram/TikTok
- Adapta eventos a la región (Vitafoods Europe, SupplySide West, etc.)
- Incluye publicaciones especializadas según el mercado
- Si detectas términos de salud específicos (inmune, probióticos, etc.), incluye portales científicos

FORMATO DE SALIDA (JSON):
{
  "channels": [
    {
      "name": "Nombre del canal",
      "type": "Digital",
      "relevance": 95,
      "reasoning": "Justificación detallada"
    }
  ]
}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Invalid JSON response from AI");
        }

        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.channels;
    } catch (error) {
        console.error("Error generating channel mix:", error);
        throw error;
    }
}

/**
 * Generate competitor gap analysis
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

    const prompt = `Eres un analista competitivo de la industria nutracéutica y de ingredientes botánicos.

CONTEXTO:
- Nuestro ingrediente: ${seed}
- Competidor analizado: ${competitor}

TAREA:
Genera un análisis de gap competitivo en ${langMap[lang] || "español"}.

Proporciona:
1. Un array "analysis" con 2-4 dimensiones competitivas, cada una con:
   - dimension: Nombre de la dimensión (ej. "Tecnología de Extracción")
   - us: Nuestra posición/capacidad
   - competitor: Posición del competidor
   - verdict: Veredicto breve (ej. "Ventaja Competitiva", "Paridad", "Brecha")

2. Un "synthesis" (párrafo de 5-8 líneas) con síntesis estratégica que incluya:
   - Análisis del posicionamiento del competidor
   - Nuestra reacción estratégica recomendada
   - Campo de batalla donde podemos ganar

CONTEXTO EUROMED:
- Tenemos Pure-Hydro Process® (extracción solo con agua)
- Certificación EcoVadis Platinum (Top 1% global)
- Modelo "Camp to Lab" con trazabilidad total
- Especialización en extractos de alta pureza

FORMATO DE SALIDA (JSON):
{
  "analysis": [
    {
      "dimension": "Dimensión 1",
      "us": "Nuestra posición",
      "competitor": "Su posición",
      "verdict": "Veredicto"
    }
  ],
  "synthesis": "Síntesis estratégica detallada"
}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Invalid JSON response from AI");
        }

        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
    } catch (error) {
        console.error("Error generating competitor analysis:", error);
        throw error;
    }
}

/**
 * Generate deep dive implementation guide
 */
export async function generateDeepDive(params: {
    strategy: any;
    seed: string;
    lang: string;
}) {
    const { strategy, seed, lang } = params;

    const langMap: Record<string, string> = {
        es: "español",
        ca: "catalán",
        en: "inglés"
    };

    const prompt = `Eres un consultor de implementación estratégica para marketing B2B en nutracéuticos.

CONTEXTO:
Basándote en esta estrategia ya generada:

MISIÓN: ${strategy.missionCritical}

RECOMENDACIONES:
${strategy.recommendations.map((r: any, i: number) => `${i + 1}. ${r.title}: ${r.description}`).join("\n")}

TAREA:
Genera una guía de implementación detallada en formato Markdown en ${langMap[lang] || "español"} que incluya:

1. **Título**: "GUÍA DE IMPLEMENTACIÓN ESTRATÉGICA" con formato bold

2. **Sección 1: Desglose Táctico**
   - Para cada recomendación, proporciona:
     * Investigación de Mercado: Datos o insights de mercado
     * Pasos de Acción: Pasos concretos y accionables
     * KPIs: Métricas específicas

3. **Sección 2: Asignación de Recursos**
   - Equipo necesario
   - Presupuesto adicional recomendado

4. **Sección 3: Mitigación de Riesgos**
   - 2-3 riesgos potenciales
   - Estrategias de mitigación para cada uno

USA FORMATO MARKDOWN:
- Headers con ###
- Listas con *
- Bold con **texto**
- Asset = ${seed}

Devuelve SOLO el contenido markdown, sin JSON.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating deep dive:", error);
        throw error;
    }
}

/**
 * Generate gap detection and tactical response analysis - returns 3 gaps with relevance scores
 */
export async function generateGapDetection(params: {
    seed: string;
    lang: string;
}) {
    const { seed, lang } = params;

    const langMap: Record<string, string> = {
        es: "español",
        ca: "catalán",
        en: "inglés"
    };

    const prompt = `Eres un estratega de marketing B2B especializado en detección de oportunidades de mercado para la industria nutracéutica.

CONTEXTO:
- Ingrediente/Asset analizado: ${seed}
- Necesitamos identificar gaps estratégicos (brechas de mercado) que representen oportunidades de diferenciación

TAREA:
Genera un análisis de detección de gaps en ${langMap[lang] || "español"} que identifique EXACTAMENTE 3 GAPS DIFERENTES.

Para cada gap proporciona:
1. **gap**: Una oportunidad estratégica clara (uno de estos tipos):
   - Nicho no cubierto en el mercado actual
   - Tendencia emergente que los competidores no están aprovechando
   - Problema recurrente de competidores que podemos resolver
   - Necesidad insatisfecha de clientes en el sector

2. **tacticalResponse**: Plan de acción concreto (4-6 líneas) que incluya:
   - Acción específica a tomar para capitalizar el gap
   - Canales o tácticas específicas a utilizar
   - Timeline aproximado de implementación
   - Ventaja competitiva esperada

3. **relevanceScore**: Un número entre 0 y 100 que indica qué tan buena oportunidad representa este gap.
   - La suma de los 3 relevanceScores debe ser 100
   - El gap con mayor score es la "Mejor Opción"

IMPORTANTE:
- Sé específico con cada gap detectado
- Las respuestas tácticas deben ser accionables y concretas
- Usa datos del sector nutracéutico cuando sea posible
- Menciona ferias específicas (Vitafoods, SupplySide), publicaciones (NutraIngredients), o certificaciones relevantes
- Los gaps deben ser realistas y basados en tendencias actuales del mercado
- Cada gap debe ser DIFERENTE y abordar un área distinta

FORMATO DE SALIDA (JSON):
{
  "gaps": [
    {
      "gap": "Descripción detallada del gap 1",
      "tacticalResponse": "Plan de acción táctico detallado para gap 1",
      "relevanceScore": 45
    },
    {
      "gap": "Descripción detallada del gap 2",
      "tacticalResponse": "Plan de acción táctico detallado para gap 2",
      "relevanceScore": 35
    },
    {
      "gap": "Descripción detallada del gap 3",
      "tacticalResponse": "Plan de acción táctico detallado para gap 3",
      "relevanceScore": 20
    }
  ]
}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Invalid JSON response from AI");
        }

        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
    } catch (error) {
        console.error("Error generating gap detection:", error);
        throw error;
    }
}
