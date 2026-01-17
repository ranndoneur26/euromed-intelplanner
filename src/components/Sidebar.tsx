"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useGravity } from "@/context/GravityContext";
import {
    LayoutDashboard,
    Target,
    Share2,
    TrendingUp,
    CalendarClock,
    Swords,
    Lock,
    CheckCircle
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
    const pathname = usePathname();
    const { t } = useLanguage();
    const { steps } = useGravity();

    const icons: Record<string, any> = {
        "dashboard": LayoutDashboard,
        "strategy": Target,
        "channels": Share2,
        "roi": TrendingUp,
        "timeline": CalendarClock,
        "rival-intel": Swords
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <Image
                    src="/Logo Euromed_1.png"
                    alt="Euromed Logo"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '140px', height: 'auto' }}
                    className={styles.logoImage}
                    priority
                />
            </div>

            <nav className={styles.nav}>
                {steps.map((step) => {
                    const Icon = icons[step.id];
                    const isActive = pathname === step.path;
                    const isLocked = step.status === "locked";
                    const isCompleted = step.status === "completed";

                    if (!Icon) return null;

                    return (
                        <Link
                            key={step.path}
                            href={isLocked ? "#" : step.path}
                            className={`${styles.navItem} ${isActive ? styles.navItemActive : ''} ${isLocked ? styles.navItemLocked : ''}`}
                            onClick={(e) => isLocked && e.preventDefault()}
                            style={{
                                cursor: isLocked ? 'not-allowed' : 'pointer',
                                opacity: isLocked ? 0.5 : 1,
                                justifyContent: 'space-between'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Icon className={styles.icon} />
                                <span>{step.name}</span>
                            </div>
                            {isLocked && <Lock size={14} style={{ opacity: 0.5 }} />}
                            {isCompleted && <CheckCircle size={14} style={{ color: 'var(--primary-green)' }} />}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
