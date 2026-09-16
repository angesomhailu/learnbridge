import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ReportStatus } from "@/generated/prisma/client";

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

        const where: any = {};

        if (status !== "ALL") {
            where.status = status as ReportStatus;
        }

        const reports = await prisma.report.findMany({
            where,
            include: {
                reporter: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({
            reports,
        });
    } catch (error) {
        console.error("Fetch reports error:", error);
        return NextResponse.json(
            { message: "Failed to fetch safety report tickets" },
            { status: 500 }
        );
    }
}
