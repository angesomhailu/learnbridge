import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authentication required",
                },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
            include: {
                tutor: {
                    include: {
                        pricing: {
                            orderBy: {
                                durationMinutes: "asc",
                            },
                        },
                    },
                },
            },
        });

        if (!user || user.role !== "TUTOR") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Tutor account required",
                },
                { status: 403 }
            );
        }

        if (!user.tutor) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Tutor profile not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            pricing: user.tutor.pricing,
        });
    } catch (error) {
        console.error("Get tutor pricing error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve pricing",
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authentication required",
                },
                { status: 401 }
            );
        }

        const body = await request.json();

        const {
            amount,
            currency,
            durationMinutes,
        } = body;

        const numericAmount = Number(amount);
        const numericDuration = Number(durationMinutes);

        if (
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Amount must be greater than 0",
                },
                { status: 400 }
            );
        }

        if (
            !Number.isInteger(numericDuration) ||
            numericDuration <= 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Duration must be a positive number",
                },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
            include: {
                tutor: true,
            },
        });

        if (!user || user.role !== "TUTOR") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Tutor account required",
                },
                { status: 403 }
            );
        }

        if (!user.tutor) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Tutor profile not found",
                },
                { status: 404 }
            );
        }

        const pricing = await prisma.tutorPricing.create({
            data: {
                tutorId: user.tutor.id,
                amount: numericAmount,
                currency: currency || "ETB",
                durationMinutes: numericDuration,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Pricing added successfully",
            pricing,
        });
    } catch (error) {
        console.error("Add tutor pricing error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to add pricing",
            },
            { status: 500 }
        );
    }
}