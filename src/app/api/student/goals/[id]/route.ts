import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    request: Request,
    context: {
        params: Promise<{ id: string }>;
    }
) {
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

        const { id } = await context.params;

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

        const goal = await prisma.learningGoal.findFirst({
            where: {
                id,
                studentId: student.id,
            },
        });

        if (!goal) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Learning goal not found",
                },
                { status: 404 }
            );
        }

        await prisma.learningGoal.delete({
            where: {
                id: goal.id,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Learning goal deleted successfully",
        });
    } catch (error) {
        console.error("Delete learning goal error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete learning goal",
            },
            { status: 500 }
        );
    }
}