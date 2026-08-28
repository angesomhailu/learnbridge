import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
    request: Request
) {
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

        const user =
            await prisma.user.findUnique({
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

        const body = await request.json();

        const {
            tutorId,
            message,
        } = body;

        if (!tutorId) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Tutor ID is required",
                },
                { status: 400 }
            );
        }

        const tutor =
            await prisma.tutorProfile.findUnique({
                where: {
                    id: tutorId,
                },
            });

        if (!tutor) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Tutor not found",
                },
                { status: 404 }
            );
        }

        if (
            tutor.verificationStatus !==
            "VERIFIED"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Tutor is not verified",
                },
                { status: 400 }
            );
        }

        const existingRequest =
            await prisma.tutorRequest.findFirst({
                where: {
                    studentId:
                        user.student.id,

                    tutorId,

                    status: "PENDING",
                },
            });

        if (existingRequest) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "You already have a pending request with this tutor",
                },
                { status: 409 }
            );
        }

        const tutorRequest =
            await prisma.tutorRequest.create({
                data: {
                    studentId:
                        user.student.id,

                    tutorId,

                    message:
                        message || null,

                    status: "PENDING",
                },
            });

        return NextResponse.json(
            {
                success: true,
                message:
                    "Tutor request sent successfully",
                request: tutorRequest,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "Create tutor request error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to send tutor request",
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
                    message:
                        "Authentication required",
                },
                { status: 401 }
            );
        }

        const student =
            await prisma.studentProfile.findFirst({
                where: {
                    user: {
                        email:
                            session.user.email,
                    },
                },
            });

        if (!student) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Student profile not found",
                },
                { status: 404 }
            );
        }

        const requests =
            await prisma.tutorRequest.findMany({
                where: {
                    studentId: student.id,
                },

                include: {
                    tutor: {
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
            "Get student requests error:",
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