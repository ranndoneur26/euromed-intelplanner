"use client";

import { useState } from "react";
import { Share2, Sparkles, Smartphone, Tv, BarChart3, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
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
    const { seed, completeStep, budget } = useGravity();
    const [market, setMarket] = useState("");
    const [audience, setAudience] = useState("");
    const [loading, setLoading] = useState(false);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [explanation, setExplanation] = useState("");

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
                    budget,
                    lang
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate channel mix');
            }

            const data = await response.json();
            setChannels(data.channels);
            setExplanation(data.explanation || "");
            completeStep("channels", data);
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

                        <div className={styles.explanationBox} style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            marginBottom: '2rem'
                        }}>
                            <h3 style={{
                                fontSize: '1.1rem',
                                marginBottom: '0.8rem',
                                color: '#f8fafc',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <Info size={20} color="#38bdf8" />
                                {lang === "es" ? "Análisis de Inversión" : lang === "ca" ? "Anàlisi d'Inversió" : "Investment Analysis"}
                            </h3>
                            <p style={{ lineHeight: '1.6', color: '#e2e8f0', marginBottom: '0.5rem' }}>
                                {explanation}
                            </p>
                            {budget > 0 && (
                                <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                                    {lang === "es" ? "Presupuesto considerado: " : lang === "ca" ? "Pressupost considerat: " : "Budget considered: "}
                                    <strong style={{ color: '#f59e0b' }}>€{budget.toLocaleString()}</strong>
                                </p>
                            )}
                        </div>

                        <div className={styles.chartSection} style={{ marginBottom: '2.5rem', height: '300px' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <BarChart3 size={20} color="#7B9F35" />
                                {lang === "es" ? "Relevancia por Canal" : lang === "ca" ? "Rellevància per Canal" : "Channel Relevance"}
                            </h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={channels} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                                    <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" />
                                    <YAxis type="category" dataKey="name" stroke="#94a3b8" width={120} tick={{ fontSize: 11 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar dataKey="relevance" name={lang === "es" ? "Relevancia" : "Relevance"} radius={[0, 4, 4, 0]}>
                                        {channels.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.type === 'Digital' ? '#38bdf8' : '#7B9F35'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

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
