import { NextRequest, NextResponse } from "next/server";
import { generateGapDetection } from "@/lib/gemini";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { seed, market, lang } = body;

        // Validate inputs
        if (!seed || !lang) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        // Call AI API with market parameter
        const result = await generateGapDetection({
            seed,
            market: market || "",
            lang
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Gap detection API error:", error);
        return NextResponse.json(
            { error: "Failed to generate gap detection" },
            { status: 500 }
        );
    }
}
