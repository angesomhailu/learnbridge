import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const validDays = [0, 1, 2, 3, 4, 5, 6];

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
                        availability: {
                            orderBy: [
                                {
                                    dayOfWeek: "asc",
                                },
                                {
                                    startTime: "asc",
                                },
                            ],
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
            availability: user.tutor.availability,
        });
    } catch (error) {
        console.error("Get availability error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve availability",
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
            dayOfWeek,
            startTime,
            endTime,
        } = body;

        const day = Number(dayOfWeek);

        if (!Number.isInteger(day) || !validDays.includes(day)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid day of week",
                },
                { status: 400 }
            );
        }

        if (
            typeof startTime !== "string" ||
            typeof endTime !== "string"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Start time and end time are required",
                },
                { status: 400 }
            );
        }

        const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

        if (
            !timeRegex.test(startTime) ||
            !timeRegex.test(endTime)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Time must use HH:MM format",
                },
                { status: 400 }
            );
        }

        if (startTime >= endTime) {
            return NextResponse.json(
                {
                    success: false,
                    message: "End time must be later than start time",
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

        const availability =
            await prisma.tutorAvailability.create({
                data: {
                    tutorId: user.tutor.id,
                    dayOfWeek: day,
                    startTime,
                    endTime,
                },
            });

        return NextResponse.json({
            success: true,
            message: "Availability added successfully",
            availability,
        });
    } catch (error) {
        console.error("Add availability error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to add availability",
            },
            { status: 500 }
        );
    }
}