import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(
    request: Request,
    { params }: Params
) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized. Admin access required." },
                { status: 403 }
            );
        }

        const adminUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
        });

        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        const booking = await prisma.booking.findUnique({
            where: { id },
        });

        if (!booking) {
            return NextResponse.json(
                { message: "Booking not found" },
                { status: 404 }
            );
        }

        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: {
                status: status as BookingStatus,
            },
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                actorId: adminUser?.id,
                action: "BOOKING_STATUS_UPDATE",
                entity: "Booking",
                entityId: id,
                metadata: {
                    previousStatus: booking.status,
                    newStatus: updatedBooking.status,
                },
            },
        });

        return NextResponse.json({
            message: `Booking status updated to ${status}`,
            booking: updatedBooking,
        });
    } catch (error) {
        console.error("Update booking error:", error);
        return NextResponse.json(
            { message: "Failed to update booking status" },
            { status: 500 }
        );
    }
}
