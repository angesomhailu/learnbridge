import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@/generated/prisma/client";

export async function GET(request: Request) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized. Admin access required." },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "ALL";
        const query = searchParams.get("query") || "";

        const where: any = {};

        if (status !== "ALL") {
            where.status = status as BookingStatus;
        }

        if (query) {
            where.OR = [
                { id: { contains: query, mode: "insensitive" } },
                {
                    student: {
                        user: { email: { contains: query, mode: "insensitive" } },
                    },
                },
                {
                    tutor: {
                        user: { email: { contains: query, mode: "insensitive" } },
                    },
                },
            ];
        }

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
                tutor: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
                request: {
                    select: {
                        message: true,
                    },
                },
                session: true,
                payment: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({
            bookings,
        });
    } catch (error) {
        console.error("Fetch bookings error:", error);
        return NextResponse.json(
            { message: "Failed to fetch bookings audit" },
            { status: 500 }
        );
    }
}
