import { NextRequest, NextResponse } from "next/server";
import { generateTimelineRoadmap } from "@/lib/gemini";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { seed, campaignType, startDate, market, lang } = body;

        // Validate inputs
        if (!seed || !campaignType || !startDate || !lang) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        // Call Gemini API for AI-powered timeline generation
        const result = await generateTimelineRoadmap({
            seed,
            campaignType,
            startDate,
            market,
            lang
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Timeline API error:", error);
        return NextResponse.json(
            { error: "Failed to generate timeline roadmap" },
            { status: 500 }
        );
    }
}
