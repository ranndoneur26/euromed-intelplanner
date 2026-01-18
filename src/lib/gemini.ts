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

/**
 * Generate comprehensive ROI analysis based on the seed/asset
 */
export async function generateROIAnalysis(params: {
    seed: string;
    investment: number;
    projectedRevenue: number;
    region: string;
    sector: string;
    lang: string;
}) {
    const { seed, investment, projectedRevenue, region, sector, lang } = params;

    const langMap: Record<string, string> = {
        es: "español",
        ca: "catalán",
        en: "inglés"
    };

    const multiplier = projectedRevenue / (investment || 1);

    const prompt = `Eres un analista financiero especializado en inversiones de marketing para ingredientes nutracéuticos B2B.

CONTEXTO:
- Ingrediente/Asset: ${seed}
- Inversión total: €${investment.toLocaleString()}
- Ingresos proyectados: €${projectedRevenue.toLocaleString()}
- Multiplicador ROI: ${multiplier.toFixed(2)}x
- Región objetivo: ${region}
- Sector: ${sector}

TAREA:
Genera un análisis de ROI completo y profesional en ${langMap[lang] || "español"} específico para el ingrediente "${seed}".

Proporciona:

1. **quarterlyProjection**: Array de 4 objetos (Q1-Q4) con proyecciones financieras basadas en el comportamiento típico de lanzamiento de ingredientes como ${seed}:
   - quarter: "Q1", "Q2", "Q3", "Q4"
   - investment: Porcentaje de inversión en ese trimestre (número entero, suma = 100)
   - revenue: Porcentaje de retorno en ese trimestre (número entero, suma = 100)
   - cumulativeROI: ROI acumulado hasta ese trimestre (número decimal, ej: -0.35, 0.10, 0.45, 1.20)

2. **channelAllocation**: Array de 5 canales de inversión recomendados para ${seed}:
   - channel: Nombre del canal
   - percentage: Porcentaje del presupuesto (suma = 100)
   - rationale: Justificación breve (1-2 líneas)

3. **riskAssessment**: Objeto con:
   - level: "Low", "Medium" o "High"
   - score: Número 1-100 (1-33 = Low, 34-66 = Medium, 67-100 = High)
   - factors: Array de 3 strings con factores de riesgo específicos para ${seed}

4. **executiveSummary**: Párrafo de 5-7 líneas con resumen ejecutivo que incluya:
   - Evaluación de viabilidad específica para ${seed}
   - Punto de equilibrio (break-even) estimado
   - Recomendación estratégica
   - Mencionar datos de mercado relevantes para ${seed}

5. **keyMetrics**: Objeto con:
   - breakEvenQuarter: "Q1", "Q2", "Q3" o "Q4"
   - expectedCAGR: Número decimal (ej: 12.5 para 12.5%)
   - marketPenetration: Número decimal esperado (ej: 3.5 para 3.5%)
   - paybackPeriod: Número de meses

IMPORTANTE:
- Considera que ${seed} es un ingrediente botánico/nutracéutico
- Si inversión < €10,000, marca como riesgo alto de "inversión insuficiente"
- Si región es APAC y inversión < €20,000, advertir sobre volumen insuficiente
- Si sector es Plant-based, el CAGR debería reflejar el 10.6% del sector
- Las proyecciones deben ser realistas para un ingrediente B2B
- El análisis debe ser específico y mencionar el ingrediente por nombre

FORMATO DE SALIDA (JSON):
{
  "quarterlyProjection": [
    {"quarter": "Q1", "investment": 40, "revenue": 5, "cumulativeROI": -0.35},
    {"quarter": "Q2", "investment": 30, "revenue": 20, "cumulativeROI": -0.10},
    {"quarter": "Q3", "investment": 20, "revenue": 35, "cumulativeROI": 0.25},
    {"quarter": "Q4", "investment": 10, "revenue": 40, "cumulativeROI": 0.80}
  ],
  "channelAllocation": [
    {"channel": "Trade Shows", "percentage": 35, "rationale": "Vital for B2B connections"},
    {"channel": "Digital Marketing", "percentage": 25, "rationale": "..."},
    {"channel": "Content Marketing", "percentage": 20, "rationale": "..."},
    {"channel": "Direct Sales", "percentage": 15, "rationale": "..."},
    {"channel": "PR", "percentage": 5, "rationale": "..."}
  ],
  "riskAssessment": {
    "level": "Medium",
    "score": 45,
    "factors": ["Factor 1", "Factor 2", "Factor 3"]
  },
  "executiveSummary": "Resumen ejecutivo detallado...",
  "keyMetrics": {
    "breakEvenQuarter": "Q3",
    "expectedCAGR": 15.5,
    "marketPenetration": 2.8,
    "paybackPeriod": 9
  }
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
        console.error("Error generating ROI analysis:", error);
        throw error;
    }
}
