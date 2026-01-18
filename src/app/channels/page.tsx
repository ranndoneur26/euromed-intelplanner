"use client";

import { useState } from "react";
import { Share2, Sparkles, Smartphone, Tv } from "lucide-react";
import styles from "./page.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { useGravity } from "@/context/GravityContext";
import InfoTooltip from "@/components/InfoTooltip";

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

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/ai/channels', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    seed,
                    market,
                    audience,
                    lang
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate channel mix');
            }

            const data = await response.json();
            setChannels(data.channels);
            completeStep("channels", data.channels);
        } catch (err) {
            console.error("Channel generation error:", err);
            // Show empty result on error
            setChannels([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.iconWrapper}>
                    <Share2 size={40} />
                </div>
                <div>
                    <h1 className={styles.title}>
                        {seed && <span style={{ opacity: 0.7 }}>{seed}: </span>}
                        {t("omnichannelMix")}
                    </h1>
                    <p className={styles.subtitle}>{t("channelsSubtitle")}</p>
                </div>
            </header>

            <div className={styles.content}>
                <section className={`${styles.panel} glass-panel`}>
                    <h2 className={styles.panelTitle}>{t("marketParameters")}</h2>
                    <form onSubmit={handleGenerate} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                {t("targetGeo")}
                                <InfoTooltip content={t("tooltipGeoMarket")} />
                            </label>
                            <input className={styles.input} value={market} onChange={e => setMarket(e.target.value)} placeholder="e.g. South Europe" required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                {t("targetAudience")}
                                <InfoTooltip content={t("tooltipTargetAudience")} />
                            </label>
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
