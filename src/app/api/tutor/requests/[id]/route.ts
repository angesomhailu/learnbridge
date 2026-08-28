import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(
    request: Request,
    { params }: Params
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

        const tutor =
            await prisma.tutorProfile.findFirst({
                where: {
                    user: {
                        email:
                            session.user.email,
                    },
                },
            });

        if (!tutor) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Tutor profile not found",
                },
                { status: 404 }
            );
        }

        const { id } = await params;

        const body = await request.json();

        const { status } = body;

        if (
            status !== "ACCEPTED" &&
            status !== "REJECTED"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Status must be ACCEPTED or REJECTED",
                },
                { status: 400 }
            );
        }

        const tutorRequest =
            await prisma.tutorRequest.findFirst({
                where: {
                    id,
                    tutorId: tutor.id,
                },
            });

        if (!tutorRequest) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Tutor request not found",
                },
                { status: 404 }
            );
        }

        if (
            tutorRequest.status !==
            "PENDING"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "This request has already been processed",
                },
                { status: 400 }
            );
        }

        const updatedRequest =
            await prisma.tutorRequest.update({
                where: {
                    id,
                },

                data: {
                    status,
                },
            });

        return NextResponse.json({
            success: true,
            message:
                `Tutor request ${status.toLowerCase()} successfully`,
            request: updatedRequest,
        });
    } catch (error) {
        console.error(
            "Update tutor request error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to update tutor request",
            },
            { status: 500 }
        );
    }
}