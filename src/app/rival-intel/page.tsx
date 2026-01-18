"use client";

import { useState } from "react";
import { Swords, Sparkles, Shield, Zap, Target } from "lucide-react";
import styles from "./page.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { useGravity } from "@/context/GravityContext";

interface GapAnalysis {
    dimension: string;
    us: string;
    competitor: string;
    verdict: string;
}

interface GapItem {
    gap: string;
    tacticalResponse: string;
    relevanceScore: number;
}

export default function RivalIntelPage() {
    const { t, lang } = useLanguage();
    const { seed, completeStep } = useGravity();
    const [competitor, setCompetitor] = useState("");
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<GapAnalysis[]>([]);
    const [synthesis, setSynthesis] = useState("");
    const [loadingGaps, setLoadingGaps] = useState(false);
    const [detectedGaps, setDetectedGaps] = useState<GapItem[]>([]);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/ai/competitor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    seed,
                    competitor,
                    lang
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate competitor analysis');
            }

            const result = await response.json();
            setAnalysis(result.analysis);
            setSynthesis(result.synthesis);
            completeStep("rival-intel", result.analysis);
        } catch (err) {
            console.error("Competitor analysis error:", err);
            // Show empty result on error
            setAnalysis([]);
            setSynthesis("");
        } finally {
            setLoading(false);
        }
    };

    const handleDetectGaps = async () => {
        setLoadingGaps(true);

        try {
            const response = await fetch('/api/ai/gap-detection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    seed,
                    lang
                })
            });

            if (!response.ok) {
                throw new Error('Failed to detect gaps');
            }

            const result = await response.json();
            setDetectedGaps(result.gaps || []);
        } catch (err) {
            console.error("Gap detection error:", err);
            setDetectedGaps([]);
        } finally {
            setLoadingGaps(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.iconWrapper}>
                    <Swords size={40} />
                </div>
                <div>
                    <h1 className={styles.title}>
                        {seed && <span style={{ opacity: 0.7 }}>{seed}: </span>}
                        {t("competitorGap")}
                    </h1>
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

                    <button
                        onClick={handleDetectGaps}
                        className={`glass-button ${styles.submitBtn}`}
                        disabled={loadingGaps}
                        style={{
                            marginTop: '1rem',
                            background: 'rgba(147, 51, 234, 0.2)',
                            border: '1px solid rgba(147, 51, 234, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        {loadingGaps ? (
                            <>
                                <Sparkles size={18} className={styles.spin} />
                                {t("detectingGaps")}
                            </>
                        ) : (
                            <>
                                <Target size={18} />
                                {t("detectGaps")}
                            </>
                        )}
                    </button>
                </section>

                {detectedGaps.length > 0 && (
                    <section className={`${styles.results} glass-panel`} style={{ marginTop: '2rem' }}>
                        <h2 className={styles.panelTitle} style={{ marginBottom: '1.5rem' }}>
                            <Target size={24} style={{ display: 'inline-block', marginRight: '10px', verticalAlign: 'middle' }} />
                            {t("detectGaps")}
                        </h2>

                        {detectedGaps
                            .sort((a, b) => b.relevanceScore - a.relevanceScore)
                            .map((gapItem, index) => {
                                const isBestOption = index === 0;
                                return (
                                    <div key={index} style={{
                                        marginBottom: '1.5rem',
                                        padding: '1.5rem',
                                        background: isBestOption ? 'rgba(34, 197, 94, 0.15)' : 'rgba(147, 51, 234, 0.1)',
                                        borderRadius: '12px',
                                        borderLeft: isBestOption ? '4px solid #22c55e' : '4px solid #9333ea',
                                        position: 'relative'
                                    }}>
                                        {isBestOption && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '-10px',
                                                right: '1rem',
                                                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                                color: 'white',
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem',
                                                fontWeight: '700',
                                                textTransform: 'uppercase'
                                            }}>
                                                ★ {lang === "es" ? "Mejor Opción" : lang === "ca" ? "Millor Opció" : "Best Option"}
                                            </span>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                            <h3 style={{
                                                fontSize: '1.1rem',
                                                fontWeight: '600',
                                                color: isBestOption ? '#4ade80' : '#a78bfa'
                                            }}>
                                                {t("detectedGap")} #{index + 1}
                                            </h3>
                                            <span style={{
                                                background: isBestOption ? 'rgba(34, 197, 94, 0.3)' : 'rgba(147, 51, 234, 0.3)',
                                                color: isBestOption ? '#4ade80' : '#a78bfa',
                                                padding: '4px 10px',
                                                borderRadius: '8px',
                                                fontSize: '0.9rem',
                                                fontWeight: '600'
                                            }}>
                                                {gapItem.relevanceScore}%
                                            </span>
                                        </div>
                                        <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                            {gapItem.gap}
                                        </p>
                                        <div style={{
                                            padding: '1rem',
                                            background: 'rgba(0,0,0,0.2)',
                                            borderRadius: '8px',
                                            marginTop: '0.5rem'
                                        }}>
                                            <h4 style={{
                                                fontSize: '0.95rem',
                                                fontWeight: '600',
                                                marginBottom: '0.5rem',
                                                color: isBestOption ? '#4ade80' : '#c4b5fd'
                                            }}>
                                                {t("tacticalResponse")}
                                            </h4>
                                            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                {gapItem.tacticalResponse}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                    </section>
                )}

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
