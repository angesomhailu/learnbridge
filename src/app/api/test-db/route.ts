import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const users = await prisma.user.count();

        return NextResponse.json({
            success: true,
            message: "Database connection successful",
            userCount: users,
        });
    } catch (error) {
        console.error("Database connection error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Database connection failed",
            },
            { status: 500 }
        );
    }
}