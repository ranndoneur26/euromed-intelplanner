"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "es" | "ca";

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        "dashboard": "Dashboard",
        "strategy": "Strategy",
        "channels": "Channels",
        "roi": "ROI",
        "timeline": "Timeline",
        "rivalIntel": "Rival Intel",
        "welcome": "Welcome to your advanced market intelligence dashboard.",
        "subtitle": "Select a module to begin strategic planning.",
        "footer": "Euromed IntelPlanner. Advanced Marketing Intelligence.",

        // Strategy
        "strategicPlanning": "Strategic Planning",
        "strategySubtitle": "Euromed © Intelligent strategic marketing directives.",
        "inputParameters": "Input Parameters",
        "strategicAsset": "Strategic Asset/Fair/Brochures",
        "campaignType": "Campaign Type",
        "impactCampaign": "Impact Campaign",
        "brandMaintenance": "Brand Maintenance",
        "targetMarket": "Target Market",
        "budgetAllocation": "Budget Allocation (EUR)",
        "generateStrategy": "Generate Strategy",
        "generating": "Generating Strategy...",
        "missionCritical": "MISSION CRITICAL",
        "keyRecommendations": "Key Recommendations",
        "downloadReport": "Download Report (.txt)",
        "minBudgetError": "Minimum budget required is €5,000 EUR to ensure viable strategic impact.",
        "expandInfo": "Expand Information (Deep Dive)",
        "processingDual": "Deep Learning: Processing AI Models...",
        "implementationGuide": "Strategic Implementation Guide",
        "deepDiveTitle": "Dual-AI Deep Dive Analysis",

        // Tooltips
        "tooltipCampaignType": "**Impact Campaign:**\nAggressive launch strategy focused on rapid market penetration and creating immediate awareness. Best for new product launches or entering new markets.\n\n**Brand Maintenance:**\nSustained presence strategy focused on retention and reinforcing existing relationships. Best for established products with loyal customer base.",
        "tooltipTargetMarket": "The primary geographic region where your marketing efforts will focus. Consider cultural nuances, regulatory requirements, and market maturity when selecting.",
        "tooltipBudget": "Minimum €5,000 required. Budget determines the scope of market intelligence and strategic depth available.",
        "tooltipTargetAudience": "Define your ideal customer profile: industry professionals, decision-makers, or end consumers. Be specific about job titles and company types.",
        "tooltipROIInvestment": "Total marketing and campaign investment for the period. Includes media, production, events, and agency fees.",
        "tooltipROIRevenue": "Expected revenue generated from this investment. Be conservative in estimates for accurate viability assessment.",
        "tooltipSector": "Industry vertical affects growth projections. Plant-based sector has 10.6% CAGR, which influences ROI calculations.",
        "tooltipGeoMarket": "Geographic markets have different penetration costs. APAC requires higher budgets for high-density markets like India/China.",

        // Channels
        "omnichannelMix": "Omnichannel Mix",
        "channelsSubtitle": "Optimize media allocation across digital and traditional landscapes.",
        "marketParameters": "Market Parameters",
        "targetGeo": "Target Geographic Market",
        "targetAudience": "Target Audience / Persona",
        "generateMix": "Generate Mix",
        "analyzing": "Analyzing...",
        "recommendedMix": "Recommended Channel Mix",
        "match": "Match",

        // ROI
        "roiAnalysis": "ROI Analysis",
        "roiSubtitle": "Financial projections and local viability assessment.",
        "financialInputs": "Financial Inputs",
        "totalInvestment": "Total Investment (EUR)",
        "projectedRevenue": "Projected Annual Revenue",
        "calculateViability": "Calculate Viability",
        "calculating": "Calculating...",
        "projectedPerformance": "Projected Performance (Year 1)",
        "enterData": "Enter financial data to generate projections.",
        "investment": "Investment",
        "projectedReturn": "Projected Return",

        // Timeline
        "predictiveTimeline": "Predictive Timeline",
        "timelineSubtitle": "2-Year strategic roadmap generator.",
        "roadmapConfig": "Roadmap Configuration",
        "campaignStart": "Campaign Start Date",
        "generateRoadmap": "Generate Roadmap",
        "forecasting": "Forecasting...",
        "temporalProgramming": "Temporal Programming",
        "sector": "Sector",

        // Rival Intel
        "competitorGap": "Competitor Gap Analysis & Opportunity Detection",
        "targetCompetitor": "Target Competitor",
        "competitorName": "Competitor Name / Brand",
        "runAnalysis": "Run Gap Analysis",
        "scanning": "Scanning...",
        "gapReport": "Comparative Gap Report",
        "dimension": "Dimension",
        "euromedPosition": "Euromed Position",
        "verdict": "Verdict",
        "competitor": "Competitor",
        "detectGaps": "Detect Gaps",
        "detectingGaps": "Detecting Gaps...",
        "detectedGap": "Detected Gap",
        "tacticalResponse": "Tactical Response"
    },
    es: {
        "dashboard": "Panel de Control",
        "strategy": "Estrategia",
        "channels": "Canales",
        "roi": "ROI",
        "timeline": "Cronograma",
        "rivalIntel": "Intel Rival",
        "welcome": "Bienvenido a su panel de inteligencia de mercado avanzada.",
        "subtitle": "Seleccione un módulo para comenzar la planificación estratégica.",
        "footer": "Euromed IntelPlanner. Inteligencia de Marketing Avanzada.",

        // Strategy
        "strategicPlanning": "Planificación Estratégica",
        "strategySubtitle": "Euromed © directrices estratégicas inteligentes de marketing.",
        "inputParameters": "Parámetros de Entrada",
        "strategicAsset": "Activo Estratégico/Feria/Brochures",
        "campaignType": "Tipo de Campaña",
        "impactCampaign": "Campaña por Impacto",
        "brandMaintenance": "Mantenimiento de Marca",
        "targetMarket": "Mercado Objetivo",
        "budgetAllocation": "Asignación Presupuestaria (EUR)",
        "generateStrategy": "Generar Estrategia",
        "generating": "Generando Estrategia...",
        "missionCritical": "MISIÓN CRÍTICA",
        "keyRecommendations": "Recomendaciones Clave",
        "downloadReport": "Descargar Informe (.txt)",
        "minBudgetError": "El presupuesto mínimo requerido es de €5,000 EUR para asegurar un impacto estratégico viable.",
        "expandInfo": "Ampliar Información (Deep Dive)",
        "processingDual": "Deep Learning: Procesando Modelos de IA...",
        "implementationGuide": "Guía de Implementación Estratégica",
        "deepDiveTitle": "Análisis Deep Dive (Dual-AI)",

        // Tooltips
        "tooltipCampaignType": "**Campaña por Impacto:**\nEstrategia de lanzamiento agresiva enfocada en penetración rápida de mercado y crear conciencia inmediata. Ideal para lanzamientos de nuevos productos o entrada a nuevos mercados.\n\n**Mantenimiento de Marca:**\nEstrategia de presencia sostenida enfocada en retención y refuerzo de relaciones existentes. Ideal para productos establecidos con base de clientes leales.",
        "tooltipTargetMarket": "La región geográfica principal donde se enfocarán tus esfuerzos de marketing. Considera matices culturales, requisitos regulatorios y madurez del mercado.",
        "tooltipBudget": "Mínimo €5,000 requerido. El presupuesto determina el alcance de inteligencia de mercado y profundidad estratégica disponible.",
        "tooltipTargetAudience": "Define tu perfil de cliente ideal: profesionales de la industria, tomadores de decisiones o consumidores finales. Sé específico sobre títulos y tipos de empresa.",
        "tooltipROIInvestment": "Inversión total de marketing y campaña para el período. Incluye medios, producción, eventos y honorarios de agencia.",
        "tooltipROIRevenue": "Ingresos esperados generados por esta inversión. Sé conservador en las estimaciones para una evaluación de viabilidad precisa.",
        "tooltipSector": "El sector vertical afecta las proyecciones de crecimiento. El sector Plant-based tiene 10.6% CAGR, lo que influye en cálculos de ROI.",
        "tooltipGeoMarket": "Los mercados geográficos tienen diferentes costos de penetración. APAC requiere presupuestos más altos para mercados de alta densidad como India/China.",

        // Channels
        "omnichannelMix": "Mix Omnicanal",
        "channelsSubtitle": "Optimice la asignación de medios en paisajes digitales y tradicionales.",
        "marketParameters": "Parámetros del Mercado",
        "targetGeo": "Mercado Geográfico Objetivo",
        "targetAudience": "Audiencia / Persona Objetivo",
        "generateMix": "Generar Mix",
        "analyzing": "Analizando...",
        "recommendedMix": "Mix de Canales Recomendado",
        "match": "Coincidencia",

        // ROI
        "roiAnalysis": "Análisis de ROI",
        "roiSubtitle": "Proyecciones financieras y evaluación de viabilidad local.",
        "financialInputs": "Entradas Financieras",
        "totalInvestment": "Inversión Total (EUR)",
        "projectedRevenue": "Ingresos Anuales Proyectados",
        "calculateViability": "Calcular Viabilidad",
        "calculating": "Calculando...",
        "projectedPerformance": "Rendimiento Proyectado (Año 1)",
        "enterData": "Ingrese datos financieros para generar proyecciones.",
        "investment": "Inversión",
        "projectedReturn": "Retorno Proyectado",

        // Timeline
        "predictiveTimeline": "Cronograma Predictivo",
        "timelineSubtitle": "Generador de hoja de ruta estratégica a 2 años.",
        "roadmapConfig": "Configuración de Hoja de Ruta",
        "campaignStart": "Fecha de Inicio de Campaña",
        "generateRoadmap": "Generar Hoja de Ruta",
        "forecasting": "Pronosticando...",
        "temporalProgramming": "Programación Temporal",
        "sector": "Sector",

        // Rival Intel
        "competitorGap": "Análisis de Brechas y Detección de Oportunidades",
        "targetCompetitor": "Competidor Objetivo",
        "competitorName": "Nombre / Marca del Competidor",
        "runAnalysis": "Ejecutar Análisis",
        "scanning": "Escaneando...",
        "gapReport": "Informe Comparativo de Brechas",
        "dimension": "Dimensión",
        "euromedPosition": "Posición Euromed",
        "verdict": "Veredicto",
        "competitor": "Competidor",
        "detectGaps": "Gaps Detectados",
        "detectingGaps": "Detectando Gaps...",
        "detectedGap": "Gap Detectado",
        "tacticalResponse": "Respuesta Táctica"
    },
    ca: {
        "dashboard": "Tauler de Control",
        "strategy": "Estratègia",
        "channels": "Canals",
        "roi": "ROI",
        "timeline": "Cronograma",
        "rivalIntel": "Intel Rival",
        "welcome": "Benvingut al vostre tauler d'intel·ligència de mercat avançat.",
        "subtitle": "Seleccioneu un mòdul per començar la planificació estratègica.",
        "footer": "Euromed IntelPlanner. Intel·ligència de Màrqueting Avançada.",

        // Strategy
        "strategicPlanning": "Planificació Estratègica",
        "strategySubtitle": "Euromed © directrius estratègiques intel·ligents de màrqueting.",
        "inputParameters": "Paràmetres d'Entrada",
        "strategicAsset": "Actiu Estratègic/Fira/Fullets",
        "campaignType": "Tipus de Campanya",
        "impactCampaign": "Campanya per Impacte",
        "brandMaintenance": "Manteniment de Marca",
        "targetMarket": "Mercat Objectiu",
        "budgetAllocation": "Assignació Pressupostària (EUR)",
        "generateStrategy": "Generar Estratègia",
        "generating": "Generant Estratègia...",
        "missionCritical": "MISSIÓ CRÍTICA",
        "keyRecommendations": "Recomanacions Clau",
        "downloadReport": "Descarregar Informe (.txt)",
        "minBudgetError": "El pressupost mínim requerit és de €5,000 EUR per assegurar un impacte estratègic viable.",
        "expandInfo": "Ampliar Informació (Deep Dive)",
        "processingDual": "Deep Learning: Processant Models d'IA...",
        "implementationGuide": "Guia d'Implementació Estratègica",
        "deepDiveTitle": "Anàlisi Deep Dive (Dual-AI)",

        // Tooltips
        "tooltipCampaignType": "**Campanya per Impacte:**\nEstratègia de llançament agressiva enfocada en penetració ràpida de mercat i crear consciència immediata. Ideal per a llançaments de nous productes o entrada a nous mercats.\n\n**Manteniment de Marca:**\nEstratègia de presència sostinguda enfocada en retenció i reforç de relacions existents. Ideal per a productes establerts amb base de clients lleials.",
        "tooltipTargetMarket": "La regió geogràfica principal on es centraran els teus esforços de màrqueting. Considera matisos culturals, requisits regulatoris i maduresa del mercat.",
        "tooltipBudget": "Mínim €5,000 requerit. El pressupost determina l'abast d'intel·ligència de mercat i profunditat estratègica disponible.",
        "tooltipTargetAudience": "Defineix el teu perfil de client ideal: professionals de la indústria, prenedors de decisions o consumidors finals. Sigues específic sobre títols i tipus d'empresa.",
        "tooltipROIInvestment": "Inversió total de màrqueting i campanya per al període. Inclou mitjans, producció, esdeveniments i honoraris d'agència.",
        "tooltipROIRevenue": "Ingressos esperats generats per aquesta inversió. Sigues conservador en les estimacions per a una avaluació de viabilitat precisa.",
        "tooltipSector": "El sector vertical afecta les projeccions de creixement. El sector Plant-based té 10.6% CAGR, cosa que influeix en càlculs de ROI.",
        "tooltipGeoMarket": "Els mercats geogràfics tenen diferents costos de penetració. APAC requereix pressupostos més alts per a mercats d'alta densitat com Índia/Xina.",

        // Channels
        "omnichannelMix": "Mix Omnicanal",
        "channelsSubtitle": "Optimitzeu l'assignació de mitjans en paisatges digitals i tradicionals.",
        "marketParameters": "Paràmetres del Mercat",
        "targetGeo": "Mercat Geogràfic Objectiu",
        "targetAudience": "Audiència / Persona Objectiu",
        "generateMix": "Generar Mix",
        "analyzing": "Analitzant...",
        "recommendedMix": "Mix de Canals Recomanat",
        "match": "Coincidència",

        // ROI
        "roiAnalysis": "Anàlisi de ROI",
        "roiSubtitle": "Projeccions financeres i avaluació de viabilitat local.",
        "financialInputs": "Entrades Financeres",
        "totalInvestment": "Inversió Total (EUR)",
        "projectedRevenue": "Ingressos Anuals Projectats",
        "calculateViability": "Calcular Viabilitat",
        "calculating": "Calculant...",
        "projectedPerformance": "Rendiment Projectat (Any 1)",
        "enterData": "Introduïu dades financeres per generar projeccions.",
        "investment": "Inversió",
        "projectedReturn": "Retorn Projectat",

        // Timeline
        "predictiveTimeline": "Cronograma Predictiu",
        "timelineSubtitle": "Generador de full de ruta estratègic a 2 anys.",
        "roadmapConfig": "Configuració del Full de Ruta",
        "campaignStart": "Data d'Inici de Campanya",
        "generateRoadmap": "Generar Full de Ruta",
        "forecasting": "Pronosticant...",
        "temporalProgramming": "Programació Temporal",
        "sector": "Sector",

        // Rival Intel
        "competitorGap": "Anàlisi de Bretxes i Detecció d'Oportunitats",
        "targetCompetitor": "Competidor Objectiu",
        "competitorName": "Nom / Marca del Competidor",
        "runAnalysis": "Executar Anàlisi",
        "scanning": "Escanejant...",
        "gapReport": "Informe Comparatiu de Bretxes",
        "dimension": "Dimensió",
        "euromedPosition": "Posició Euromed",
        "verdict": "Veredicte",
        "competitor": "Competidor",
        "detectGaps": "Gaps Detectats",
        "detectingGaps": "Detectant Gaps...",
        "detectedGap": "Gap Detectat",
        "tacticalResponse": "Resposta Tàctica"
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Language>("es");

    const t = (key: string) => {
        return translations[lang][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
