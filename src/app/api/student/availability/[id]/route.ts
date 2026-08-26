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

        const availability =
            await prisma.studentAvailability.findFirst({
                where: {
                    id,
                    studentId: student.id,
                },
            });

        if (!availability) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Availability not found",
                },
                { status: 404 }
            );
        }

        await prisma.studentAvailability.delete({
            where: {
                id: availability.id,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Availability deleted successfully",
        });
    } catch (error) {
        console.error("Delete availability error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete availability",
            },
            { status: 500 }
        );
    }
}