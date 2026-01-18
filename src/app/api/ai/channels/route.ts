import { NextRequest, NextResponse } from "next/server";
import { generateChannelMix } from "@/lib/gemini";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { seed, market, audience, lang } = body;

        // Validate inputs
        if (!seed || !market || !audience || !lang) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        // Call Gemini API
        const channels = await generateChannelMix({
            seed,
            market,
            audience,
            lang
        });

        return NextResponse.json({ channels });
    } catch (error) {
        console.error("Channels API error:", error);
        return NextResponse.json(
            { error: "Failed to generate channel recommendations" },
            { status: 500 }
        );
    }
}
