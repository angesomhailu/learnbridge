import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
            include: {
                student: true,
            },
        });

        if (!user || user.role !== "STUDENT" || !user.student) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Student profile not found",
                },
                { status: 404 }
            );
        }

        const body = await request.json();

        const {
            requestId,
            startTime,
            endTime,
        } = body;

        if (!requestId || !startTime || !endTime) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "requestId, startTime and endTime are required",
                },
                { status: 400 }
            );
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime())
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid date or time",
                },
                { status: 400 }
            );
        }

        if (start >= end) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "End time must be after start time",
                },
                { status: 400 }
            );
        }

        if (start < new Date()) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "You cannot book a session in the past",
                },
                { status: 400 }
            );
        }

        // Find the accepted tutor request
        const tutorRequest =
            await prisma.tutorRequest.findFirst({
                where: {
                    id: requestId,
                    studentId: user.student.id,
                    status: "ACCEPTED",
                },
                include: {
                    tutor: true,
                },
            });

        if (!tutorRequest) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Accepted tutor request not found",
                },
                { status: 404 }
            );
        }

        // Check tutor availability
        const dayOfWeek = start.getDay();

        const availability =
            await prisma.tutorAvailability.findFirst({
                where: {
                    tutorId: tutorRequest.tutorId,
                    dayOfWeek,
                },
            });

        if (!availability) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Tutor is not available on this day",
                },
                { status: 400 }
            );
        }

        // Convert booking times into minutes
        const startMinutes =
            start.getHours() * 60 +
            start.getMinutes();

        const endMinutes =
            end.getHours() * 60 +
            end.getMinutes();

        const [availableStartHour, availableStartMinute] =
            availability.startTime
                .split(":")
                .map(Number);

        const [availableEndHour, availableEndMinute] =
            availability.endTime
                .split(":")
                .map(Number);

        const availableStart =
            availableStartHour * 60 +
            availableStartMinute;

        const availableEnd =
            availableEndHour * 60 +
            availableEndMinute;

        if (
            startMinutes < availableStart ||
            endMinutes > availableEnd
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Selected time is outside tutor availability",
                },
                { status: 400 }
            );
        }

        // Check tutor double booking
        const tutorConflict =
            await prisma.booking.findFirst({
                where: {
                    tutorId: tutorRequest.tutorId,

                    status: {
                        in: [
                            "PENDING",
                            "CONFIRMED",
                        ],
                    },

                    startTime: {
                        lt: end,
                    },

                    endTime: {
                        gt: start,
                    },
                },
            });

        if (tutorConflict) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Tutor already has a booking during this time",
                },
                { status: 409 }
            );
        }

        // Check student's double booking
        const studentConflict =
            await prisma.booking.findFirst({
                where: {
                    studentId: user.student.id,

                    status: {
                        in: [
                            "PENDING",
                            "CONFIRMED",
                        ],
                    },

                    startTime: {
                        lt: end,
                    },

                    endTime: {
                        gt: start,
                    },
                },
            });

        if (studentConflict) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "You already have a booking during this time",
                },
                { status: 409 }
            );
        }

        // Create booking + session
        const booking =
            await prisma.booking.create({
                data: {
                    requestId: tutorRequest.id,

                    studentId: user.student.id,

                    tutorId: tutorRequest.tutorId,

                    startTime: start,

                    endTime: end,

                    status: "PENDING",

                    session: {
                        create: {
                            status: "SCHEDULED",
                        },
                    },
                },

                include: {
                    session: true,
                    tutor: {
                        include: {
                            user: {
                                select: {
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });

        return NextResponse.json(
            {
                success: true,
                message:
                    "Booking created successfully",
                booking,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "Create booking error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to create booking",
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
            include: {
                student: true,
            },
        });

        if (!user?.student) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Student profile not found",
                },
                { status: 404 }
            );
        }

        const bookings =
            await prisma.booking.findMany({
                where: {
                    studentId: user.student.id,
                },

                orderBy: {
                    startTime: "asc",
                },

                include: {
                    tutor: {
                        include: {
                            user: {
                                select: {
                                    email: true,
                                },
                            },
                        },
                    },

                    request: true,

                    session: true,

                    payment: true,
                },
            });

        return NextResponse.json({
            success: true,
            bookings,
        });
    } catch (error) {
        console.error(
            "Get bookings error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to retrieve bookings",
            },
            { status: 500 }
        );
    }
}