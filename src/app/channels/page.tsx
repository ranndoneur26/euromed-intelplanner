"use client";

import { useState } from "react";
import { Share2, Sparkles, Smartphone, Tv } from "lucide-react";
import styles from "./page.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { useGravity } from "@/context/GravityContext";

interface Channel {
    name: string;
    type: "Digital" | "Traditional";
    relevance: number; // 0-100
    reasoning: string;
}

export default function ChannelsPage() {
    const { t, lang } = useLanguage();
    const { seed, completeStep } = useGravity();
    const [market, setMarket] = useState("");
    const [audience, setAudience] = useState("");
    const [loading, setLoading] = useState(false);
    const [channels, setChannels] = useState<Channel[]>([]);

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            // Mock AI Logic
            const audienceLower = audience.toLowerCase();
            const marketLower = market.toLowerCase();
            const seedLower = seed.toLowerCase();

            // TRIGGERS
            // Instagram: Visual or Youth
            const isInstagram = audienceLower.includes("gen z") || audienceLower.includes("millennial") || audienceLower.includes("visual") || audienceLower.includes("color") || audienceLower.includes("food porn") || audienceLower.includes("estética");
            // LinkedIn: Corporate
            const isLinkedIn = true; // Always on for B2B
            // Scientific Portals: Specific Health Areas
            const isImmune = audienceLower.includes("immune") || audienceLower.includes("inmune") || audienceLower.includes("inmuno") || seedLower.includes("immune");
            const isProbiotics = audienceLower.includes("probiotic") || audienceLower.includes("probiótico") || audienceLower.includes("microbiom");

            let newChannels: Channel[] = [];

            // Region Logic
            const isUSA = marketLower.includes("usa") || marketLower.includes("us") || marketLower.includes("america") || marketLower.includes("states");
            const isAsia = marketLower.includes("asia") || marketLower.includes("china") || marketLower.includes("japan") || marketLower.includes("apac");

            // Event & Media Defaults
            let event = "Vitafoods Europe (Geneva)";
            let media = "NutraIngredients.com";

            if (isUSA) {
                event = "SupplySide West (Las Vegas)";
                media = "Nutraceuticals World / SupplySide Supplement Journal";
            } else if (isAsia) {
                event = "Vitafoods Asia / CPhI Japan";
                media = "NutraIngredients-Asia";
            }

            if (lang === "es") {
                // LINKEDIN (Always)
                newChannels.push({
                    name: "Contenido Patrocinado LinkedIn (B2B)",
                    type: "Digital",
                    relevance: 95,
                    reasoning: `Para el perfil "${audience}", LinkedIn es crítico (Logic Gate 2.1). Priorizar campañas de Thought Leadership dirigidas a Arandovo o Vivomega. El contenido debe centrarse en validez clínica.`
                });

                // INSTAGRAM (Conditional)
                if (isInstagram) {
                    newChannels.push({
                        name: "Instagram / TikTok (Visual Storytelling)",
                        type: "Digital",
                        relevance: 88,
                        reasoning: `Detectado atributo visual/generacional. Activar 'Shades of Aqua' logic (estilo GNT Group). El ingrediente (${seed}) debe verse 'Instagrameable' para conectar con marcas de consumo Gen Z.`
                    });
                }

                // SCIENTIFIC (Conditional)
                if (isImmune) {
                    newChannels.push({
                        name: "Indian Journal of Clinical Biochemistry",
                        type: "Digital",
                        relevance: 92,
                        reasoning: `Requerimiento científico específico: Estudios clínicos sobre prevención. Indexar pautas en portales de alto rigor académico para validar claims de inmunidad para ${seed}.`
                    });
                } else if (isProbiotics) {
                    newChannels.push({
                        name: "The Probiotics Institute (Chr. Hansen Ecosystem)",
                        type: "Digital",
                        relevance: 92,
                        reasoning: `Categoría Probióticos detectada. Priorizar ecosistemas educativos validados para diferenciarse en un mercado saturado.`
                    });
                }

                // TRADITIONAL (Mandatory)
                newChannels.push({
                    name: `Revistas: ${media} (Print & Digital)`,
                    type: "Traditional",
                    relevance: 85,
                    reasoning: `Presencia obligatoria en "Innovations in Food Technology" y ${media}. Validación técnica necesaria para nuevos procesos (ej. fermentación) de ${seed}.`
                });

                newChannels.push({
                    name: `Eventos: ${event}`,
                    type: "Traditional",
                    relevance: 90,
                    reasoning: `Sincronización con ciclos de exhibición (Pre-Event). Priorizar lanzamientos tipo BCP® (Gelita) en estos foros presenciales para ${seed}.`
                });

            } else if (lang === "ca") {
                // LINKEDIN (Always)
                newChannels.push({
                    name: "Contingut Patrocinat LinkedIn (B2B)",
                    type: "Digital",
                    relevance: 95,
                    reasoning: `Per al perfil "${audience}", LinkedIn és crític (Logic Gate 2.1). Prioritzar campanyes de Thought Leadership dirigides a Arandovo o Vivomega. El contingut s'ha de centrar en validesa clínica.`
                });

                // INSTAGRAM (Conditional)
                if (isInstagram) {
                    newChannels.push({
                        name: "Instagram / TikTok (Visual Storytelling)",
                        type: "Digital",
                        relevance: 88,
                        reasoning: `Detectat atribut visual/generacional. Activar 'Shades of Aqua' logic (estil GNT Group). L'ingredient (${seed}) s'ha de veure 'Instagrameable' per connectar amb marques de consum Gen Z.`
                    });
                }

                // SCIENTIFIC (Conditional)
                if (isImmune) {
                    newChannels.push({
                        name: "Indian Journal of Clinical Biochemistry",
                        type: "Digital",
                        relevance: 92,
                        reasoning: `Requeriment científic específic: Estudis clínics sobre prevenció. Indexar pautes en portals d'alt rigor acadèmic per validar claims d'immunitat per a ${seed}.`
                    });
                } else if (isProbiotics) {
                    newChannels.push({
                        name: "The Probiotics Institute (Chr. Hansen Ecosystem)",
                        type: "Digital",
                        relevance: 92,
                        reasoning: `Categoria Probiòtics detectada. Prioritzar ecosistemes educatius validats per diferenciar-se en un mercat saturat.`
                    });
                }

                // TRADITIONAL (Mandatory)
                newChannels.push({
                    name: `Revistes: ${media} (Print & Digital)`,
                    type: "Traditional",
                    relevance: 85,
                    reasoning: `Presència obligatòria a "Innovations in Food Technology" i ${media}. Validació tècnica necessària per a nous processos (ex. fermentació) de ${seed}.`
                });

                newChannels.push({
                    name: `Esdeveniments: ${event}`,
                    type: "Traditional",
                    relevance: 90,
                    reasoning: `Sincronització amb cicles d'exhibició (Pre-Event). Prioritzar llançaments tipus BCP® (Gelita) en aquests fòrums presencials per a ${seed}.`
                });

            } else {
                // English
                // LINKEDIN (Always)
                newChannels.push({
                    name: "LinkedIn Sponsored Content (B2B)",
                    type: "Digital",
                    relevance: 95,
                    reasoning: `For profile "${audience}", LinkedIn is critical (Logic Gate 2.1). Prioritize Thought Leadership campaigns targeting Arandovo or Vivomega. Content must focus on clinical validity.`
                });

                // INSTAGRAM (Conditional)
                if (isInstagram) {
                    newChannels.push({
                        name: "Instagram / TikTok (Visual Storytelling)",
                        type: "Digital",
                        relevance: 88,
                        reasoning: `Visual/generational attribute detected. Activate 'Shades of Aqua' logic (GNT Group style). Ingredient (${seed}) must look 'Instagrammable' to connect with Gen Z consumer brands.`
                    });
                }

                // SCIENTIFIC (Conditional)
                if (isImmune) {
                    newChannels.push({
                        name: "Indian Journal of Clinical Biochemistry",
                        type: "Digital",
                        relevance: 92,
                        reasoning: `Specific scientific requirement: Clinical studies on prevention. Index ads in high-rigor academic portals to validate immunity claims for ${seed}.`
                    });
                } else if (isProbiotics) {
                    newChannels.push({
                        name: "The Probiotics Institute (Chr. Hansen Ecosystem)",
                        type: "Digital",
                        relevance: 92,
                        reasoning: `Probiotics category detected. Prioritize validated educational ecosystems to differentiate in a saturated market.`
                    });
                }

                // TRADITIONAL (Mandatory)
                newChannels.push({
                    name: `Journals: ${media} (Print & Digital)`,
                    type: "Traditional",
                    relevance: 85,
                    reasoning: `Mandatory presence in "Innovations in Food Technology" and ${media}. Technical validation required for new processes (e.g., fermentation) for ${seed}.`
                });

                newChannels.push({
                    name: `Events: ${event}`,
                    type: "Traditional",
                    relevance: 90,
                    reasoning: ` synchronization with exhibition cycles (Pre-Event). Prioritize BCP® style launches (Gelita) in these face-to-face forums for ${seed}.`
                });
            }

            setChannels(newChannels);
            completeStep("channels", newChannels);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.iconWrapper}>
                    <Share2 size={40} />
                </div>
                <div>
                    <h1 className={styles.title}>{t("omnichannelMix")}</h1>
                    <p className={styles.subtitle}>{t("channelsSubtitle")}</p>
                </div>
            </header>

            <div className={styles.content}>
                <section className={`${styles.panel} glass-panel`}>
                    <h2 className={styles.panelTitle}>{t("marketParameters")}</h2>
                    <form onSubmit={handleGenerate} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>{t("targetGeo")}</label>
                            <input className={styles.input} value={market} onChange={e => setMarket(e.target.value)} placeholder="e.g. South Europe" required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>{t("targetAudience")}</label>
                            <input className={styles.input} value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. Pharma buyers, Health enthusiasts" required />
                        </div>
                        <button type="submit" className={`glass-button ${styles.submitBtn}`} disabled={loading}>
                            {loading ? <span className={styles.generating}><Sparkles size={18} className={styles.spin} /> {t("analyzing")}</span> : t("generateMix")}
                        </button>
                    </form>
                </section>

                {channels.length > 0 && (
                    <section className={`${styles.results} glass-panel`}>
                        <h2 className={styles.panelTitle}>{t("recommendedMix")}</h2>
                        <div className={styles.channelGrid}>
                            {channels.map((channel, idx) => (
                                <div key={idx} className={styles.channelCard}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.channelIcon}>
                                            {channel.type === "Digital" ? <Smartphone size={20} /> : <Tv size={20} />}
                                        </div>
                                        <span className={styles.channelType}>{channel.type}</span>
                                    </div>
                                    <h3 className={styles.channelName}>{channel.name}</h3>
                                    <div className={styles.relevanceBar}>
                                        <div className={styles.relevanceFill} style={{ width: `${channel.relevance}%` }}></div>
                                    </div>
                                    <p className={styles.relevanceLabel}>{channel.relevance}% {t("match")}</p>
                                    <p className={styles.reasoning}>{channel.reasoning}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
