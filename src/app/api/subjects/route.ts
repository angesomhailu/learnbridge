import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const subjects = await prisma.subject.findMany({
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json({
            success: true,
            subjects,
        });
    } catch (error) {
        console.error("Get subjects error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve subjects",
            },
            { status: 500 }
        );
    }
}