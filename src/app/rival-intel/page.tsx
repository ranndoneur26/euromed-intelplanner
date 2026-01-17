"use client";

import { useState } from "react";
import { Swords, Sparkles, Shield, Zap } from "lucide-react";
import styles from "./page.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { useGravity } from "@/context/GravityContext";

interface GapAnalysis {
    dimension: string;
    us: string;
    competitor: string;
    verdict: string;
}

export default function RivalIntelPage() {
    const { t, lang } = useLanguage();
    const { seed, completeStep } = useGravity();
    const [competitor, setCompetitor] = useState("");
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<GapAnalysis[]>([]);
    const [synthesis, setSynthesis] = useState("");

    const handleAnalyze = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            // Mock Analysis
            let newData: GapAnalysis[] = [];
            let newSynthesis = "";

            const compLower = competitor.toLowerCase();

            // DETECT COMPETITOR SPECIFIC LOGIC
            const isGivaudan = compLower.includes("givaudan");
            const isEvonik = compLower.includes("evonik");
            const isOrganicHerb = compLower.includes("organic herb");
            const isGNT = compLower.includes("gnt") || compLower.includes("exberry");
            const isSabinsa = compLower.includes("sabinsa");
            const isValio = compLower.includes("valio") || compLower.includes("palmer");
            const isKerry = compLower.includes("kerry");

            if (lang === "es") {
                if (isGivaudan) {
                    newData = [
                        { dimension: "Oferta Clave (Salud Cognitiva)", us: "Solución Líquida Bioactiva (Absorción Rápida)", competitor: "Cereboost™ (Gummies foco día/noche)", verdict: "Brecha de Formato" },
                        { dimension: "Estrategia de Mercado", us: "Enfoque en 'Eficacia Clínica Inmediata'", competitor: "Enfoque en 'Conveniencia y Sabor'", verdict: "Oportunidad de Diferenciación" }
                    ];
                    newSynthesis = `SÍNTESIS ESTRATÉGICA (GIVAUDAN DETECTADO):\n\nEl análisis detecta que Givaudan está saturando el segmento de "Gummies" para salud cognitiva. REACCIÓN DEL SISTEMA: No competir frontalmente en conveniencia. Se recomienda un "Gap Analysis" enfocado en formatos líquidos o shots de alta potencia para el mismo beneficio cognitivo. Atacar el nicho de "Eficacia Inmediata" donde el gummie tiene limitaciones de carga de ingrediente.`;
                } else if (isEvonik) {
                    newData = [
                        { dimension: "Tecnología de Colágeno", us: "Péptidos Bioactivos Específicos (Tejido-Target)", competitor: "Colágeno no animal (Fermentación)", verdict: "Batalla de Narrativas" },
                        { dimension: "Inversión I+D", us: "Estudios Clínicos en Humanos (Gold Standard)", competitor: "Inversión masiva en plataformas biotecnológicas", verdict: "Ventaja Clínica" }
                    ];
                    newSynthesis = `SÍNTESIS ESTRATÉGICA (EVONIK DETECTADO):\n\nEvonik está desplegando capital masivo en colágeno por fermentación. REACCIÓN DEL SISTEMA: Evitar la batalla de "Sostenibilidad Genérica". Priorizar "Specialized Collagen Storytelling" enfocándose en tipos específicos (I, II, III) para nichos médicos donde la fermentación aún no tiene data clínica robusta. Posicionar la oferta como "Bio-Idéntica Probada".`;
                } else if (isOrganicHerb) {
                    newData = [
                        { dimension: "Amplitud de Catálogo", us: "Selección Curada de Alta Potencia", competitor: "Catálogo Masivo (Commodities)", verdict: "Ventaja de Calidad" },
                        { dimension: "Pureza", us: "Estandarización 4:1 HPLC", competitor: "Extractos genéricos (Riesgo de Adulteración)", verdict: "Superioridad Técnica" }
                    ];
                    newSynthesis = `SÍNTESIS ESTRATÉGICA (ORGANIC HERB INC DETECTADO):\n\nEl competidor juega a volumen y precio. REACCIÓN DEL SISTEMA: No entrar en guerra de precios. Recomendar pauta de "Especialización" destacando extractos 4:1 de alta pureza verificada por HPLC. La narrativa debe ser "Menos es Más: La seguridad de lo Premium vs. el Riesgo del Commodity".`;
                } else if (isGNT) {
                    newData = [
                        { dimension: "Estética Visual", us: "Funcionalidad Estética (Polifenoles Visibles)", competitor: "EXBERRY® (Liderazgo en Color Clean Label)", verdict: "Competencia Visual" },
                        { dimension: "Canal Digital", us: "Instagram B2B (Muestras Visuales)", competitor: "Dominio de 'Food Porn' saludable", verdict: "Batalla de Atención" }
                    ];
                    newSynthesis = `SÍNTESIS ESTRATÉGICA (GNT GROUP DETECTADO):\n\nGNT lidera con "Shades of Aqua" y estética visual. REACCIÓN DEL SISTEMA: Sugerir inversión agresiva en Instagram dirigida a marcas de suplementos visuales (Millennial/Gen Z). El ingrediente no solo debe ser sano, debe ser "Instagrammable".`;
                } else {
                    // Default Logic (Generic)
                    newData = [
                        {
                            dimension: "Calidad y Pureza (Propiedad Intelectual)",
                            us: "Pure-Hydro Process® (Extracción solo con agua). Sin disolventes tóxicos.",
                            competitor: "Extracción convencional con disolventes químicos. Riesgo de residuos.",
                            verdict: "Ventaja: SUPERIOR (PhytoProof®)"
                        },
                        {
                            dimension: "Sostenibilidad y ESG",
                            us: "Medalla de Platino EcoVadis (Top 1% Global).",
                            competitor: "Declaraciones genéricas de 'Greenwashing'.",
                            verdict: "Liderazgo de Mercado"
                        }
                    ];
                    newSynthesis = `SÍNTESIS ESTRATÉGICA GENERAL:\n\nEl análisis revela que ${competitor} compite principalmente en precio. La posición de Euromed con ${seed} es inexpugnable si el campo de batalla se define por la **Calidad Fitoquímica** y la **Seguridad**. La tecnología **Pure-Hydro Process®** es un "Moat" tecnológico. Se recomienda atacar en el **"Coste de la No-Calidad"** (riesgos de retirada), posicionando a Euromed como la única opción segura y sostenible (EcoVadis Platinum).`;
                }

            } else if (lang === "ca") {
                if (isGivaudan) {
                    newData = [
                        { dimension: "Oferta Clau (Salut Cognitiva)", us: "Solució Líquida Bioactiva (Absorció Ràpida)", competitor: "Cereboost™ (Gummies focus dia/nit)", verdict: "Bretxa de Format" },
                        { dimension: "Estratègia de Mercat", us: "Enfocament en 'Eficàcia Clínica Immediata'", competitor: "Enfocament en 'Conveniència i Sabor'", verdict: "Oportunitat de Diferenciació" }
                    ];
                    newSynthesis = `SÍNTESI ESTRATÈGICA (GIVAUDAN DETECTAT):\n\nL'anàlisi detecta que Givaudan està saturant el segment de "Gummies" per a salut cognitiva. REACCIÓ DEL SISTEMA: No competir frontalment en conveniència. Es recomana un "Gap Analysis" enfocat en formats líquids o shots d'alta potència per al mateix benefici cognitiu. Atacar el nínxol d'"Eficàcia Immediata" on el gummie té limitacions de càrrega d'ingredient.`;
                } else if (isEvonik) {
                    newData = [
                        { dimension: "Tecnologia de Col·lagen", us: "Pèptids Bioactius Específics (Teixit-Target)", competitor: "Col·lagen no animal (Fermentació)", verdict: "Batalla de Narratives" },
                        { dimension: "Inversió I+D", us: "Estudis Clínics en Humans (Gold Standard)", competitor: "Inversió massiva en plataformes biotecnològiques", verdict: "Avantatge Clínic" }
                    ];
                    newSynthesis = `SÍNTESI ESTRATÈGICA (EVONIK DETECTAT):\n\nEvonik està desplegant capital massiu en col·lagen per fermentació. REACCIÓ DEL SISTEMA: Evitar la batalla de "Sostenibilitat Genèrica". Prioritzar "Specialized Collagen Storytelling" enfocant-se en tipus específics (I, II, III) per a nínxols mèdics on la fermentació encara no té data clínica robusta.`;
                } else {
                    newData = [
                        {
                            dimension: "Qualitat i Puresa (Propietat Intel·lectual)",
                            us: "Pure-Hydro Process® (Extracció només amb aigua). Sense dissolvents tòxics.",
                            competitor: "Extracció convencional amb dissolvents químics. Risc de residus.",
                            verdict: "Avantatge: SUPERIOR (PhytoProof®)"
                        },
                        {
                            dimension: "Sostenibilitat i ESG",
                            us: "Medalla de Platí EcoVadis (Top 1% Global).",
                            competitor: "Declaracions genèriques de 'Greenwashing'.",
                            verdict: "Lideratge de Mercat"
                        }
                    ];
                    newSynthesis = `SÍNTESI ESTRATÈGICA GENERAL:\n\nL'anàlisi revela que ${competitor} competeix principalment en preu. La posició d'Euromed amb ${seed} és inexpugnable si el camp de batalla es defineix per la **Qualitat Fitoquímica** i la **Seguretat**. La tecnologia **Pure-Hydro Process®** és un "Moat" tecnològic. Es recomana atacar en el **"Cost de la No-Qualitat"**, posicionant l'oferta d'Euromed com l'única opció segura i sostenible.`;
                }

            } else {
                // English
                if (isGivaudan) {
                    newData = [
                        { dimension: "Key Offering (Cognitive Health)", us: "Bioactive Liquid Solution (Fast Absorption)", competitor: "Cereboost™ (Day/Night Gummies)", verdict: "Format Gap" },
                        { dimension: "Market Strategy", us: "Focus on 'Immediate Clinical Efficacy'", competitor: "Focus on 'Convenience & Taste'", verdict: "Differentiation Opportunity" }
                    ];
                    newSynthesis = `STRATEGIC SYNTHESIS (GIVAUDAN DETECTED):\n\nAnalysis detects Givaudan saturating the "Gummy" segment for cognitive health. SYSTEM REACTION: Do not compete locally on convenience. Recommend "Gap Analysis" focused on high-potency liquid formats or shots for the same benefit. Attack the "Immediate Efficacy" niche where gummies have payload limitations.`;
                } else if (isEvonik) {
                    newData = [
                        { dimension: "Collagen Technology", us: "Specific Bioactive Peptides (Tissue-Target)", competitor: "Non-animal Collagen (Fermentation)", verdict: "Narrative Battle" },
                        { dimension: "R&D Investment", us: "Human Clinical Studies (Gold Standard)", competitor: "Massive investment in biotech platforms", verdict: "Clinical Advantage" }
                    ];
                    newSynthesis = `STRATEGIC SYNTHESIS (EVONIK DETECTED):\n\nEvonik is deploying massive capital in fermentation collagen. SYSTEM REACTION: Avoid the "Generic Sustainability" battle. Prioritize "Specialized Collagen Storytelling" focusing on specific types (I, II, III) for medical niches where fermentation lacks robust clinical data. Position offering as "Proven Bio-Identical".`;
                } else if (isOrganicHerb) {
                    newData = [
                        { dimension: "Catalog Breadth", us: "High Potency Curated Selection", competitor: "Massive Catalog (Commodities)", verdict: "Quality Advantage" },
                        { dimension: "Purity", us: "HPLC Standardized 4:1", competitor: "Generic Extracts (Adulteration Risk)", verdict: "Technical Superiority" }
                    ];
                    newSynthesis = `STRATEGIC SYNTHESIS (ORGANIC HERB INC DETECTED):\n\nCompetitor plays on volume and price. SYSTEM REACTION: Do not enter price war. Recommend "Specialization" campaign highlighting HPLC-verified 4:1 extracts. Narrative: "Less is More: The Safety of Premium vs. The Risk of Commodity".`;
                } else if (isGNT) {
                    newData = [
                        { dimension: "Visual Aesthetics", us: "Aesthetic Functionality (Visible Polyphenols)", competitor: "EXBERRY® (Clean Label Color Leader)", verdict: "Visual Competition" },
                        { dimension: "Digital Channel", us: "Instagram B2B (Visual Samples)", competitor: "Dominance of Healthy 'Food Porn'", verdict: "Attention Battle" }
                    ];
                    newSynthesis = `STRATEGIC SYNTHESIS (GNT GROUP DETECTED):\n\nGNT leads with "Shades of Aqua" and visual aesthetics. SYSTEM REACTION: Suggest aggressive Instagram investment targeting visual supplement brands (Millennial/Gen Z). The ingredient must not only be healthy, it must be "Instagrammable".`;
                } else {
                    newData = [
                        {
                            dimension: "Quality & Purity (IP)",
                            us: "Pure-Hydro Process® (Water-only extraction). No toxic solvents.",
                            competitor: "Conventional chemical solvent extraction. Risk of residues.",
                            verdict: "Advantage: SUPERIOR (PhytoProof®)"
                        },
                        {
                            dimension: "Sustainability & ESG",
                            us: "EcoVadis Platinum Medal (Top 1% Global).",
                            competitor: "Generic 'Greenwashing' claims.",
                            verdict: "Market Leadership"
                        }
                    ];
                    newSynthesis = `EUROMED STRATEGIC SYNTHESIS:\n\nThe analysis reveals that ${competitor} primarily competes on price. Euromed's position with ${seed} is impregnable if the battlefield is defined by **Phytochemical Quality** and **Safety**. The **Pure-Hydro Process®** technology is a technological "Moat". It is recommended to attack on the **"Cost of Non-Quality"** (recall risks), positioning Euromed as the only safe, sustainable (EcoVadis Platinum) option.`;
                }
            }

            setAnalysis(newData);
            setSynthesis(newSynthesis);
            setAnalysis(newData);
            setSynthesis(newSynthesis);
            completeStep("rival-intel", newData);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.iconWrapper}>
                    <Swords size={40} />
                </div>
                <div>
                    <h1 className={styles.title}>{t("competitorGap")}</h1>
                    <p className={styles.subtitle}>{t("competitorGap")}</p>
                </div>
            </header>

            <div className={styles.content}>
                <section className={`${styles.panel} glass-panel`}>
                    <h2 className={styles.panelTitle}>{t("targetCompetitor")}</h2>
                    <form onSubmit={handleAnalyze} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>{t("competitorName")}</label>
                            <input className={styles.input} value={competitor} onChange={e => setCompetitor(e.target.value)} placeholder="e.g. GenericLabs Inc." required />
                        </div>
                        <button type="submit" className={`glass-button ${styles.submitBtn}`} disabled={loading}>
                            {loading ? <span className={styles.generating}><Sparkles size={18} className={styles.spin} /> {t("scanning")}</span> : t("runAnalysis")}
                        </button>
                    </form>
                </section>

                {analysis.length > 0 && (
                    <section className={`${styles.results} glass-panel`}>
                        <h2 className={styles.panelTitle}>{t("gapReport")}</h2>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>{t("dimension")}</th>
                                        <th><Shield size={16} className={styles.thIcon} /> {t("euromedPosition")}</th>
                                        <th><Zap size={16} className={styles.thIcon} /> {competitor || t("competitor")}</th>
                                        <th>{t("verdict")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analysis.map((row, idx) => (
                                        <tr key={idx}>
                                            <td className={styles.dimCell}>{row.dimension}</td>
                                            <td className={styles.usCell}>{row.us}</td>
                                            <td className={styles.compCell}>{row.competitor}</td>
                                            <td className={styles.verdictCell}>
                                                <span className={row.verdict.includes("High") || row.verdict.includes("Alta") || row.verdict.includes("Alt") ? styles.badgeHigh : row.verdict.includes("Risk") || row.verdict.includes("Riesgo") || row.verdict.includes("Risc") ? styles.badgeRisk : styles.badgeMod}>
                                                    {row.verdict}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className={styles.synthesisBox} style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: '4px solid var(--primary-green)' }}>
                            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                                {synthesis}
                            </p>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
