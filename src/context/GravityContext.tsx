"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// TYPES
type StepStatus = "locked" | "active" | "completed";

interface Step {
    id: string; // 'strategy', 'channels', 'roi', 'timeline', 'rival-intel'
    name: string;
    path: string;
    status: StepStatus;
    data: any; // Store the module's output here
}

interface GravityContextType {
    seed: string; // The "Core Entity"
    setSeed: (seed: string) => void;
    budget: number; // Budget from Strategy module
    setBudget: (budget: number) => void;
    market: string; // Target Geographic Market from Strategy
    setMarket: (market: string) => void;
    steps: Step[];
    unlockStep: (stepId: string) => void;
    completeStep: (stepId: string, data: any) => void;
    resetChain: () => void;
    currentStepIndex: number;
}

const GravityContext = createContext<GravityContextType | undefined>(undefined);

// INITIAL STEPS CONFIG
const INITIAL_STEPS: Step[] = [
    { id: "dashboard", name: "Control Panel", path: "/", status: "completed", data: null }, // Seed input
    { id: "strategy", name: "Strategy", path: "/strategy", status: "locked", data: null },
    { id: "channels", name: "Channels", path: "/channels", status: "locked", data: null },
    { id: "roi", name: "ROI", path: "/roi", status: "locked", data: null },
    { id: "timeline", name: "Timeline", path: "/timeline", status: "locked", data: null },
    { id: "rival-intel", name: "Rival Intel", path: "/rival-intel", status: "locked", data: null },
];

export function GravityProvider({ children }: { children: React.ReactNode }) {
    const [seed, setSeedState] = useState("");
    const [budget, setBudget] = useState(0);
    const [market, setMarket] = useState("");
    const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
    const router = useRouter();

    // 1. SET SEED (Recalibration)
    const setSeed = (newSeed: string) => {
        setSeedState(newSeed);
        // Reset chain: Lock everything except Strategy
        setSteps(prev => prev.map(s => {
            if (s.id === "dashboard") return { ...s, status: "completed" };
            if (s.id === "strategy") return { ...s, status: "active", data: null };
            return { ...s, status: "locked", data: null };
        }));
    };

    // 2. COMPLETE STEP
    const completeStep = (stepId: string, data: any) => {
        setSteps(prev => {
            const index = prev.findIndex(s => s.id === stepId);
            if (index === -1) return prev;

            const newSteps = [...prev];

            // Mark current as completed
            newSteps[index] = { ...newSteps[index], status: "completed", data };

            // Unlock next if exists
            if (index + 1 < newSteps.length) {
                newSteps[index + 1] = { ...newSteps[index + 1], status: "active" };
            }

            return newSteps;
        });
    };

    // 3. FORCE RESET
    const resetChain = () => {
        setSeedState("");
        setSteps(INITIAL_STEPS);
    };

    const unlockStep = (stepId: string) => {
        setSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'active' } : s));
    }


    const currentStepIndex = steps.findIndex(s => s.status === 'active');

    return (
        <GravityContext.Provider value={{ seed, setSeed, budget, setBudget, market, setMarket, steps, completeStep, resetChain, unlockStep, currentStepIndex }}>
            {children}
        </GravityContext.Provider>
    );
}

export function useGravity() {
    const context = useContext(GravityContext);
    if (context === undefined) {
        throw new Error("useGravity must be used within a GravityProvider");
    }
    return context;
}
