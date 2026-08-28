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

        const notes =
            typeof body.notes === "string"
                ? body.notes.trim()
                : "";

        if (!notes) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Notes cannot be empty",
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
                        "You are not authorized to update this session",
                },
                { status: 403 }
            );
        }

        const updatedSession =
            await prisma.session.update({
                where: {
                    id,
                },
                data: {
                    notes,
                },
            });

        return NextResponse.json({
            success: true,
            message: "Session notes saved",
            session: updatedSession,
        });
    } catch (error) {
        console.error(
            "Session notes error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to save session notes",
            },
            { status: 500 }
        );
    }
}