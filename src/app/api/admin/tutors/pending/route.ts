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

        const tutors =
            await prisma.tutorProfile.findMany({
                where: {
                    verificationStatus: "PENDING",
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            status: true,
                            createdAt: true,
                        },
                    },

                    educationRecords: true,

                    documents: true,

                    subjects: {
                        include: {
                            subject: true,
                        },
                    },
                },

                orderBy: {
                    createdAt: "asc",
                },
            });

        return NextResponse.json({
            success: true,
            tutors,
        });
    } catch (error) {
        console.error(
            "Get pending tutors error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve pending tutors",
            },
            { status: 500 }
        );
    }
}