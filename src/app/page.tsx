"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGravity } from "@/context/GravityContext";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./page.module.css";
import { Sparkles, Command } from "lucide-react";

export default function Home() {
  const { t, lang, setLang } = useLanguage();
  const { setSeed } = useGravity();
  const [inputSeed, setInputSeed] = useState("");
  const router = useRouter();

  const handleInitialize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSeed.trim()) return;

    setSeed(inputSeed);
    router.push("/strategy");
  };

  return (
    <div className={styles.main}>
      <div className={styles.centerContainer} style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', paddingTop: '10vh' }}>
        {/* Language Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
          {(["en", "es", "ca"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              style={{
                background: lang === l ? "var(--primary-green)" : "rgba(255,255,255,0.05)",
                border: "1px solid var(--glass-border)",
                padding: "0.6rem 1.2rem",
                color: lang === l ? "white" : "var(--text-secondary)",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "600",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)"
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <div className={styles.iconWrapper} style={{ marginBottom: '2rem' }}>
          <Command size={64} style={{ color: 'var(--primary-green)' }} />
        </div>

        <h1 className={styles.title} style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          System <span className={styles.highlight}>Control Panel</span>
        </h1>
        <p className={styles.subtitle} style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
          {t("welcome") || "Initialize the Intelligent Advertising Planner by defining the Core Entity (Seed)."}
        </p>

        <form onSubmit={handleInitialize} className={styles.controlForm} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className={`glass-panel`} style={{ padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
            <label style={{ display: 'block', textAlign: 'left', marginBottom: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Core Entity / Seed Input
            </label>
            <input
              type="text"
              value={inputSeed}
              onChange={(e) => setInputSeed(e.target.value)}
              placeholder="E.g. Wellemon, Vitafoods 2026, Pomanox Launch..."
              className={styles.seedInput}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.1rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                marginBottom: '1.5rem'
              }}
              autoFocus
            />
            <button
              type="submit"
              className="glass-button"
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', justifyContent: 'center' }}
              disabled={!inputSeed.trim()}
            >
              <Sparkles size={20} /> Initialize System Protocol
            </button>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            *Defining the Seed will reset all downstream modules to ensure logic integrity.
          </p>
        </form>
      </div>
    </div>
  );
}
