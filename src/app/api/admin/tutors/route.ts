import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { VerificationStatus } from "@/generated/prisma/client";

export async function GET(request: Request) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized. Admin access required." },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "ALL";
        const query = searchParams.get("query") || "";

        const where: any = {};

        if (status !== "ALL") {
            where.verificationStatus = status as VerificationStatus;
        }

        if (query) {
            where.user = {
                OR: [
                    { email: { contains: query, mode: "insensitive" } },
                    { phone: { contains: query, mode: "insensitive" } },
                ],
            };
        }

        const tutors = await prisma.tutorProfile.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        phone: true,
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
                pricing: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({
            tutors,
        });
    } catch (error) {
        console.error("Fetch tutors error:", error);
        return NextResponse.json(
            { message: "Failed to fetch tutor profiles" },
            { status: 500 }
        );
    }
}
