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
                    message:
                        "Authentication required",
                },
                { status: 401 }
            );
        }

        const tutor =
            await prisma.tutorProfile.findFirst({
                where: {
                    user: {
                        email:
                            session.user.email,
                    },
                },
            });

        if (!tutor) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Tutor profile not found",
                },
                { status: 404 }
            );
        }

        const requests =
            await prisma.tutorRequest.findMany({
                where: {
                    tutorId: tutor.id,
                },

                include: {
                    student: {
                        include: {
                            user: {
                                select: {
                                    email: true,
                                },
                            },

                            subjects: {
                                include: {
                                    subject: true,
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
            requests,
        });
    } catch (error) {
        console.error(
            "Get tutor requests error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to retrieve tutor requests",
            },
            { status: 500 }
        );
    }
}