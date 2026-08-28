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
                    message: "Authentication required",
                },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
            include: {
                tutor: {
                    include: {
                        subjects: {
                            include: {
                                subject: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user || user.role !== "TUTOR") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Tutor account required",
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

        return NextResponse.json({
            success: true,
            subjects: user.tutor.subjects,
        });
    } catch (error) {
        console.error("Get tutor subjects error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve tutor subjects",
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
                    message: "Authentication required",
                },
                { status: 401 }
            );
        }

        const body = await request.json();

        const {
            subjectId,
            proficiencyLevel,
            gradeLevels,
        } = body;

        if (!subjectId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Subject is required",
                },
                { status: 400 }
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
                    message: "Tutor account required",
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

        const subject = await prisma.subject.findUnique({
            where: {
                id: subjectId,
            },
        });

        if (!subject) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Subject not found",
                },
                { status: 404 }
            );
        }

        const existing = await prisma.tutorSubject.findUnique({
            where: {
                tutorId_subjectId: {
                    tutorId: user.tutor.id,
                    subjectId,
                },
            },
        });

        if (existing) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You already added this subject",
                },
                { status: 409 }
            );
        }

        const tutorSubject = await prisma.tutorSubject.create({
            data: {
                tutorId: user.tutor.id,
                subjectId,
                proficiencyLevel:
                    proficiencyLevel || null,
                gradeLevels: Array.isArray(gradeLevels)
                    ? gradeLevels
                    : [],
            },
            include: {
                subject: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Subject added successfully",
            subject: tutorSubject,
        });
    } catch (error) {
        console.error("Add tutor subject error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to add tutor subject",
            },
            { status: 500 }
        );
    }
}