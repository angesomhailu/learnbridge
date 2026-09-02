
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
                student: true,
            },
        });

        if (!user?.student) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Student profile not found",
                },
                { status: 404 }
            );
        }

        const reviews = await prisma.review.findMany({
            where: {
                studentId: user.student.id,
            },
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
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({
            success: true,
            reviews,
        });
    } catch (error) {
        console.error("Get student reviews error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve reviews",
            },
            { status: 500 }
        );
    }
}

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

        const body = await request.json();

        const {
            tutorId,
            rating,
            comment,
        } = body;

        if (!tutorId || !rating) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Tutor and rating are required",
                },
                { status: 400 }
            );
        }

        const numericRating = Number(rating);

        if (
            !Number.isInteger(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Rating must be between 1 and 5",
                },
                { status: 400 }
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

        const tutor = await prisma.tutorProfile.findUnique({
            where: {
                id: tutorId,
            },
        });

        if (!tutor) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Tutor not found",
                },
                { status: 404 }
            );
        }

        // Check whether the student completed
        // at least one session with this tutor
        const completedSession =
            await prisma.session.findFirst({
                where: {
                    status: "COMPLETED",

                    booking: {
                        studentId: user.student.id,
                        tutorId,
                    },
                },
            });

        if (!completedSession) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "You can only review a tutor after completing a session",
                },
                { status: 403 }
            );
        }

        // Prevent duplicate review
        const existingReview =
            await prisma.review.findFirst({
                where: {
                    tutorId,
                    studentId: user.student.id,
                },
            });

        if (existingReview) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "You have already reviewed this tutor",
                },
                { status: 409 }
            );
        }

        const review =
            await prisma.review.create({
                data: {
                    tutorId,

                    studentId:
                        user.student.id,

                    authorId: user.id,

                    rating: numericRating,

                    comment:
                        comment?.trim() || null,

                    status: "PENDING",
                },
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
            });

        return NextResponse.json(
            {
                success: true,
                message:
                    "Review submitted successfully",
                review,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "Create review error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to create review",
            },
            { status: 500 }
        );
    }
}
