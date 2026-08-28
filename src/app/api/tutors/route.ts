import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } =
            new URL(request.url);

        const subject =
            searchParams.get("subject");

        const tutors =
            await prisma.tutorProfile.findMany({
                where: {
                    verificationStatus: "VERIFIED",

                    user: {
                        status: "ACTIVE",
                    },

                    ...(subject
                        ? {
                            subjects: {
                                some: {
                                    subject: {
                                        name: {
                                            equals:
                                                subject,
                                            mode: "insensitive",
                                        },
                                    },
                                },
                            },
                        }
                        : {}),
                },

                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },

                    educationRecords: true,

                    subjects: {
                        include: {
                            subject: true,
                        },
                    },

                    pricing: true,

                    availability: true,
                },

                orderBy: {
                    createdAt: "desc",
                },
            });

        return NextResponse.json({
            success: true,
            tutors,
        });
    } catch (error) {
        console.error(
            "Get tutors error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to retrieve tutors",
            },
            { status: 500 }
        );
    }
}