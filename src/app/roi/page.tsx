"use client";

import { useState } from "react";
import { TrendingUp, Sparkles, AlertTriangle, Zap, BrainCircuit } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import styles from "./page.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { useGravity } from "@/context/GravityContext";

export default function ROIPage() {
    const { t, lang } = useLanguage();
    const { seed, completeStep } = useGravity();
    const [investment, setInvestment] = useState("");
    const [revenue, setRevenue] = useState("");
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [risk, setRisk] = useState<string | null>(null);
    const [region, setRegion] = useState("EMEA");
    const [sector, setSector] = useState("General");
    const [explaining, setExplaining] = useState(false);
    const [explanation, setExplanation] = useState("");

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const investVal = parseFloat(investment) || 0;
        const revVal = parseFloat(revenue) || 0;

        setTimeout(() => {
            // LOGIC GATE 3.1: Minimum Viable Intelligence (MVI)
            if (investVal < 5000) {
                let errorMsg = "";
                if (lang === "es") errorMsg = "🚫 BLOQUEO ESTRATÉGICO: Inversión inferior al Umbral MVI (€5,000). Riesgo de 'Ceguera Estratégica'. El sistema no puede garantizar precisión sin presupuesto para inteligencia de mercado (Technavio).";
                else if (lang === "ca") errorMsg = "🚫 BLOQUEIG ESTRATÈGIC: Inversió inferior al Llindar MVI (€5,000). Risc de 'Ceguera Estratègica'. El sistema no pot garantir precisió sense pressupost per a intel·ligència de mercat (Technavio).";
                else errorMsg = "🚫 STRATEGIC LOCK: Investment below MVI Threshold (€5,000). Risk of 'Strategic Blindness'. System cannot guarantee accuracy without budget for market intelligence.";

                setRisk(errorMsg);
                setData([]);
                setLoading(false);
                return;
            }

            // Mock Data Generation
            const newData = [
                { name: "Q1", investment: investVal * 0.4, return: revVal * 0.05 }, // Heavy spend early
                { name: "Q2", investment: investVal * 0.3, return: revVal * 0.15 },
                { name: "Q3", investment: investVal * 0.2, return: revVal * 0.30 },
                { name: "Q4", investment: investVal * 0.1, return: revVal * 0.50 }, // Hockey stick return
            ];

            const multiplier = revVal / (investVal || 1);

            // LOGIC GATE 3.2: Sufficiency & CAGR
            let isFeasible = multiplier > 1.2;
            let sufficiencyMsg = "";

            if (region === "EMEA" && sector.includes("Plant")) {
                // CAGR Check 10.6%
                if (multiplier < 1.5) {
                    sufficiencyMsg = lang === "es" ? "⚠️ ALERTA CAGR: El retorno proyectado no supera el crecimiento orgánico del sector Plant-based (10.6%)." : (lang === "ca" ? "⚠️ ALERTA CAGR: El retorn projectat no supera el creixement orgànic del sector Plant-based (10.6%)." : "⚠️ CAGR ALERT: Projected return does not beat Plant-based organic growth (10.6%).");
                }
            } else if (region === "APAC") {
                // Volume check
                if (investVal < 20000) {
                    sufficiencyMsg = lang === "es" ? "⚠️ VOLUMEN INSUFICIENTE: Presupuesto incapaz de penetrar mercados de alta densidad (India/China)." : (lang === "ca" ? "⚠️ VOLUMEN INSUFICIENT: Pressupost incapaç de penetrar mercats d'alta densitat (Índia/Xina)." : "⚠️ INSUFFICIENT VOLUME: Budget unable to penetrate high-density markets (India/China).");
                    isFeasible = false;
                }
            }


            let riskFactor = "";
            let riskLevel = "";

            if (lang === "es") {
                riskLevel = isFeasible ? "Bajo" : "Alto";
                if (isFeasible) {
                    riskFactor = `EVALUACIÓN DE VIABILIDAD: ${riskLevel} RIESGO (Multiplicador ${multiplier.toFixed(2)}x).\n\n` +
                        `El modelo financiero proyectado demuestra una salud robusta. ${sufficiencyMsg} Con una inversión inicial de ${investVal.toLocaleString()}€ generando ${revVal.toLocaleString()}€, la estructura de costes permite un punto de equilibrio estimado para mediados del Q3.`;
                } else {
                    riskFactor = `EVALUACIÓN DE VIABILIDAD: ${riskLevel} RIESGO (Multiplicador ${multiplier.toFixed(2)}x).\n\n` +
                        `ATENCIÓN: ${sufficiencyMsg || "La proyección actual indica una exposición financiera significativa."} Se recomienda revisar la estructura de costes.`;
                }
            } else if (lang === "ca") {
                riskLevel = isFeasible ? "Baix" : "Alt";
                if (isFeasible) {
                    riskFactor = `AVALUACIÓ DE VIABILITAT: ${riskLevel} RISC (Multiplicador ${multiplier.toFixed(2)}x).\n\n` +
                        `El model financer projectat demostra una salut robusta. ${sufficiencyMsg} Amb una inversió inicial de ${investVal.toLocaleString()}€ generant ${revVal.toLocaleString()}€, l'estructura de costos permet un punt d'equilibri estimat per a mitjans del Q3.`;
                } else {
                    riskFactor = `AVALUACIÓ DE VIABILITAT: ${riskLevel} RISC (Multiplicador ${multiplier.toFixed(2)}x).\n\n` +
                        `ATENCIÓ: ${sufficiencyMsg || "La projecció actual indica una exposició financera significativa."} Es recomana revisar l'estructura de costos.`;
                }
            } else {
                riskLevel = isFeasible ? "Low" : "High";
                if (isFeasible) {
                    riskFactor = `VIABILITY ASSESSMENT: ${riskLevel} RISK (Multiplier ${multiplier.toFixed(2)}x).\n\n` +
                        `The projected financial model demonstrates robust health. ${sufficiencyMsg} With an initial investment of ${investVal.toLocaleString()}€, the break-even is estimated by mid-Q3.`;
                } else {
                    riskFactor = `VIABILITY ASSESSMENT: ${riskLevel} RISK (Multiplier ${multiplier.toFixed(2)}x).\n\n` +
                        `WARNING: ${sufficiencyMsg || "The current projection indicates significant financial exposure."} Review cost structure.`;
                }
            }

            setData(newData);
            setRisk(riskFactor);
            completeStep("roi", newData);
            setLoading(false);
        }, 1500);
    };

    const handleExplain = () => {
        setExplaining(true);
        setTimeout(() => {
            let content = "";
            const currentInvest = parseFloat(investment) || 0;
            const currentRev = parseFloat(revenue) || 0;
            const roiRatio = (currentRev / (currentInvest || 1)).toFixed(2);

            if (lang === "ca") {
                content = `**ANÀLISI EXPERT DE FLUX DE CAIXA I ESTRATÈGIA (DUAL-AI: GEMINI + PERPLEXITY)**

**1. Descodificació de la Gràfica (Q1-Q4):**
La distribució de la inversió mostra una estratègia de **"Front-Loading"** (40% al Q1), típica de llançaments agressius per a ${seed}.
*   **Punt d'Inflexió (Break-even):** S'observa al final del Q2. Això és òptim per a productes de cicle mitjà, però agressiu si no hi ha pre-vendes pactades.
*   **Curva de Retorn (Hockey Stick):** El retorn es dispara al Q4 (50% del total). Això indica una dependència crítica de la campanya de "re-stocking" de final d'any o de l'èxit de fires com CPhI/SupplySide.

**2. Valoració del Multiplicador (${roiRatio}x):**
En el sector Nutracèutic (${sector}), un rati de ${roiRatio}x es considera **${parseFloat(roiRatio) > 4 ? "EXCEL·LENT" : (parseFloat(roiRatio) > 2 ? "SÒLID" : "ARRISCAT")}**.
*   **Gemini Insight:** Amb aquest pressupost (${currentInvest.toLocaleString()}€), estàs competint per "Share of Voice", no per "Share of Market" massiu. L'eficiència és clau.

**3. Consell Estratègic (The "Smart Move"):**
*   **Recomanació:** No dilueixis el pressupost del Q1. Si el Q1 falla, el Q4 no arribarà.
*   **Tactical Shift:** Considera moure un 5% del pressupost de Q3 a Q1 per assegurar materials de venda (Sales Kits) més robustos abans de les primeres reunions.
*   **Advertència Perplexity:** Els competidors en ${region} solen augmentar la despesa digital al Q2. Assegura't de tenir "Always-on" a LinkedIn per no perdre tracció al mig de l'any.`;
            } else if (lang === "es") {
                content = `**ANÁLISIS EXPERTO DE FLUJO DE CAJA Y ESTRATEGIA (DUAL-AI: GEMINI + PERPLEXITY)**

**1. Descodificación de la Gráfica (Q1-Q4):**
La distribución de la inversión muestra una estrategia de **"Front-Loading"** (40% en Q1), típica de lanzamientos agresivos para ${seed}.
*   **Punto de Inflexión (Break-even):** Se observa al final del Q2. Esto es óptimo para productos de ciclo medio, pero agresivo sin pre-ventas pactadas.
*   **Curva de Retorno (Hockey Stick):** El retorno se dispara en Q4 (50% del total). Esto indica una dependencia crítica de la campaña de "re-stocking" de fin de año o del éxito de ferias como CPhI/SupplySide.

**2. Valoración del Multiplicador (${roiRatio}x):**
En el sector Nutracéutico (${sector}), un ratio de ${roiRatio}x se considera **${parseFloat(roiRatio) > 4 ? "EXCELENTE" : (parseFloat(roiRatio) > 2 ? "SÓLIDO" : "ARRIESGADO")}**.
*   **Gemini Insight:** Con este presupuesto (${currentInvest.toLocaleString()}€), estás compitiendo por "Share of Voice", no por "Share of Market" masivo. La eficiencia es clave.

**3. Consejo Estratégico (The "Smart Move"):**
*   **Recomendación:** No diluyas el presupuesto del Q1. Si el Q1 falla, el Q4 no llegará.
*   **Tactical Shift:** Considera mover un 5% del presupuesto de Q3 a Q1 para asegurar materiales de venta (Sales Kits) más robustos antes de las primeras reuniones.
*   **Advertencia Perplexity:** Los competidores en ${region} suelen aumentar el gasto digital en Q2. Asegúrate de tener "Always-on" en LinkedIn para no perder tracción a mitad de año.`;
            } else {
                content = `**EXPERT CASH FLOW & STRATEGY ANALYSIS (DUAL-AI: GEMINI + PERPLEXITY)**

**1. Graph Decoding (Q1-Q4):**
The investment distribution shows a **"Front-Loading"** strategy (40% in Q1), typical of aggressive launches for ${seed}.
*   **Inflection Point (Break-even):** Observed at the end of Q2. This is optimal for mid-cycle products but aggressive without agreed pre-sales.
*   **Return Curve (Hockey Stick):** Return spikes in Q4 (50% of total). This indicates critical dependence on the end-of-year "re-stocking" campaign or the success of shows like CPhI/SupplySide.

**2. Multiplier Assessment (${roiRatio}x):**
In the Nutraceutical sector (${sector}), a ratio of ${roiRatio}x is considered **${parseFloat(roiRatio) > 4 ? "EXCELLENT" : (parseFloat(roiRatio) > 2 ? "SOLID" : "RISKY")}**.
*   **Gemini Insight:** With this budget (${currentInvest.toLocaleString()}€), you are competing for "Share of Voice", not massive "Share of Market". Efficiency is key.

**3. Strategic Advice (The "Smart Move"):**
*   **Recommendation:** Do not dilute Q1 budget. If Q1 fails, Q4 won't happen.
*   **Tactical Shift:** Consider moving 5% of Q3 budget to Q1 to ensure more robust Sales Kits before initial meetings.
*   **Perplexity Warning:** Competitors in ${region} tend to increase digital spend in Q2. Ensure "Always-on" presence on LinkedIn to avoid losing traction mid-year.`;
            }

            setExplanation(content);
            setExplaining(false);
        }, 2000);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.iconWrapper}>
                    <TrendingUp size={40} />
                </div>
                <div>
                    <h1 className={styles.title}>{t("roiAnalysis")}</h1>
                    <p className={styles.subtitle}>{t("roiSubtitle")}</p>
                </div>
            </header>

            <div className={styles.grid}>
                <section className={`${styles.panel} glass-panel`}>
                    <h2 className={styles.panelTitle}>{t("financialInputs")}</h2>
                    <form onSubmit={handleCalculate} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>{t("targetGeo")}</label>
                            <select className={styles.input} value={region} onChange={e => setRegion(e.target.value)}>
                                <option value="EMEA">EMEA (Europe, Middle East, Africa)</option>
                                <option value="APAC">APAC (Asia Pacific)</option>
                                <option value="NA">North America</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>{t("sector") || "Sector"}</label>
                            <select className={styles.input} value={sector} onChange={e => setSector(e.target.value)}>
                                <option value="General">General / Pharma</option>
                                <option value="Plant-based">Plant-based / Meat Alternatives</option>
                                <option value="Immune">Immune Health</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>{t("totalInvestment")}</label>
                            <input className={styles.input} type="number" value={investment} onChange={e => setInvestment(e.target.value)} placeholder="Min $5000" required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>{t("projectedRevenue")}</label>
                            <input className={styles.input} type="number" value={revenue} onChange={e => setRevenue(e.target.value)} placeholder="120000" required />
                        </div>
                        <button type="submit" className={`glass-button ${styles.submitBtn}`} disabled={loading}>
                            {loading ? t("calculating") : t("calculateViability")}
                        </button>
                    </form>

                    {risk && (
                        <div className={styles.riskBox}>
                            <AlertTriangle size={20} className={risk.includes("High") || risk.includes("Alto") || risk.includes("Alt") ? styles.riskIconHigh : styles.riskIconLow} />
                            <p>{risk}</p>
                        </div>
                    )}
                </section>

                <section className={`${styles.panel} ${styles.chartPanel} glass-panel`}>
                    <h2 className={styles.panelTitle}>{t("projectedPerformance")}</h2>
                    {data.length > 0 ? (
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="investment" fill="#7B9F35" name={t("investment")} />
                                    <Bar dataKey="return" fill="#00f0ff" name={t("projectedReturn")} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p>{t("enterData")}</p>
                        </div>
                    )}

                    {data.length > 0 && (
                        <div style={{ marginTop: '1.5rem' }}>
                            {!explanation ? (
                                <button
                                    onClick={handleExplain}
                                    className={`glass-button`}
                                    disabled={explaining}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(124, 58, 237, 0.2)',
                                        border: '1px solid rgba(124, 58, 237, 0.5)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    {explaining ? (
                                        <>
                                            <Sparkles className={styles.spin} size={18} />
                                            {lang === "ca" ? "Processant Anàlisi..." : (lang === "es" ? "Procesando Análisis..." : "Processing Analysis...")}
                                        </>
                                    ) : (
                                        <>
                                            <BrainCircuit size={18} />
                                            {lang === "ca" ? "Explicació" : (lang === "es" ? "Explicación" : "Explanation")}
                                        </>
                                    )}
                                </button>
                            ) : (
                                <div className="explanation-box" style={{
                                    marginTop: '1rem',
                                    padding: '1.5rem',
                                    background: 'rgba(0,0,0,0.3)',
                                    borderRadius: '12px',
                                    borderLeft: '3px solid #8b5cf6',
                                    textAlign: 'left'
                                }}>
                                    <div dangerouslySetInnerHTML={{
                                        __html: explanation
                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            .replace(/\n\n/g, '<br/><br/>')
                                            .replace(/\* (.*?)\n/g, '• $1<br/>')
                                    }} />
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div >
        </div >
    );
}
