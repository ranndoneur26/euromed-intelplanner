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
        "footer": "Euromed IntelPlanner. Powered by Gemini 3 Pro.",

        // Strategy
        "strategicPlanning": "Strategic Planning",
        "strategySubtitle": "Define your mission and receive strategic marketing directives.",
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
        "processingDual": "Deep Learning: Integrating Gemini & Perplexity Models...",
        "implementationGuide": "Strategic Implementation Guide",
        "deepDiveTitle": "Dual-AI Deep Dive Analysis",

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
        "competitor": "Competitor"
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
        "footer": "Euromed IntelPlanner. Impulsado por Gemini 3 Pro.",

        // Strategy
        "strategicPlanning": "Planificación Estratégica",
        "strategySubtitle": "Defina su misión y reciba directrices estratégicas de marketing.",
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
        "processingDual": "Deep Learning: Integrando Modelos Gemini y Perplexity...",
        "implementationGuide": "Guía de Implementación Estratégica",
        "deepDiveTitle": "Análisis Deep Dive (Dual-AI)",

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
        "competitor": "Competidor"
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
        "footer": "Euromed IntelPlanner. Impulsat per Gemini 3 Pro.",

        // Strategy
        "strategicPlanning": "Planificació Estratègica",
        "strategySubtitle": "Definiu la vostra missió i rebeu directrius estratègiques de màrqueting.",
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
        "processingDual": "Deep Learning: Integrant Models Gemini i Perplexity...",
        "implementationGuide": "Guia d'Implementació Estratègica",
        "deepDiveTitle": "Anàlisi Deep Dive (Dual-AI)",

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
        "competitor": "Competidor"
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
