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

        const user =
            await prisma.user.findUnique({
                where: {
                    email: session.user.email,
                },
                include: {
                    student: true,
                },
            });

        if (
            !user ||
            user.role !== "STUDENT"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Student access required",
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

        const sessions =
            await prisma.session.findMany({
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

                    attendance: true,
                },

                orderBy: {
                    booking: {
                        startTime: "asc",
                    },
                },
            });

        return NextResponse.json({
            success: true,
            sessions,
        });
    } catch (error) {
        console.error(
            "Student sessions error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to retrieve sessions",
            },
            { status: 500 }
        );
    }
}