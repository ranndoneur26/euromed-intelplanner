"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSync() {
    const { lang } = useLanguage();

    useEffect(() => {
        // Update the HTML lang attribute when language changes
        document.documentElement.lang = lang;
    }, [lang]);

    return null;
}
