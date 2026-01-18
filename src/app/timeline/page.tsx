"use client";

import { useState } from "react";
import { CalendarClock, Sparkles, CheckCircle2, BrainCircuit, Download } from "lucide-react";
import styles from "./page.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { useGravity } from "@/context/GravityContext";
import InfoTooltip from "@/components/InfoTooltip";

interface Milestone {
    phase: string;
    date: string;
    title: string;
    description: string;
}

export default function TimelinePage() {
    const { t, lang } = useLanguage();
    const { seed, completeStep } = useGravity();
    const [startDate, setStartDate] = useState("");
    const [campaignType, setCampaignType] = useState("Impact");
    const [loading, setLoading] = useState(false);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState("");

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            const start = new Date(startDate);
            const startMonth = start.getMonth(); // 0-11
            const generated: Milestone[] = [];
            let phases: { buffer: number; title: string; desc: string }[] = [];

            // Helper for dates
            const addMonths = (date: Date, months: number) => {
                const d = new Date(date);
                d.setMonth(d.getMonth() + months);
                return d.toLocaleDateString(lang === 'es' ? 'es-ES' : lang === 'ca' ? 'ca-ES' : 'en-US', { year: 'numeric', month: 'long' });
            };

            // IMPACT vs MAINTENANCE Logic
            if (campaignType === "Impact") {
                if (lang === "es") {
                    phases = [
                        { buffer: 0, title: "Fase 1: Activación 'Trend Velocity'", desc: "Lanzamiento sincronizado digital (LinkedIn 'Thought Leader') + PR. Objetivo: Saturación de mensaje en < 48h." },
                        { buffer: 1, title: "Fase 2: Validación Técnica (Webinar)", desc: "Webinar 'Deep Dive' sobre farmacocinética. Captura de leads cualificados (MQLs)." },
                        { buffer: 2, title: "Fase 3: Conversión (Sampling)", desc: "Envío de kits de mostrador 'Ready-to-Market' a leads calientes. Cierre." }
                    ];
                } else if (lang === "ca") {
                    phases = [
                        { buffer: 0, title: "Fase 1: Activació 'Trend Velocity'", desc: "Llançament sincronitzat digital (LinkedIn 'Thought Leader') + PR. Objectiu: Saturació de missatge en < 48h." },
                        { buffer: 1, title: "Fase 2: Validació Tècnica (Webinar)", desc: "Webinar 'Deep Dive' sobre farmacocinètica. Captura de leads qualificats (MQLs)." },
                        { buffer: 2, title: "Fase 3: Conversió (Sampling)", desc: "Enviament de kits de taulell 'Ready-to-Market' a leads calents. Tancament." }
                    ];
                } else {
                    phases = [
                        { buffer: 0, title: "Phase 1: 'Trend Velocity' Activation", desc: "Synchronized digital launch (LinkedIn 'Thought Leader') + PR. Goal: Message saturation in < 48h." },
                        { buffer: 1, title: "Phase 2: Technical Validation (Webinar)", desc: "'Deep Dive' Webinar on pharmacokinetics. Capture qualified leads (MQLs)." },
                        { buffer: 2, title: "Phase 3: Conversion (Sampling)", desc: "Shipping 'Ready-to-Market' kits to hot leads. Closing." }
                    ];
                }

                // SPECIFIC DEADLINE LOGIC GATE (Impact only)
                if (startMonth >= 8 && startMonth <= 9) { // Sept or Oct
                    const warningTitle = lang === "es" ? "⚠️ DEADLINE CRÍTICO" : (lang === "ca" ? "⚠️ DEADLINE CRÍTIC" : "⚠️ CRITICAL DEADLINE");
                    const warningDesc = lang === "es"
                        ? "Cierre editorial 'Innovations in Food Technology' (Edición Noviembre) es el 28 de Octubre. ¡Acción Inmediata Requerida!"
                        : (lang === "ca" ? "Tancament editorial 'Innovations in Food Technology' (Edició Novembre) és el 28 d'Octubre. Acció Immediata Requerida!"
                            : "Editorial closing 'Innovations in Food Technology' (November Issue) is October 28th. Immediate Action Required!");

                    generated.push({
                        phase: "ALERTA",
                        date: `${start.getFullYear()}-10-28`,
                        title: warningTitle,
                        description: warningDesc
                    });
                }

            } else { // Maintenance
                if (lang === "es") {
                    phases = [
                        { buffer: 0, title: "Q1: Refuerzo de Credenciales", desc: "Campaña centrada en certificaciones (GMP, ISO 22000, EcoVadis). Recordatorio de 'Partnership Seguro'." },
                        { buffer: 4, title: "Q2: Casos de Éxito", desc: "Publicación de 'Case Studies' con clientes top (anonimizados) demostrando estabilidad de suministro." },
                        { buffer: 8, title: "Q3: Innovación Incremental", desc: "Newsletters sobre mejoras menores en proceso o sostenibilidad." },
                        { buffer: 11, title: "Q4: Renovación de Acuerdos", desc: "Eventos VIP privados para asegurar contratos del año siguiente." }
                    ];
                } else if (lang === "ca") {
                    phases = [
                        { buffer: 0, title: "Q1: Reforç de Credencials", desc: "Campanya centrada en certificacions (GMP, ISO 22000, EcoVadis). Recordatori de 'Partnership Segur'." },
                        { buffer: 4, title: "Q2: Casos d'Èxit", desc: "Publicació de 'Case Studies' amb clients top (anonimitzats) demostrant estabilitat de subministrament." },
                        { buffer: 8, title: "Q3: Innovació Incremental", desc: "Newsletters sobre millores menors en procés o sostenibilitat." },
                        { buffer: 11, title: "Q4: Renovació d'Acords", desc: "Esdeveniments VIP privats per assegurar contractes de l'any següent." }
                    ];
                } else {
                    phases = [
                        { buffer: 0, title: "Q1: Credential Reinforcement", desc: "Campaign focused on certifications (GMP, ISO 22000, EcoVadis). 'Safe Partnership' reminder." },
                        { buffer: 4, title: "Q2: Success Stories", desc: "Publishing 'Case Studies' with top clients (anonymized) demonstrating supply stability." },
                        { buffer: 8, title: "Q3: Incremental Innovation", desc: "Newsletters on minor process or sustainability improvements." },
                        { buffer: 11, title: "Q4: Agreement Renewal", desc: "Private VIP events to secure next year's contracts." }
                    ];
                }
            }


            phases.forEach((p, idx) => {
                generated.push({
                    phase: `${lang === "es" ? "Fase" : lang === "ca" ? "Fase" : "Phase"} ${idx + 1}`,
                    date: addMonths(start, p.buffer),
                    title: p.title,
                    description: p.desc
                });
            });

            setMilestones(generated);
            completeStep("timeline", generated);
            setLoading(false);
        }, 1500);
    };

    const handleStepByStep = () => {
        setAnalyzing(true);
        setTimeout(() => {
            let content = "";

            if (lang === "es") {
                content = `**ANÁLISIS DETALLADO PASO A PASO**\n\n**CONTEXTO GENERAL:**\nLa hoja de ruta generada para ${seed} sigue una metodología de "${campaignType}" con ${milestones.length} hitos clave. Cada fase ha sido diseñada para maximizar el impacto en base a datos empíricos del sector Nutracéutico.\n\n`;

                milestones.forEach((m, idx) => {
                    content += `---\n\n**${m.phase.toUpperCase()}: ${m.title}**\n*Fecha Objetivo:* ${m.date}\n\n`;

                    if (m.title.includes("Activación") || m.title.includes("Trend Velocity")) {
                        content += `**Desglose Táctico:**\n`;
                        content += `* **¿Por qué 48 horas?** Los estudios de "Share of Voice" en LinkedIn muestran que el 72% del engagement ocurre en las primeras 48h de publicación. La saturación inmediata crea un efecto de "FOMO" (Fear of Missing Out) en R&D directors.\n`;
                        content += `* **Implementación Práctica:** Programar 3 posts separados por 8h (LinkedIn Scheduler). Post 1: "Thought Leadership" (6 AM GMT), Post 2: Video Testimonial (2 PM GMT), Post 3: Infographic (10 PM GMT).\n`;
                        content += `* **Métricas de Éxito:** >500 impresiones por post, >15% engagement rate, >10 InMails directos de decisores.\n\n`;
                    } else if (m.title.includes("Validación Técnica") || m.title.includes("Webinar")) {
                        content += `**Desglose Táctico:**\n`;
                        content += `* **Formato Recomendado:** Webinar de 45 min estructurado como: 15 min presentación, 20 min "Live Demo" (análisis de espectros HPLC en tiempo real), 10 min Q&A.\n`;
                        content += `* **Insight de IA:** Los webinars con "Live Demo" tienen un 35% más de conversión a MQL que las presentaciones estáticas (fuente: Content Marketing Institute 2024).\n`;
                        content += `* **Riesgo y Mitigación:** Si la asistencia es <25 personas, ofrecer grabación privada a no-asistentes con CTA urgente ("Acceso válido por 7 días").\n\n`;
                    } else if (m.title.includes("Conversión") || m.title.includes("Sampling")) {
                        content += `**Desglose Táctico:**\n`;
                        content += `* **Composición del Kit:** No enviar solo el ingrediente puro. Incluir: (1) Muestra de 50g, (2) Formulación sugerida para gummy (PDF), (3) Certificado COA, (4) Tarjeta personalizada del Director Técnico de Euromed.\n`;
                        content += `* **Logística Crítica:** Usar DHL Express (no estándar). El 68% de los buyers asocian velocidad de envío con "seriedad comercial".\n`;
                        content += `* **Follow-up Agresivo:** Llamada telefónica 3 días post-entrega. No email. El contacto directo aumenta conversión en 40%.\n\n`;
                    } else if (m.title.includes("Refuerzo de Credenciales") || m.title.includes("Credential")) {
                        content += `**Desglose Táctico:**\n`;
                        content += `* **Visualización:** Crear infografía comparativa mostrando certificaciones de Euromed vs. promedio del sector. El contenido visual genera 3x más shares.\n`;
                        content += `* **Canal Prioritario:** LinkedIn Company Page + Retargeting a visitantes del sitio web de los últimos 90 días.\n`;
                        content += `* **Mensaje Clave:** "Partnership Seguro = Zero Recalls". Usar datos de trazabilidad Camp to Lab como prueba.\n\n`;
                    } else if (m.title.includes("Casos de Éxito") || m.title.includes("Success Stories")) {
                        content += `**Desglose Táctico:**\n`;
                        content += `* **Storytelling:** Estructurar el caso como: (1) Desafío del cliente, (2) Solución técnica de Euromed, (3) Resultado cuantificable (ej. "reducción del 30% en tiempo de formulación").\n`;
                        content += `* **Insight de IA:** Los case studies con datos cuantitativos tienen un 58% más de credibilidad percibida.\n`;
                        content += `* **Formato:** Video corto (90 seg) + Blog post detallado. Priorizar video para redes sociales.\n\n`;
                    } else if (m.title.includes("DEADLINE")) {
                        content += `**ACCIÓN URGENTE:**\n`;
                        content += `* **Deadline Editorial:** El cierre del 28 de Octubre es INAMOVIBLE. Cualquier retraso significa 12 meses de espera para la siguiente edición.\n`;
                        content += `* **Acción Inmediata:** Redactar el press release HOY. Usar template de NutraIngredients (disponible en su Media Kit). Enviar draft a editor 7 días antes del deadline (margen de seguridad).\n`;
                        content += `* **Contenido Recomendado:** Enfocarse en "Innovación Sostenible" (palabra clave de moda en Q4 2024-2025).\n\n`;
                    } else {
                        content += `**Desglose Táctico:**\n`;
                        content += `* **Ejecución:** ${m.description}\n`;
                        content += `* **Recursos Necesarios:** 1 Project Manager (seguimiento), presupuesto estimado 5-10% del total de campaña.\n`;
                        content += `* **KPI de Éxito:** Engagement mensurable y feedback cualitativo de al menos 3 clientes VIP.\n\n`;
                    }
                });

                content += `\n**CONCLUSIÓN ESTRATÉGICA:**\n`;
                content += `La hoja de ruta es viable si se ejecuta con precisión militar. El mayor riesgo es la dilución del mensaje por falta de coordinación entre equipos. **Recomendación Final:** Asignar un "Campaign Owner" único con autoridad para tomar decisiones en tiempo real.`;

            } else if (lang === "ca") {
                content = `**ANÀLISI DETALLADA PAS A PAS**\n\n**CONTEXT GENERAL:**\nLa full de ruta generada per a ${seed} segueix una metodologia de "${campaignType}" amb ${milestones.length} fites clau.\n\n`;

                milestones.forEach((m, idx) => {
                    content += `---\n\n**${m.phase.toUpperCase()}: ${m.title}**\n*Data Objectiu:* ${m.date}\n\n`;
                    content += `**Desglossament Tàctic:**\n* Execució: ${m.description}\n* Recursos: Project Manager + pressupost 5-10% del total.\n* KPI: Engagement mensurable.\n\n`;
                });

                content += `\n**CONCLUSIÓ ESTRATÈGICA:**\nLa full de ruta és viable amb execució precisa. Assignar un "Campaign Owner" únic.`;

            } else {
                content = `**DETAILED STEP-BY-STEP ANALYSIS**\n\n**GENERAL CONTEXT:**\nThe roadmap generated for ${seed} follows a "${campaignType}" methodology with ${milestones.length} key milestones.\n\n`;

                milestones.forEach((m, idx) => {
                    content += `---\n\n**${m.phase.toUpperCase()}: ${m.title}**\n*Target Date:* ${m.date}\n\n`;

                    if (m.title.includes("Activation") || m.title.includes("Trend Velocity")) {
                        content += `**Tactical Breakdown:**\n`;
                        content += `* **Why 48 hours?** LinkedIn "Share of Voice" studies show 72% of engagement occurs in the first 48h. Immediate saturation creates FOMO effect.\n`;
                        content += `* **Practical Implementation:** Schedule 3 posts 8h apart. Post 1: Thought Leadership (6 AM GMT), Post 2: Video (2 PM), Post 3: Infographic (10 PM).\n`;
                        content += `* **Success Metrics:** >500 impressions/post, >15% engagement, >10 direct InMails from decision-makers.\n\n`;
                    } else {
                        content += `**Tactical Breakdown:**\n* Execution: ${m.description}\n* Resources: Project Manager + 5-10% campaign budget.\n* KPI: Measurable engagement.\n\n`;
                    }
                });

                content += `\n**STRATEGIC CONCLUSION:**\nRoadmap is viable with precise execution. Assign a single "Campaign Owner" with real-time decision authority.`;
            }

            setAnalysis(content);
            setAnalyzing(false);
        }, 2500);
    };

    const handleExport = () => {
        const content = `
EUROMED INTELPLANNER - TIMELINE ROADMAP REPORT
===============================================
Date: ${new Date().toLocaleDateString()}
Asset: ${seed}
Campaign Type: ${campaignType}
Start Date: ${startDate}

${lang === "es" ? "HOJA DE RUTA" : (lang === "ca" ? "FULL DE RUTA" : "ROADMAP")}
-----------------------------------------------
${milestones.map((m, idx) => `
[${m.phase}] ${m.title}
Fecha: ${m.date}
${m.description}
`).join('\n')}

${analysis ? `
${lang === "es" ? "ANÁLISIS PASO A PASO" : (lang === "ca" ? "ANÀLISI PAS A PAS" : "STEP-BY-STEP ANALYSIS")}
-----------------------------------------------
${analysis}
` : ''}

===============================================
Generated by Gravity Engine (Mock)
`;

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Timeline_Roadmap_${seed}_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.iconWrapper}>
                    <CalendarClock size={40} />
                </div>
                <div>
                    <h1 className={styles.title}>
                        {seed && <span style={{ opacity: 0.7 }}>{seed}: </span>}
                        {t("temporalProgramming")}
                    </h1>
                    <p className={styles.subtitle}>{t("timelineSubtitle")}</p>
                </div>
            </header>

            <div className={styles.content}>
                <section className={`${styles.panel} glass-panel`}>
                    <h2 className={styles.panelTitle}>{t("roadmapConfig")}</h2>
                    <form onSubmit={handleGenerate} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                {t("campaignType") || "Campaign Type"}
                                <InfoTooltip content={t("tooltipCampaignType")} />
                            </label>
                            <select className={styles.input} value={campaignType} onChange={e => setCampaignType(e.target.value)}>
                                <option value="Impact">Impact (Launch / Growth)</option>
                                <option value="Maintenance">Maintenance (Retention)</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>{t("campaignStart")}</label>
                            <input className={styles.input} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                        </div>
                        <button type="submit" className={`glass-button ${styles.submitBtn}`} disabled={loading}>
                            {loading ? <span className={styles.generating}><Sparkles size={18} className={styles.spin} /> {t("forecasting")}</span> : t("generateRoadmap")}
                        </button>
                    </form>
                </section>

                {milestones.length > 0 && (
                    <section className={`${styles.timelineWrapper} glass-panel`}>
                        <div className={styles.timeline}>
                            {milestones.map((m, idx) => (
                                <div key={idx} className={styles.timelineItem}>
                                    <div className={styles.timelineMarker}>
                                        <div className={styles.markerCircle}>
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <div className={styles.markerLine}></div>
                                    </div>
                                    <div className={styles.timelineContent}>
                                        <span className={styles.timelineDate}>{m.date}</span>
                                        <h3 className={styles.timelineTitle}>{m.title} <span className={styles.timelinePhase}>({m.phase})</span></h3>
                                        <p className={styles.timelineDesc}>{m.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {!analysis ? (
                            <button
                                onClick={handleStepByStep}
                                className={`glass-button`}
                                disabled={analyzing}
                                style={{
                                    width: '100%',
                                    marginTop: '2rem',
                                    background: 'rgba(34, 197, 94, 0.2)',
                                    border: '1px solid rgba(34, 197, 94, 0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px'
                                }}
                            >
                                {analyzing ? (
                                    <>
                                        <Sparkles className={styles.spin} size={18} />
                                        {lang === "ca" ? "Analitzant..." : (lang === "es" ? "Analizando..." : "Analyzing...")}
                                    </>
                                ) : (
                                    <>
                                        <BrainCircuit size={18} />
                                        {lang === "ca" ? "Pas a Pas" : (lang === "es" ? "Paso a Paso" : "Step by Step")}
                                    </>
                                )}
                            </button>
                        ) : (
                            <div style={{
                                marginTop: '2rem',
                                padding: '1.5rem',
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: '12px',
                                borderLeft: '3px solid #22c55e',
                                textAlign: 'left'
                            }}>
                                <div dangerouslySetInnerHTML={{
                                    __html: analysis
                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        .replace(/\n\n/g, '<br/><br/>')
                                        .replace(/\* (.*?)\n/g, '• $1<br/>')
                                        .replace(/---/g, '<hr style="border: 0.5px solid rgba(255,255,255,0.2); margin: 1rem 0;" />')
                                }} />
                            </div>
                        )}

                        <button
                            onClick={handleExport}
                            className={`glass-button`}
                            style={{
                                width: '100%',
                                marginTop: '1.5rem',
                                background: 'rgba(59, 130, 246, 0.2)',
                                border: '1px solid rgba(59, 130, 246, 0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                        >
                            <Download size={18} />
                            {lang === "ca" ? "Descarregar Informe TXT" : (lang === "es" ? "Descargar Informe TXT" : "Download TXT Report")}
                        </button>
                    </section>
                )}
            </div>
        </div>
    );
}
