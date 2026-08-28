
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

        if (!user || user.role !== "STUDENT") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Student access required",
                },
                { status: 403 }
            );
        }

        if (!user.student) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Student profile not found",
                },
                { status: 404 }
            );
        }

        const body = await request.json();

        const { bookingId } = body;

        if (!bookingId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "bookingId is required",
                },
                { status: 400 }
            );
        }

        const booking = await prisma.booking.findUnique({
            where: {
                id: bookingId,
            },
            include: {
                payment: true,
            },
        });

        if (!booking) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Booking not found",
                },
                { status: 404 }
            );
        }

        if (
            booking.studentId !==
            user.student.id
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "You are not authorized to pay for this booking",
                },
                { status: 403 }
            );
        }

        if (booking.status !== "CONFIRMED") {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Only confirmed bookings can be paid",
                },
                { status: 400 }
            );
        }

        if (booking.payment) {
            return NextResponse.json({
                success: true,
                message:
                    "Payment already exists for this booking",
                payment: booking.payment,
            });
        }

        const payment = await prisma.payment.create({
            data: {
                bookingId: booking.id,
                amount: booking.amount,
                currency: "ETB",
                status: "PENDING",
            },
        });

        return NextResponse.json(
            {
                success: true,
                message:
                    "Payment created successfully",
                payment,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "Create payment error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to create payment",
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

        if (!user || user.role !== "STUDENT") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Student access required",
                },
                { status: 403 }
            );
        }

        if (!user.student) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Student profile not found",
                },
                { status: 404 }
            );
        }

        const payments =
            await prisma.payment.findMany({
                where: {
                    booking: {
                        studentId:
                            user.student.id,
                    },
                },
                include: {
                    booking: {
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
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

        return NextResponse.json({
            success: true,
            payments,
        });
    } catch (error) {
        console.error(
            "Get payments error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to retrieve payments",
            },
            { status: 500 }
        );
    }
}