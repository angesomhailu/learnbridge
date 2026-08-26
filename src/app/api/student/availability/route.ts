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
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        const student = await prisma.studentProfile.findUnique({
            where: {
                userId: user.id,
            },
        });

        if (!student) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Student profile not found",
                },
                { status: 404 }
            );
        }

        const availability =
            await prisma.studentAvailability.findMany({
                where: {
                    studentId: student.id,
                },
                orderBy: [
                    {
                        dayOfWeek: "asc",
                    },
                    {
                        startTime: "asc",
                    },
                ],
            });

        return NextResponse.json({
            success: true,
            availability,
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

        const dayOfWeek = Number(body.dayOfWeek);
        const startTime = body.startTime?.trim();
        const endTime = body.endTime?.trim();

        if (
            !Number.isInteger(dayOfWeek) ||
            dayOfWeek < 0 ||
            dayOfWeek > 6
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid day of week",
                },
                { status: 400 }
            );
        }

        if (!startTime || !endTime) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Start time and end time are required",
                },
                { status: 400 }
            );
        }

        if (startTime >= endTime) {
            return NextResponse.json(
                {
                    success: false,
                    message: "End time must be after start time",
                },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        const student = await prisma.studentProfile.findUnique({
            where: {
                userId: user.id,
            },
        });

        if (!student) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Student profile not found",
                },
                { status: 404 }
            );
        }

        const availability =
            await prisma.studentAvailability.create({
                data: {
                    studentId: student.id,
                    dayOfWeek,
                    startTime,
                    endTime,
                },
            });

        return NextResponse.json(
            {
                success: true,
                message: "Availability added successfully",
                availability,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create availability error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to add availability",
            },
            { status: 500 }
        );
    }
}