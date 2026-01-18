import { NextRequest, NextResponse } from "next/server";
import { generateROIAnalysis } from "@/lib/gemini";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { seed, investment, projectedRevenue, region, sector, lang } = body;

        // Validate inputs
        if (!seed || !investment || !projectedRevenue || !region || !sector || !lang) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        const investmentNum = parseFloat(investment);
        const revenueNum = parseFloat(projectedRevenue);

        if (isNaN(investmentNum) || investmentNum < 5000) {
            return NextResponse.json(
                { error: "Investment must be at least €5000" },
                { status: 400 }
            );
        }

        if (isNaN(revenueNum) || revenueNum <= 0) {
            return NextResponse.json(
                { error: "Projected revenue must be greater than 0" },
                { status: 400 }
            );
        }

        // Call Gemini API for AI-powered ROI analysis
        const result = await generateROIAnalysis({
            seed,
            investment: investmentNum,
            projectedRevenue: revenueNum,
            region,
            sector,
            lang
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("ROI API error:", error);
        return NextResponse.json(
            { error: "Failed to generate ROI analysis" },
            { status: 500 }
        );
    }
}
