"use client";

import { useState, useRef, useEffect } from "react";
import { Info, X } from "lucide-react";
import styles from "./InfoTooltip.module.css";

interface InfoTooltipProps {
    content: string;
    title?: string;
}

export default function InfoTooltip({ content, title }: InfoTooltipProps) {
    const [isOpen, setIsOpen] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className={styles.container} ref={tooltipRef}>
            <button
                type="button"
                className={styles.infoButton}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                aria-label="More information"
            >
                <Info size={16} />
            </button>

            {isOpen && (
                <div className={styles.tooltip}>
                    <button
                        className={styles.closeButton}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                    >
                        <X size={14} />
                    </button>
                    {title && <h4 className={styles.tooltipTitle}>{title}</h4>}
                    <div
                        className={styles.tooltipContent}
                        dangerouslySetInnerHTML={{
                            __html: content
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\n/g, '<br/>')
                        }}
                    />
                </div>
            )}
        </div>
    );
}
