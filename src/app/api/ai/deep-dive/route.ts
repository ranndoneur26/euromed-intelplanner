import { NextRequest, NextResponse } from "next/server";
import { generateDeepDive } from "@/lib/gemini";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { strategy, seed, lang } = body;

        // Validate inputs
        if (!strategy || !seed || !lang) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        // Call Gemini API
        const guide = await generateDeepDive({
            strategy,
            seed,
            lang
        });

        return NextResponse.json({ guide });
    } catch (error) {
        console.error("Deep Dive API error:", error);
        return NextResponse.json(
            { error: "Failed to generate implementation guide" },
            { status: 500 }
        );
    }
}
