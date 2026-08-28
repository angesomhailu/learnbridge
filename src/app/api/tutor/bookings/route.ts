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

        const bookings = await prisma.booking.findMany({
            where: {
                tutorId: user.tutor.id,
            },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                email: true,
                            },
                        },
                    },
                },
                request: {
                    select: {
                        id: true,
                        message: true,
                        status: true,
                    },
                },
                session: true,
                payment: true,
            },
            orderBy: {
                startTime: "asc",
            },
        });

        return NextResponse.json({
            success: true,
            bookings,
        });
    } catch (error) {
        console.error(
            "Tutor bookings error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve bookings",
            },
            { status: 500 }
        );
    }
}