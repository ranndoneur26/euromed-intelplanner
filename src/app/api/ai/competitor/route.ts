import { NextRequest, NextResponse } from "next/server";
import { generateCompetitorAnalysis } from "@/lib/gemini";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { seed, competitor, lang } = body;

        // Validate inputs
        if (!seed || !competitor || !lang) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        // Call Gemini API
        const result = await generateCompetitorAnalysis({
            seed,
            competitor,
            lang
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Competitor API error:", error);
        return NextResponse.json(
            { error: "Failed to generate competitor analysis" },
            { status: 500 }
        );
    }
}
