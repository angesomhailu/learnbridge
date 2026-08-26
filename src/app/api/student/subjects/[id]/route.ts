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

        if (!session?.user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authentication required",
                },
                { status: 401 }
            );
        }

        if (session.user.role !== "STUDENT") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Only students can remove subjects",
                },
                { status: 403 }
            );
        }

        const { id } = await context.params;

        const student = await prisma.studentProfile.findUnique({
            where: {
                userId: session.user.id,
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

        const studentSubject = await prisma.studentSubject.findFirst({
            where: {
                id,
                studentId: student.id,
            },
        });

        if (!studentSubject) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Subject not found",
                },
                { status: 404 }
            );
        }

        await prisma.studentSubject.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Subject removed successfully",
        });
    } catch (error) {
        console.error("Delete student subject error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to remove subject",
            },
            { status: 500 }
        );
    }
}