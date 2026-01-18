import { NextRequest, NextResponse } from "next/server";
import { generateStrategyAnalysis } from "@/lib/gemini";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { seed, market, budget, campaignType, lang } = body;

        // Validate inputs
        if (!seed || !market || !budget || !campaignType || !lang) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        const budgetNum = parseFloat(budget);
        if (isNaN(budgetNum) || budgetNum < 5000) {
            return NextResponse.json(
                { error: "Budget must be at least €5000" },
                { status: 400 }
            );
        }

        // Call Gemini API
        const result = await generateStrategyAnalysis({
            seed,
            market,
            budget: budgetNum,
            campaignType,
            lang
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Strategy API error:", error);
        return NextResponse.json(
            { error: "Failed to generate strategy analysis" },
            { status: 500 }
        );
    }
}
