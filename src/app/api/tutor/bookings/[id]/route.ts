import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(
    request: Request,
    context: RouteContext
) {
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
                tutor: true,
            },
        });

        if (!user || user.role !== "TUTOR") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Tutor access required",
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

        const { id } = await context.params;

        const body = await request.json();

        const { status } = body;

        if (
            status !== "CONFIRMED" &&
            status !== "CANCELLED"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid booking status",
                },
                { status: 400 }
            );
        }

        const booking =
            await prisma.booking.findUnique({
                where: {
                    id,
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
            booking.tutorId !== user.tutor.id
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "You are not authorized to modify this booking",
                },
                { status: 403 }
            );
        }

        if (booking.status !== "PENDING") {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Only pending bookings can be modified",
                },
                { status: 400 }
            );
        }

        const updatedBooking =
            await prisma.$transaction(async (tx) => {
                const updated =
                    await tx.booking.update({
                        where: {
                            id,
                        },
                        data: {
                            status,
                        },
                    });

                if (status === "CONFIRMED") {
                    await tx.session.upsert({
                        where: {
                            bookingId: id,
                        },
                        update: {},
                        create: {
                            bookingId: id,
                            status: "SCHEDULED",
                        },
                    });
                }

                return updated;
            });

        return NextResponse.json({
            success: true,
            message:
                status === "CONFIRMED"
                    ? "Booking confirmed successfully"
                    : "Booking cancelled successfully",
            booking: updatedBooking,
        });
    } catch (error) {
        console.error(
            "Update booking error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to update booking",
            },
            { status: 500 }
        );
    }
}