import Groq from "groq-sdk";

// Lazy-initialize the Groq client to prevent build-time failures
let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not defined in environment variables");
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

// Use Llama 3.3 70B - powerful and fast model
const MODEL = "llama-3.3-70b-versatile";

/**
 * Helper function to call Groq API and parse JSON response
 */
async function callGroq(prompt: string): Promise<string> {
  const groq = getGroqClient();
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: MODEL,
    temperature: 0.7,
    max_tokens: 4096,
    response_format: { type: "json_object" },
  });

  return completion.choices[0]?.message?.content || "";
}

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

2. Una "Evaluación de Presupuesto":
   - Analiza si el presupuesto de €${budget.toLocaleString()} es "Bajo", "Adecuado" o "Alto" para una campaña de ${campaignType === "impact" ? "Alto Impacto" : "Mantenimiento"} en el mercado ${market}.
   - Ten en cuenta los costos reales de medios, ferias y agencias en ese mercado específico.
   - Proporciona un presupuesto recomendado estimado para lograr los objetivos óptimamente.

3. Exactamente 3 recomendaciones clave, cada una debe incluir:
   - Un título descriptivo y específico
   - Una descripción detallada (3-5 líneas) que incluya tácticas concretas y justificación basada en tendencias del mercado

IMPORTANTE:
- Sé específico con nombres de eventos de la industria (ej. Vitafoods Europe para Europa, SupplySide West para USA, Vitafoods Asia para Asia)
- Menciona publicaciones relevantes del sector (NutraIngredients, Nutraceuticals World, etc.)
- Si el presupuesto es bajo (<€10,000), enfócate en tácticas digitales y de bajo costo
- Si el presupuesto es alto (>€50,000), incluye presencia en ferias y campañas multicanal
- Usa terminología técnica del sector: PhytoProof®, Pure-Hydro Process®, EcoVadis, etc.

FORMATO DE SALIDA (JSON válido, sin comentarios):
{
  "missionCritical": "texto de la misión crítica",
  "budgetEvaluation": {
    "assessment": "Bajo" | "Adecuado" | "Alto",
    "analysis": "Análisis detallado de por qué el presupuesto es X, analizando costes de impacto o mantenimiento en el mercado seleccionado",
    "recommendedBudget": "€XX,XXX - €XX,XXX"
  },
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
}

Responde SOLO con el JSON, sin texto adicional.`;

  try {
    const text = await callGroq(prompt);

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

FORMATO DE SALIDA (JSON válido):
{
  "channels": [
    {
      "name": "Nombre del canal",
      "type": "Digital",
      "relevance": 95,
      "reasoning": "Justificación detallada"
    }
  ]
}

Responde SOLO con el JSON, sin texto adicional.`;

  try {
    const text = await callGroq(prompt);

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
 * Generate competitor gap analysis - deep investigation of pros and cons relative to our seed
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

  const prompt = `Eres un analista competitivo senior de la industria nutracéutica y de ingredientes botánicos. Tu especialidad es realizar investigaciones profundas sobre competidores.

CONTEXTO CRÍTICO:
- NUESTRO INGREDIENTE/ASSET (Seed): "${seed}"
- COMPETIDOR A ANALIZAR: "${competitor}"

TAREA PRINCIPAL:
Realiza una investigación profunda del competidor "${competitor}" en relación DIRECTA con nuestro ingrediente "${seed}". 
Debes analizar cómo se posiciona "${competitor}" frente a "${seed}" en el mercado de ingredientes nutracéuticos.

Genera un análisis de gap competitivo completo en ${langMap[lang] || "español"} que incluya:

1. **analysis**: Un array de 4-5 dimensiones competitivas ESPECÍFICAS para ${seed} vs ${competitor}:
   - dimension: Nombre de la dimensión competitiva (ej. "Tecnología de Extracción", "Pureza del Extracto", "Certificaciones", "Sostenibilidad", "Precio/Valor")
   - us: Nuestra posición/fortaleza con ${seed} (sé específico)
   - competitor: Posición/capacidad de ${competitor} (investiga profundamente sus pros y contras)
   - verdict: Veredicto claro - uno de: "✅ Ventaja Nuestra", "⚖️ Paridad", "⚠️ Brecha a Cerrar", "🎯 Oportunidad"

2. **competitorStrengths**: Array de 2-3 fortalezas REALES que ${competitor} tiene sobre ${seed}
   - Sé objetivo y honesto sobre donde el competidor es fuerte

3. **competitorWeaknesses**: Array de 2-3 debilidades de ${competitor} que podemos explotar
   - Identifica puntos vulnerables del competidor

4. **synthesis**: Párrafo estratégico de 6-8 líneas que incluya:
   - Análisis del posicionamiento de ${competitor} vs ${seed}
   - Nuestras ventajas competitivas clave con ${seed}
   - Campo de batalla donde podemos ganar
   - Recomendación estratégica clara

5. **actionPlan**: Array de 3 acciones estratégicas concretas para ganar a ${competitor}

CONTEXTO DE NUESTRO INGREDIENTE ${seed} (EUROMED):
- Pure-Hydro Process® (extracción solo con agua, sin solventes químicos)
- Certificación EcoVadis Platinum (Top 1% global en sostenibilidad)
- Modelo "Camp to Lab" con trazabilidad total desde el origen
- Especialización en extractos de alta pureza y estandarizados
- Cultivos propios y controlados para consistencia de calidad

INVESTIGACIÓN REQUERIDA SOBRE ${competitor}:
- ¿Qué tecnología de extracción usa ${competitor}?
- ¿Tiene certificaciones comparables?
- ¿Cuál es su modelo de sourcing?
- ¿Qué ventajas de precio/escala tiene?
- ¿Dónde es más fuerte en el mercado?

FORMATO DE SALIDA (JSON válido):
{
  "analysis": [
    {
      "dimension": "Tecnología de Extracción",
      "us": "Pure-Hydro Process® con ${seed} - extracción solo con agua",
      "competitor": "Descripción de la tecnología de ${competitor}",
      "verdict": "✅ Ventaja Nuestra"
    },
    {
      "dimension": "Certificaciones y Sostenibilidad",
      "us": "EcoVadis Platinum + certificaciones específicas",
      "competitor": "Certificaciones de ${competitor}",
      "verdict": "⚖️ Paridad"
    }
  ],
  "competitorStrengths": [
    "Fortaleza 1 de ${competitor}",
    "Fortaleza 2 de ${competitor}"
  ],
  "competitorWeaknesses": [
    "Debilidad 1 de ${competitor} que podemos explotar",
    "Debilidad 2 de ${competitor}"
  ],
  "synthesis": "Síntesis estratégica profunda de cómo ${seed} se posiciona contra ${competitor}...",
  "actionPlan": [
    "Acción estratégica 1 para ganar cuota a ${competitor}",
    "Acción estratégica 2",
    "Acción estratégica 3"
  ]
}

Responde SOLO con el JSON válido, sin texto adicional.`;

  try {
    const text = await callGroq(prompt);

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

  // Validate strategy object
  if (!strategy || !strategy.missionCritical) {
    throw new Error("Invalid strategy object - missing missionCritical");
  }

  const recommendations = strategy.recommendations || [];
  const recommendationsText = recommendations.length > 0
    ? recommendations.map((r: any, i: number) => `${i + 1}. ${r.title || 'Recomendación'}: ${r.description || ''}`).join("\n")
    : "No hay recomendaciones disponibles";

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
${recommendationsText}

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
    const text = await callGroq(prompt);

    if (!text || text.trim() === '') {
      throw new Error("Empty response from AI");
    }

    return text;
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
  market: string;
  lang: string;
}) {
  const { seed, market, lang } = params;

  const langMap: Record<string, string> = {
    es: "español",
    ca: "catalán",
    en: "inglés"
  };

  const marketContext = market
    ? `- Mercado geográfico objetivo: ${market}`
    : "- Mercado geográfico objetivo: Global";

  const prompt = `Eres un estratega de marketing B2B especializado en detección de oportunidades de mercado para la industria nutracéutica.

CONTEXTO:
- Ingrediente/Asset analizado: ${seed}
${marketContext}
- Necesitamos identificar gaps estratégicos (brechas de mercado) que representen oportunidades de diferenciación EN EL MERCADO ESPECÍFICO

TAREA:
Genera un análisis de detección de gaps en ${langMap[lang] || "español"} que identifique EXACTAMENTE 3 GAPS DIFERENTES específicos para el mercado ${market || "global"}.

Para cada gap proporciona:
1. **gap**: Una oportunidad estratégica clara específica para ${market || "el mercado global"} (uno de estos tipos):
   - Nicho no cubierto en el mercado ${market || "global"} actual
   - Tendencia emergente en ${market || "el mercado global"} que los competidores no están aprovechando
   - Problema recurrente de competidores en ${market || "el mercado global"} que podemos resolver
   - Necesidad insatisfecha de clientes en el sector en ${market || "el mercado global"}

2. **tacticalResponse**: Plan de acción concreto (4-6 líneas) que incluya:
   - Acción específica a tomar para capitalizar el gap EN ${market || "el mercado global"}
   - Canales o tácticas específicas a utilizar en esa región
   - Timeline aproximado de implementación
   - Ventaja competitiva esperada

3. **relevanceScore**: Un número entre 0 y 100 que indica qué tan buena oportunidad representa este gap.
   - La suma de los 3 relevanceScores debe ser 100
   - El gap con mayor score es la "Mejor Opción"

IMPORTANTE:
- Sé específico con cada gap detectado PARA EL MERCADO ${market || "GLOBAL"}
- Las respuestas tácticas deben ser accionables y concretas para esa región
- Usa datos del sector nutracéutico cuando sea posible
- Menciona ferias específicas según la región (Vitafoods Europe para Europa, SupplySide West para USA, Vitafoods Asia para Asia)
- Menciona publicaciones relevantes para la región (NutraIngredients, Nutraceuticals World)
- Los gaps deben ser realistas y basados en tendencias actuales del mercado EN ESA REGIÓN
- Cada gap debe ser DIFERENTE y abordar un área distinta

FORMATO DE SALIDA (JSON válido):
{
  "gaps": [
    {
      "gap": "Descripción detallada del gap 1 específico para ${market || "el mercado global"}",
      "tacticalResponse": "Plan de acción táctico detallado para gap 1",
      "relevanceScore": 45
    },
    {
      "gap": "Descripción detallada del gap 2 específico para ${market || "el mercado global"}",
      "tacticalResponse": "Plan de acción táctico detallado para gap 2",
      "relevanceScore": 35
    },
    {
      "gap": "Descripción detallada del gap 3 específico para ${market || "el mercado global"}",
      "tacticalResponse": "Plan de acción táctico detallado para gap 3",
      "relevanceScore": 20
    }
  ]
}

Responde SOLO con el JSON, sin texto adicional.`;

  try {
    const text = await callGroq(prompt);

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

FORMATO DE SALIDA (JSON válido):
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
}

Responde SOLO con el JSON, sin texto adicional.`;

  try {
    const text = await callGroq(prompt);

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

/**
 * Generate detailed timeline roadmap based on the seed/asset
 */
export async function generateTimelineRoadmap(params: {
  seed: string;
  campaignType: "Impact" | "Maintenance";
  startDate: string;
  market?: string;
  lang: string;
}) {
  const { seed, campaignType, startDate, market, lang } = params;

  const langMap: Record<string, string> = {
    es: "español",
    ca: "catalán",
    en: "inglés"
  };

  const startDateObj = new Date(startDate);
  const formattedDate = startDateObj.toLocaleDateString(lang === 'es' ? 'es-ES' : lang === 'ca' ? 'ca-ES' : 'en-US', { year: 'numeric', month: 'long' });

  const prompt = `Eres un estratega de marketing B2B especializado en lanzamientos de ingredientes nutracéuticos y botánicos.

CONTEXTO:
- Ingrediente/Asset: ${seed}
- Tipo de campaña: ${campaignType === "Impact" ? "Alto Impacto (Lanzamiento/Penetración)" : "Mantenimiento de Marca (Fidelización)"}
- Fecha de inicio: ${formattedDate}
${market ? `- Mercado objetivo: ${market}` : ""}

TAREA:
Genera una hoja de ruta de marketing detallada y específica para "${seed}" en ${langMap[lang] || "español"}.

${campaignType === "Impact" ? `
Para una campaña de IMPACTO (lanzamiento), incluye:
- Fase de pre-lanzamiento (preparación de materiales, PR)
- Lanzamiento coordinado (digital + eventos)
- Validación técnica (webinars, white papers)
- Conversión (sampling, reuniones comerciales)
- Consolidación (case studies, testimoniales)
` : `
Para una campaña de MANTENIMIENTO, incluye:
- Refuerzo de credenciales y certificaciones
- Publicación de casos de éxito
- Comunicación de innovaciones incrementales
- Renovación de acuerdos con clientes
- Planificación del siguiente ciclo
`}

Proporciona:

1. **milestones**: Array de 5-7 hitos con:
   - phase: Número de fase ("Fase 1", "Phase 1", etc.)
   - monthOffset: Meses desde la fecha de inicio (0, 1, 2, 3...)
   - title: Título descriptivo y específico para ${seed}
   - description: Descripción detallada (3-5 líneas) con tácticas concretas, mencionando el ingrediente
   - keyActions: Array de 3-4 acciones específicas a realizar
   - kpis: Array de 2-3 KPIs para medir el éxito de esta fase
   - budget: Porcentaje del presupuesto total para esta fase (suma = 100)

2. **criticalDeadlines**: Array de 1-3 deadlines críticos:
   - date: Fecha aproximada o mes
   - title: Título del deadline
   - description: Por qué es crítico
   - urgency: "high", "medium" o "low"

3. **recommendations**: Array de 3 recomendaciones estratégicas generales

IMPORTANTE:
- Menciona el ingrediente "${seed}" en los títulos y descripciones
- Incluye eventos relevantes del sector (Vitafoods Europe mayo-junio, SupplySide West octubre-noviembre, CPhI noviembre)
- Menciona publicaciones específicas (NutraIngredients, Nutraceuticals World, Food Technology Magazine)
- Sé específico con las tácticas: tipos de contenido, canales, formatos
- Las acciones deben ser accionables y medibles
- Adapta el contenido al tipo de campaña (Impact vs Maintenance)

FORMATO DE SALIDA (JSON válido):
{
  "milestones": [
    {
      "phase": "Fase 1",
      "monthOffset": 0,
      "title": "Pre-lanzamiento de ${seed}",
      "description": "Descripción detallada...",
      "keyActions": ["Acción 1", "Acción 2", "Acción 3"],
      "kpis": ["KPI 1", "KPI 2"],
      "budget": 20
    }
  ],
  "criticalDeadlines": [
    {
      "date": "Mayo 2025",
      "title": "Vitafoods Europe",
      "description": "...",
      "urgency": "high"
    }
  ],
  "recommendations": [
    "Recomendación 1",
    "Recomendación 2",
    "Recomendación 3"
  ]
}

Responde SOLO con el JSON, sin texto adicional.`;

  try {
    const text = await callGroq(prompt);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from AI");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;
  } catch (error) {
    console.error("Error generating timeline roadmap:", error);
    throw error;
  }
}
