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

        const goals = await prisma.learningGoal.findMany({
            where: {
                studentId: student.id,
            },
            orderBy: {
                priority: "asc",
            },
        });

        return NextResponse.json({
            success: true,
            goals,
        });
    } catch (error) {
        console.error("Get learning goals error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve learning goals",
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

        const title = body.title?.trim();
        const description = body.description?.trim();
        const priority = Number(body.priority ?? 1);

        if (!title) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Goal title is required",
                },
                { status: 400 }
            );
        }

        if (priority < 1 || priority > 5) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Priority must be between 1 and 5",
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

        const goal = await prisma.learningGoal.create({
            data: {
                studentId: student.id,
                title,
                description: description || null,
                priority,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Learning goal created successfully",
                goal,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create learning goal error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create learning goal",
            },
            { status: 500 }
        );
    }
}