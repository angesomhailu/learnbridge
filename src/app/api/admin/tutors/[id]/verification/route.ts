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
                    message: "Authentication required",
                },
                { status: 401 }
            );
        }

        const admin = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
        });

        if (!admin || admin.role !== "ADMIN") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Admin access required",
                },
                { status: 403 }
            );
        }

        const { id } = await params;

        const body = await request.json();

        const {
            verificationStatus,
        } = body;

        const allowedStatuses = [
            "VERIFIED",
            "REJECTED",
            "RESUBMISSION_REQUIRED",
        ];

        if (
            !allowedStatuses.includes(
                verificationStatus
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid verification status",
                },
                { status: 400 }
            );
        }

        const tutor =
            await prisma.tutorProfile.findUnique({
                where: {
                    id,
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

        const updatedTutor =
            await prisma.tutorProfile.update({
                where: {
                    id,
                },
                data: {
                    verificationStatus,
                    verifiedAt:
                        verificationStatus === "VERIFIED"
                            ? new Date()
                            : null,
                },
            });

        return NextResponse.json({
            success: true,
            message: `Tutor ${verificationStatus.toLowerCase()} successfully`,
            tutor: updatedTutor,
        });
    } catch (error) {
        console.error(
            "Tutor verification error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update tutor verification",
            },
            { status: 500 }
        );
    }
}