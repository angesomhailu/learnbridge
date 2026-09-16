import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
        const query = searchParams.get("query") || "";
        const entity = searchParams.get("entity") || "ALL";

        const where: any = {};

        if (entity !== "ALL") {
            where.entity = entity;
        }

        if (query) {
            where.OR = [
                { action: { contains: query, mode: "insensitive" } },
                { entity: { contains: query, mode: "insensitive" } },
                {
                    actor: {
                        email: { contains: query, mode: "insensitive" },
                    },
                },
            ];
        }

        const auditLogs = await prisma.auditLog.findMany({
            where,
            include: {
                actor: {
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
            take: 100,
        });

        return NextResponse.json({
            auditLogs,
        });
    } catch (error) {
        console.error("Fetch audit logs error:", error);
        return NextResponse.json(
            { message: "Failed to fetch audit logs stream" },
            { status: 500 }
        );
    }
}
