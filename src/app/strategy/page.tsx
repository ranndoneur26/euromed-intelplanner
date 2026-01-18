"use client";

import { useState } from "react";
import { Target, Sparkles, AlertCircle, CheckCircle, Zap, BarChart3, PieChart } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    PieChart as RechartsPieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import styles from "./page.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { useGravity } from "@/context/GravityContext";
import InfoTooltip from "@/components/InfoTooltip";

interface Recommendation {
    title: string;
    description: string;
}

interface StrategyResult {
    missionCritical: string;
    recommendations: Recommendation[];
}

const COLORS = ['#7B9F35', '#377cbc', '#00f0ff', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function StrategyPage() {
    const { t, lang } = useLanguage();
    const { seed, completeStep, setBudget: setContextBudget } = useGravity();
    const [market, setMarket] = useState("");
    const [budget, setBudget] = useState("");
    const [campaignType, setCampaignType] = useState("impact");
    const [loading, setLoading] = useState(false);
    const [deepDiveLoading, setDeepDiveLoading] = useState(false);
    const [deepDiveResult, setDeepDiveResult] = useState("");
    const [result, setResult] = useState<StrategyResult | null>(null);
    const [error, setError] = useState("");
    const [activeChart, setActiveChart] = useState<"budget" | "priority" | "radar">("budget");

    // Generate budget distribution data based on campaign type
    const getBudgetDistributionData = () => {
        const budgetValue = parseFloat(budget) || 0;
        if (campaignType === "impact") {
            return [
                { name: lang === "es" ? "Publicidad Digital" : lang === "ca" ? "Publicitat Digital" : "Digital Advertising", value: Math.round(budgetValue * 0.35), percentage: 35 },
                { name: lang === "es" ? "Contenido" : lang === "ca" ? "Contingut" : "Content", value: Math.round(budgetValue * 0.25), percentage: 25 },
                { name: lang === "es" ? "Eventos/Ferias" : lang === "ca" ? "Esdeveniments/Fires" : "Events/Trade Shows", value: Math.round(budgetValue * 0.20), percentage: 20 },
                { name: "PR & Comunicación", value: Math.round(budgetValue * 0.12), percentage: 12 },
                { name: lang === "es" ? "Análisis/Herramientas" : lang === "ca" ? "Anàlisi/Eines" : "Analytics/Tools", value: Math.round(budgetValue * 0.08), percentage: 8 }
            ];
        } else {
            return [
                { name: lang === "es" ? "SEO & Contenido" : lang === "ca" ? "SEO & Contingut" : "SEO & Content", value: Math.round(budgetValue * 0.30), percentage: 30 },
                { name: lang === "es" ? "Redes Sociales" : lang === "ca" ? "Xarxes Socials" : "Social Media", value: Math.round(budgetValue * 0.25), percentage: 25 },
                { name: "Email Marketing", value: Math.round(budgetValue * 0.20), percentage: 20 },
                { name: lang === "es" ? "Retargeting" : lang === "ca" ? "Retargeting" : "Retargeting", value: Math.round(budgetValue * 0.15), percentage: 15 },
                { name: lang === "es" ? "Branding" : lang === "ca" ? "Branding" : "Branding", value: Math.round(budgetValue * 0.10), percentage: 10 }
            ];
        }
    };

    // Generate priority data for recommendations
    const getPriorityData = () => {
        if (!result) return [];
        return result.recommendations.map((rec, idx) => ({
            name: rec.title.substring(0, 25) + (rec.title.length > 25 ? "..." : ""),
            priority: 100 - (idx * 15),
            impact: 85 - (idx * 10),
            effort: 40 + (idx * 12)
        }));
    };

    // Generate radar data for strategic assessment
    const getRadarData = () => {
        const isImpact = campaignType === "impact";
        return [
            { subject: lang === "es" ? "Alcance" : lang === "ca" ? "Abast" : "Reach", A: isImpact ? 90 : 60, fullMark: 100 },
            { subject: lang === "es" ? "Engagement" : lang === "ca" ? "Engagement" : "Engagement", A: isImpact ? 75 : 85, fullMark: 100 },
            { subject: lang === "es" ? "Conversión" : lang === "ca" ? "Conversió" : "Conversion", A: isImpact ? 65 : 70, fullMark: 100 },
            { subject: "ROI", A: isImpact ? 70 : 80, fullMark: 100 },
            { subject: lang === "es" ? "Velocidad" : lang === "ca" ? "Velocitat" : "Speed", A: isImpact ? 85 : 50, fullMark: 100 },
            { subject: lang === "es" ? "Sostenibilidad" : lang === "ca" ? "Sostenibilitat" : "Sustainability", A: isImpact ? 55 : 90, fullMark: 100 }
        ];
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setResult(null);

        const budgetValue = parseFloat(budget);

        // Logic Validation
        if (isNaN(budgetValue) || budgetValue < 5000) {
            setError(t("minBudgetError"));
            return;
        }

        setLoading(true);

        try {
            // Call real AI API
            const response = await fetch('/api/ai/strategy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    seed,
                    market,
                    budget: budgetValue,
                    campaignType,
                    lang
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate strategy');
            }

            const finalResult = await response.json();
            setResult(finalResult);
            completeStep("strategy", finalResult);

            // Save budget to context for ROI page
            setContextBudget(budgetValue);
        } catch (err) {
            console.error("Strategy generation error:", err);
            setError(t("apiError") || "Error al generar la estrategia. Por favor, intente de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeepDive = async () => {
        if (!result) return;

        setDeepDiveLoading(true);

        try {
            const response = await fetch('/api/ai/deep-dive', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    strategy: result,
                    seed,
                    lang
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate deep dive');
            }

            const data = await response.json();
            setDeepDiveResult(data.guide);
        } catch (err) {
            console.error("Deep dive generation error:", err);
            // Fallback to showing an error in the UI
            const errorMsg = lang === "es"
                ? "Error al generar la guía profunda. Por favor, intente de nuevo."
                : lang === "ca"
                    ? "Error en generar la guia profunda. Si us plau, torneu-ho a intentar."
                    : "Error generating deep dive guide. Please try again.";
            setDeepDiveResult(`**ERROR:** ${errorMsg}`);
        } finally {
            setDeepDiveLoading(false);
        }
    };

    const handleExport = () => {
        const content = `
EUROMED INTELPLANNER - STRATEGIC REPORT
=======================================
Date: ${new Date().toLocaleDateString()}
Asset: ${seed}
Market: ${market}
Budget: €${budget}
Campaign Type: ${campaignType === 'impact' ? t('impactCampaign') : t('brandMaintenance')}

${t("missionCritical")}
---------------------------------------
${result?.missionCritical}

${t("keyRecommendations")}
---------------------------------------
${result?.recommendations.map(r => `[${r.title}]\n${r.description}`).join('\n\n')}

${deepDiveResult ? `
${t("implementationGuide")}
---------------------------------------
${deepDiveResult}
` : ''}

=======================================
Generated by Gravity Engine (Mock)
`;
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Strategy_Report_${seed}_${market}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.iconWrapper}>
                    <Target size={40} />
                </div>
                <div>
                    <h1 className={styles.title}>{t("strategicPlanning")}</h1>
                    <p className={styles.subtitle}>{t("strategySubtitle")}</p>
                </div>
            </header>

            <div className={styles.grid}>
                <section className={`${styles.panel} glass-panel`}>
                    <h2 className={styles.panelTitle}>{t("inputParameters")}</h2>
                    <form onSubmit={handleGenerate} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="asset" className={styles.label}>{t("strategicAsset")}</label>
                            <input
                                type="text"
                                id="asset"
                                className={styles.input}
                                placeholder="e.g. Pomanox, Citrus Extract"
                                value={seed}
                                readOnly
                                disabled
                                style={{ opacity: 0.7, cursor: 'not-allowed' }}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="campaignType" className={styles.label}>
                                {t("campaignType")}
                                <InfoTooltip content={t("tooltipCampaignType")} />
                            </label>
                            <select
                                id="campaignType"
                                className={styles.input}
                                value={campaignType}
                                onChange={(e) => setCampaignType(e.target.value)}
                            >
                                <option value="impact">{t("impactCampaign")}</option>
                                <option value="maintenance">{t("brandMaintenance")}</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="market" className={styles.label}>
                                {t("targetMarket")}
                                <InfoTooltip content={t("tooltipTargetMarket")} />
                            </label>
                            <input
                                type="text"
                                id="market"
                                className={styles.input}
                                placeholder="e.g. USA, Germany, China"
                                value={market}
                                onChange={(e) => setMarket(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="budget" className={styles.label}>
                                {t("budgetAllocation")}
                                <InfoTooltip content={t("tooltipBudget")} />
                            </label>
                            <input
                                type="number"
                                id="budget"
                                className={styles.input}
                                placeholder="Min 5000"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className={styles.errorBox}>
                                <AlertCircle size={20} className={styles.errorIcon} />
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`glass-button ${styles.submitBtn}`}
                            disabled={loading}
                        >
                            {loading ? <span className={styles.generating}><Sparkles size={18} className={styles.spin} /> {t("generating")}</span> : t("generateStrategy")}
                        </button>
                    </form>

                </section>

                <section className={`${styles.panel} ${styles.resultsPanel} glass-panel`}>
                    {result ? (
                        <div className={styles.resultsContent}>
                            <div className={styles.missionBox}>
                                <h3 className={styles.missionTitle}>{t("missionCritical")}</h3>
                                <p className={styles.missionText}>{result.missionCritical}</p>
                            </div>

                            <div className={styles.recommendations}>
                                <h3 className={styles.recTitle}>{t("keyRecommendations")}</h3>
                                <div className={styles.recGrid}>
                                    {result.recommendations.map((rec, idx) => (
                                        <div key={idx} className={styles.recCard}>
                                            <div className={styles.recHeader}>
                                                <CheckCircle size={20} className={styles.checkIcon} />
                                                <h4>{rec.title}</h4>
                                            </div>
                                            <p>{rec.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* DEEP DIVE SECTION */}
                            {!deepDiveResult ? (
                                <button
                                    onClick={handleDeepDive}
                                    className={`glass-button ${styles.deepDiveBtn}`}
                                    disabled={deepDiveLoading}
                                    style={{ marginTop: '1.5rem', width: '100%', background: 'rgba(55, 124, 188, 0.2)', border: '1px solid rgba(55, 124, 188, 0.5)' }}
                                >
                                    {deepDiveLoading ? (
                                        <span className={styles.generating}>
                                            <Sparkles size={18} className={styles.spin} /> {t("processingDual")}
                                        </span>
                                    ) : (
                                        <>
                                            <Zap size={18} style={{ marginRight: '8px' }} /> {t("expandInfo")}
                                        </>
                                    )}
                                </button>
                            ) : (
                                <div className={styles.deepDiveResult} style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', borderLeft: '3px solid var(--primary-green)' }}>
                                    <h3 style={{ color: 'var(--primary-green)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Sparkles size={18} /> {t("deepDiveTitle")}
                                    </h3>
                                    <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                                        <div dangerouslySetInnerHTML={{
                                            __html: deepDiveResult
                                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                .replace(/### (.*?)\n/g, '<h4 style="color:white; margin-top:1rem; margin-bottom:0.5rem; font-size:1.1rem;">$1</h4>')
                                                .replace(/\* (.*?)\n/g, '<li style="margin-left:1rem; margin-bottom:0.3rem;">$1</li>')
                                        }} />
                                    </div>
                                </div>
                            )}

                            <button onClick={handleExport} className={styles.exportBtn}>
                                {t("downloadReport")}
                            </button>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p>{t("strategySubtitle")}</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
