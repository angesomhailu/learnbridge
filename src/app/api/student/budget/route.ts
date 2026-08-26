import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const student = await prisma.studentProfile.findUnique({
            where: { userId: user.id },
        });

        if (!student) {
            return NextResponse.json(
                { success: false, message: "Student profile not found" },
                { status: 404 }
            );
        }

        const budget = await prisma.budget.findUnique({
            where: { studentId: student.id },
        });

        return NextResponse.json({
            success: true,
            budget,
        });
    } catch (error) {
        console.error("Get student budget error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve budget",
            },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        const body = await request.json();

        const maxAmount = Number(body.maxAmount);
        const currency = body.currency?.trim() || "ETB";
        const period = body.period?.trim() || null;
        const isFlexible = Boolean(body.isFlexible);

        if (!Number.isFinite(maxAmount) || maxAmount <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Budget amount must be greater than 0",
                },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const student = await prisma.studentProfile.findUnique({
            where: { userId: user.id },
        });

        if (!student) {
            return NextResponse.json(
                { success: false, message: "Student profile not found" },
                { status: 404 }
            );
        }

        const budget = await prisma.budget.upsert({
            where: {
                studentId: student.id,
            },
            update: {
                maxAmount,
                currency,
                period,
                isFlexible,
            },
            create: {
                studentId: student.id,
                maxAmount,
                currency,
                period,
                isFlexible,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Budget saved successfully",
            budget,
        });
    } catch (error) {
        console.error("Save student budget error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to save budget",
            },
            { status: 500 }
        );
    }
}