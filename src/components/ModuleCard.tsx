import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";
import styles from "./ModuleCard.module.css";

interface ModuleCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    color?: string; // Optional custom accent color
}

export default function ModuleCard({ title, description, icon: Icon, href }: ModuleCardProps) {
    return (
        <Link href={href} className={styles.card}>
            <div className={styles.iconWrapper}>
                <Icon size={32} />
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.arrow}>
                <ArrowRight size={20} />
            </div>
        </Link>
    );
}
