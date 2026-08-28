import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function DELETE(
    request: Request,
    { params }: Params
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

        const { id } = await params;

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

        const tutorSubject =
            await prisma.tutorSubject.findFirst({
                where: {
                    id,
                    tutorId: user.tutor.id,
                },
            });

        if (!tutorSubject) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Subject not found",
                },
                { status: 404 }
            );
        }

        await prisma.tutorSubject.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Subject removed successfully",
        });
    } catch (error) {
        console.error(
            "Delete tutor subject error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to remove subject",
            },
            { status: 500 }
        );
    }
}