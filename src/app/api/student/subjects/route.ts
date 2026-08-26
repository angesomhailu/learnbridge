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
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        const student = await prisma.studentProfile.findUnique({
            where: {
                userId: user.id,
            },
        });

        if (!student) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Student profile not found",
                },
                { status: 404 }
            );
        }

        const subjects = await prisma.studentSubject.findMany({
            where: {
                studentId: student.id,
            },
            include: {
                subject: true,
            },
            orderBy: {
                subject: {
                    name: "asc",
                },
            },
        });

        return NextResponse.json({
            success: true,
            subjects,
        });
    } catch (error) {
        console.error("Get student subjects error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve student subjects",
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

        const { subjectId, currentLevel, needsHelp } = body;

        if (!subjectId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "subjectId is required",
                },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        const student = await prisma.studentProfile.findUnique({
            where: {
                userId: user.id,
            },
        });

        if (!student) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Student profile not found",
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

        const existingSubject =
            await prisma.studentSubject.findUnique({
                where: {
                    studentId_subjectId: {
                        studentId: student.id,
                        subjectId,
                    },
                },
            });

        if (existingSubject) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Subject already added",
                },
                { status: 409 }
            );
        }

        const studentSubject =
            await prisma.studentSubject.create({
                data: {
                    studentId: student.id,
                    subjectId,
                    currentLevel: currentLevel || null,
                    needsHelp: needsHelp ?? true,
                },
                include: {
                    subject: true,
                },
            });

        return NextResponse.json(
            {
                success: true,
                message: "Subject added successfully",
                subject: studentSubject,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Add student subject error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to add subject",
            },
            { status: 500 }
        );
    }
}