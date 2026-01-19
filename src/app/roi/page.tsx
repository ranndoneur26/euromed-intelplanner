"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Sparkles, AlertTriangle, CheckCircle2, PieChart, BarChart3, Target, Download } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area,
    RadialBarChart, RadialBar
} from "recharts";
import styles from "./page.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { useGravity } from "@/context/GravityContext";
import InfoTooltip from "@/components/InfoTooltip";

interface QuarterlyData {
    quarter: string;
    investment: number;
    revenue: number;
    cumulativeROI: number;
}

interface ChannelData {
    channel: string;
    percentage: number;
    rationale: string;
}

interface RiskAssessment {
    level: "Low" | "Medium" | "High";
    score: number;
    factors: string[];
}

interface KeyMetrics {
    breakEvenQuarter: string;
    expectedCAGR: number;
    marketPenetration: number;
    paybackPeriod: number;
}

interface ROIResult {
    quarterlyProjection: QuarterlyData[];
    channelAllocation: ChannelData[];
    riskAssessment: RiskAssessment;
    executiveSummary: string;
    keyMetrics: KeyMetrics;
}

const COLORS = ['#7B9F35', '#377cbc', '#00f0ff', '#f59e0b', '#8b5cf6'];

export default function ROIPage() {
    const { t, lang } = useLanguage();
    const { seed, budget: contextBudget, market: contextMarket, completeStep } = useGravity();
    const [investment, setInvestment] = useState("");
    const [revenue, setRevenue] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ROIResult | null>(null);
    const [error, setError] = useState("");
    const [region, setRegion] = useState("EMEA");
    const [sector, setSector] = useState("General");
    const [customRegion, setCustomRegion] = useState("");
    const [customSector, setCustomSector] = useState("");
    const [activeChart, setActiveChart] = useState<"performance" | "channels" | "roi">("performance");

    // Auto-fill investment from Strategy's budget
    useEffect(() => {
        if (contextBudget > 0 && !investment) {
            setInvestment(contextBudget.toString());
        }
    }, [contextBudget, investment]);

    // Auto-fill region from Strategy's market
    useEffect(() => {
        if (contextMarket && !customRegion) {
            // If the market matches a predefined region, use it; otherwise set as custom
            const predefinedRegions = ["EMEA", "APAC", "NA", "LATAM"];
            if (predefinedRegions.includes(contextMarket.toUpperCase())) {
                setRegion(contextMarket.toUpperCase());
            } else {
                setRegion("Other");
                setCustomRegion(contextMarket);
            }
        }
    }, [contextMarket, customRegion]);

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setResult(null);

        const investVal = parseFloat(investment) || 0;
        const revVal = parseFloat(revenue) || 0;

        // Validation
        if (investVal < 5000) {
            const errorMsg = lang === "es"
                ? "🚫 BLOQUEO ESTRATÉGICO: Inversión inferior al Umbral MVI (€5,000)."
                : lang === "ca"
                    ? "🚫 BLOQUEIG ESTRATÈGIC: Inversió inferior al Llindar MVI (€5,000)."
                    : "🚫 STRATEGIC LOCK: Investment below MVI Threshold (€5,000).";
            setError(errorMsg);
            return;
        }

        setLoading(true);

        try {
            const actualRegion = region === "Other" ? customRegion : region;
            const actualSector = sector === "Other" ? customSector : sector;

            const response = await fetch('/api/ai/roi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    seed,
                    investment: investVal,
                    projectedRevenue: revVal,
                    region: actualRegion,
                    sector: actualSector,
                    lang
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate ROI analysis');
            }

            const data = await response.json();
            setResult(data);
            completeStep("roi", data);
        } catch (err) {
            console.error("ROI analysis error:", err);
            setError(lang === "es"
                ? "Error al generar el análisis de ROI. Intente de nuevo."
                : lang === "ca"
                    ? "Error en generar l'anàlisi de ROI. Torneu-ho a intentar."
                    : "Error generating ROI analysis. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (!result) return;

        const content = `
EUROMED INTELPLANNER - ROI ANALYSIS REPORT
==========================================
Date: ${new Date().toLocaleDateString()}
Asset: ${seed}
Investment: €${investment}
Projected Revenue: €${revenue}
Region: ${region === "Other" ? customRegion : region}
Sector: ${sector === "Other" ? customSector : sector}

EXECUTIVE SUMMARY
-----------------
${result.executiveSummary}

KEY METRICS
-----------
- Break-even Quarter: ${result.keyMetrics.breakEvenQuarter}
- Expected CAGR: ${result.keyMetrics.expectedCAGR}%
- Market Penetration: ${result.keyMetrics.marketPenetration}%
- Payback Period: ${result.keyMetrics.paybackPeriod} months

QUARTERLY PROJECTION
--------------------
${result.quarterlyProjection.map(q =>
            `${q.quarter}: Investment ${q.investment}% | Revenue ${q.revenue}% | Cumulative ROI ${(q.cumulativeROI * 100).toFixed(0)}%`
        ).join('\n')}

CHANNEL ALLOCATION
------------------
${result.channelAllocation.map(c =>
            `${c.channel}: ${c.percentage}% - ${c.rationale}`
        ).join('\n')}

RISK ASSESSMENT
---------------
Level: ${result.riskAssessment.level} (Score: ${result.riskAssessment.score}/100)
Risk Factors:
${result.riskAssessment.factors.map(f => `- ${f}`).join('\n')}

==========================================
Generated by Euromed IntelPlanner AI
`;
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ROI_Analysis_${seed}_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Prepare chart data
    const getQuarterlyChartData = () => {
        if (!result) return [];
        const investVal = parseFloat(investment) || 0;
        const revVal = parseFloat(revenue) || 0;

        return result.quarterlyProjection.map(q => ({
            name: q.quarter,
            investment: Math.round(investVal * q.investment / 100),
            revenue: Math.round(revVal * q.revenue / 100),
            roi: Math.round(q.cumulativeROI * 100)
        }));
    };

    const getPieChartData = () => {
        if (!result) return [];
        return result.channelAllocation.map(c => ({
            name: c.channel,
            value: c.percentage
        }));
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case "Low": return "#22c55e";
            case "Medium": return "#f59e0b";
            case "High": return "#ef4444";
            default: return "#94a3b8";
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.iconWrapper}>
                    <TrendingUp size={40} />
                </div>
                <div>
                    <h1 className={styles.title}>
                        {seed && <span style={{ opacity: 0.7 }}>{seed}: </span>}
                        {t("roiAnalysis")}
                    </h1>
                    <p className={styles.subtitle}>{t("roiSubtitle")}</p>
                </div>
            </header>

            <div className={styles.grid}>
                {/* Input Panel */}
                <section className={`${styles.panel} glass-panel`}>
                    <h2 className={styles.panelTitle}>{t("financialInputs")}</h2>
                    <form onSubmit={handleCalculate} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                {t("targetGeo")}
                                <InfoTooltip content={t("tooltipGeoMarket")} />
                            </label>
                            <select className={styles.input} value={region} onChange={e => setRegion(e.target.value)}>
                                <option value="EMEA">EMEA (Europe, Middle East, Africa)</option>
                                <option value="APAC">APAC (Asia Pacific)</option>
                                <option value="NA">North America</option>
                                <option value="LATAM">Latin America</option>
                                <option value="Other">{lang === "es" ? "Otro" : lang === "ca" ? "Altre" : "Other"}</option>
                            </select>
                        </div>
                        {region === "Other" && (
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>{lang === "es" ? "Especificar Mercado" : lang === "ca" ? "Especificar Mercat" : "Specify Market"}</label>
                                <input
                                    className={styles.input}
                                    type="text"
                                    value={customRegion}
                                    onChange={e => setCustomRegion(e.target.value)}
                                    placeholder={lang === "es" ? "Ej: América Latina" : lang === "ca" ? "Ex: Amèrica Llatina" : "e.g. Latin America"}
                                    required
                                />
                            </div>
                        )}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                {t("sector") || "Sector"}
                                <InfoTooltip content={t("tooltipSector")} />
                            </label>
                            <select className={styles.input} value={sector} onChange={e => setSector(e.target.value)}>
                                <option value="General">General / Pharma</option>
                                <option value="Plant-based">Plant-based / Meat Alternatives</option>
                                <option value="Immune">Immune Health</option>
                                <option value="Beauty">Beauty & Cosmetics</option>
                                <option value="Sports">Sports Nutrition</option>
                                <option value="Other">{lang === "es" ? "Otro" : lang === "ca" ? "Altre" : "Other"}</option>
                            </select>
                        </div>
                        {sector === "Other" && (
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>{lang === "es" ? "Especificar Sector" : lang === "ca" ? "Especificar Sector" : "Specify Sector"}</label>
                                <input
                                    className={styles.input}
                                    type="text"
                                    value={customSector}
                                    onChange={e => setCustomSector(e.target.value)}
                                    placeholder={lang === "es" ? "Ej: Cosmética Natural" : lang === "ca" ? "Ex: Cosmètica Natural" : "e.g. Natural Cosmetics"}
                                    required
                                />
                            </div>
                        )}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                {t("totalInvestment")}
                                <InfoTooltip content={t("tooltipROIInvestment")} />
                            </label>
                            <input className={styles.input} type="number" value={investment} onChange={e => setInvestment(e.target.value)} placeholder="Min €5000" required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                {t("projectedRevenue")}
                                <InfoTooltip content={t("tooltipROIRevenue")} />
                            </label>
                            <input className={styles.input} type="number" value={revenue} onChange={e => setRevenue(e.target.value)} placeholder="€120000" required />
                        </div>

                        {error && (
                            <div className={styles.errorBox}>
                                <AlertTriangle size={20} />
                                <p>{error}</p>
                            </div>
                        )}

                        <button type="submit" className={`glass-button ${styles.submitBtn}`} disabled={loading}>
                            {loading ? (
                                <span className={styles.generating}>
                                    <Sparkles size={18} className={styles.spin} />
                                    {lang === "es" ? "Analizando ROI..." : lang === "ca" ? "Analitzant ROI..." : "Analyzing ROI..."}
                                </span>
                            ) : t("calculateViability")}
                        </button>
                    </form>
                </section>

                {/* Results Panel */}
                <section className={`${styles.panel} ${styles.resultsPanel} glass-panel`}>
                    {result ? (
                        <div className={styles.resultsContent}>
                            {/* Key Metrics Cards */}
                            <div className={styles.metricsGrid}>
                                <div className={styles.metricCard}>
                                    <Target size={24} className={styles.metricIcon} />
                                    <div>
                                        <span className={styles.metricLabel}>Break-even</span>
                                        <span className={styles.metricValue}>{result.keyMetrics.breakEvenQuarter}</span>
                                    </div>
                                </div>
                                <div className={styles.metricCard}>
                                    <TrendingUp size={24} className={styles.metricIcon} />
                                    <div>
                                        <span className={styles.metricLabel}>CAGR</span>
                                        <span className={styles.metricValue}>{result.keyMetrics.expectedCAGR}%</span>
                                    </div>
                                </div>
                                <div className={styles.metricCard}>
                                    <PieChart size={24} className={styles.metricIcon} />
                                    <div>
                                        <span className={styles.metricLabel}>{lang === "es" ? "Penetración" : lang === "ca" ? "Penetració" : "Penetration"}</span>
                                        <span className={styles.metricValue}>{result.keyMetrics.marketPenetration}%</span>
                                    </div>
                                </div>
                                <div className={styles.metricCard} style={{ borderColor: getRiskColor(result.riskAssessment.level) }}>
                                    <AlertTriangle size={24} style={{ color: getRiskColor(result.riskAssessment.level) }} />
                                    <div>
                                        <span className={styles.metricLabel}>{lang === "es" ? "Riesgo" : lang === "ca" ? "Risc" : "Risk"}</span>
                                        <span className={styles.metricValue} style={{ color: getRiskColor(result.riskAssessment.level) }}>
                                            {result.riskAssessment.level}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Executive Summary */}
                            <div className={styles.summaryBox}>
                                <h3 className={styles.summaryTitle}>
                                    <CheckCircle2 size={20} />
                                    {lang === "es" ? "Resumen Ejecutivo" : lang === "ca" ? "Resum Executiu" : "Executive Summary"}
                                </h3>
                                <p className={styles.summaryText}>{result.executiveSummary}</p>
                            </div>

                            {/* Chart Tabs */}
                            <div className={styles.chartTabs}>
                                <button
                                    className={`${styles.chartTab} ${activeChart === "performance" ? styles.active : ""}`}
                                    onClick={() => setActiveChart("performance")}
                                >
                                    <BarChart3 size={16} />
                                    {lang === "es" ? "Rendimiento" : lang === "ca" ? "Rendiment" : "Performance"}
                                </button>
                                <button
                                    className={`${styles.chartTab} ${activeChart === "channels" ? styles.active : ""}`}
                                    onClick={() => setActiveChart("channels")}
                                >
                                    <PieChart size={16} />
                                    {lang === "es" ? "Canales" : lang === "ca" ? "Canals" : "Channels"}
                                </button>
                                <button
                                    className={`${styles.chartTab} ${activeChart === "roi" ? styles.active : ""}`}
                                    onClick={() => setActiveChart("roi")}
                                >
                                    <TrendingUp size={16} />
                                    ROI
                                </button>
                            </div>

                            {/* Charts */}
                            <div className={styles.chartContainer}>
                                {activeChart === "performance" && (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={getQuarterlyChartData()}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                            <XAxis dataKey="name" stroke="#94a3b8" />
                                            <YAxis stroke="#94a3b8" tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                                formatter={(value) => [`€${(value as number)?.toLocaleString() ?? 0}`, '']}
                                            />
                                            <Legend />
                                            <Bar dataKey="investment" fill="#7B9F35" name={t("investment")} radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="revenue" fill="#00f0ff" name={lang === "es" ? "Ingresos" : lang === "ca" ? "Ingressos" : "Revenue"} radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}

                                {activeChart === "channels" && (
                                    <div className={styles.pieChartWrapper}>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <RechartsPieChart>
                                                <Pie
                                                    data={getPieChartData()}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={3}
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                                    labelLine={{ stroke: '#94a3b8' }}
                                                >
                                                    {getPieChartData().map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                                />
                                            </RechartsPieChart>
                                        </ResponsiveContainer>
                                        <div className={styles.channelLegend}>
                                            {result.channelAllocation.map((c, i) => (
                                                <div key={i} className={styles.channelItem}>
                                                    <span className={styles.channelDot} style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                                                    <span className={styles.channelName}>{c.channel}</span>
                                                    <span className={styles.channelPercent}>{c.percentage}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeChart === "roi" && (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={getQuarterlyChartData()}>
                                            <defs>
                                                <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#7B9F35" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#7B9F35" stopOpacity={0.1} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                            <XAxis dataKey="name" stroke="#94a3b8" />
                                            <YAxis stroke="#94a3b8" tickFormatter={(v) => `${v}%`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                                formatter={(value) => [`${value ?? 0}%`, 'ROI']}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="roi"
                                                stroke="#7B9F35"
                                                strokeWidth={3}
                                                fill="url(#roiGradient)"
                                                name="Cumulative ROI"
                                            />
                                            <Line type="monotone" dataKey="roi" stroke="#00f0ff" strokeWidth={2} dot={{ fill: '#00f0ff', r: 5 }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </div>

                            {/* Risk Factors */}
                            <div className={styles.riskSection}>
                                <h4 className={styles.riskTitle}>
                                    <AlertTriangle size={18} style={{ color: getRiskColor(result.riskAssessment.level) }} />
                                    {lang === "es" ? "Factores de Riesgo" : lang === "ca" ? "Factors de Risc" : "Risk Factors"}
                                </h4>
                                <div className={styles.riskProgress}>
                                    <div
                                        className={styles.riskBar}
                                        style={{
                                            width: `${result.riskAssessment.score}%`,
                                            backgroundColor: getRiskColor(result.riskAssessment.level)
                                        }}
                                    ></div>
                                </div>
                                <ul className={styles.riskList}>
                                    {result.riskAssessment.factors.map((factor, idx) => (
                                        <li key={idx}>{factor}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Export Button */}
                            <button onClick={handleExport} className={styles.exportBtn}>
                                <Download size={18} />
                                {lang === "es" ? "Descargar Informe" : lang === "ca" ? "Descarregar Informe" : "Download Report"}
                            </button>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <TrendingUp size={48} className={styles.emptyIcon} />
                            <p>{t("enterData")}</p>
                            <p className={styles.emptyHint}>
                                {lang === "es"
                                    ? `El análisis de ROI será específico para "${seed || 'tu ingrediente'}"`
                                    : lang === "ca"
                                        ? `L'anàlisi de ROI serà específic per a "${seed || 'el teu ingredient'}"`
                                        : `ROI analysis will be specific to "${seed || 'your ingredient'}"`}
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
