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

        const { action } = body;

        if (
            action !== "START" &&
            action !== "END"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Action must be START or END",
                },
                { status: 400 }
            );
        }

        const tutoringSession =
            await prisma.session.findUnique({
                where: {
                    id,
                },
                include: {
                    booking: true,
                },
            });

        if (!tutoringSession) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Session not found",
                },
                { status: 404 }
            );
        }

        if (
            tutoringSession.booking.tutorId !==
            user.tutor.id
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "You are not authorized to manage this session",
                },
                { status: 403 }
            );
        }

        if (action === "START") {
            if (
                tutoringSession.status !==
                "SCHEDULED"
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Only scheduled sessions can be started",
                    },
                    { status: 400 }
                );
            }

            const updatedSession =
                await prisma.$transaction(
                    async (tx) => {
                        const updated =
                            await tx.session.update({
                                where: {
                                    id,
                                },
                                data: {
                                    status:
                                        "IN_PROGRESS",
                                    startedAt:
                                        new Date(),
                                },
                            });

                        await tx.attendance.upsert({
                            where: {
                                sessionId: id,
                            },
                            update: {
                                joinedAt:
                                    new Date(),
                            },
                            create: {
                                sessionId: id,
                                present: true,
                                joinedAt:
                                    new Date(),
                            },
                        });

                        return updated;
                    }
                );

            return NextResponse.json({
                success: true,
                message:
                    "Session started successfully",
                session: updatedSession,
            });
        }

        if (
            tutoringSession.status !==
            "IN_PROGRESS"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Only active sessions can be ended",
                },
                { status: 400 }
            );
        }

        const updatedSession =
            await prisma.$transaction(
                async (tx) => {
                    const updated =
                        await tx.session.update({
                            where: {
                                id,
                            },
                            data: {
                                status: "COMPLETED",
                                completedAt:
                                    new Date(),
                            },
                        });

                    await tx.attendance.update({
                        where: {
                            sessionId: id,
                        },
                        data: {
                            leftAt:
                                new Date(),
                        },
                    });

                    await tx.booking.update({
                        where: {
                            id: tutoringSession
                                .bookingId,
                        },
                        data: {
                            status: "COMPLETED",
                        },
                    });

                    return updated;
                }
            );

        return NextResponse.json({
            success: true,
            message:
                "Session completed successfully",
            session: updatedSession,
        });
    } catch (error) {
        console.error(
            "Session update error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to update session",
            },
            { status: 500 }
        );
    }
}