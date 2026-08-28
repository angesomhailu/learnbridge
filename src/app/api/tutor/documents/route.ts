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
            include: {
                tutor: {
                    include: {
                        documents: {
                            orderBy: {
                                uploadedAt: "desc",
                            },
                        },
                    },
                },
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
                    message: "Please create your tutor profile first",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            documents: user.tutor.documents,
        });
    } catch (error) {
        console.error("Get tutor documents error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve documents",
            },
            { status: 500 }
        );
    }
}