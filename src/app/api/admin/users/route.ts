import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole, UserStatus } from "@prisma/client";

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
        const role = searchParams.get("role") || "ALL";
        const status = searchParams.get("status") || "ALL";
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "20", 10);
        const skip = (page - 1) * limit;

        const where: any = {};

        if (query) {
            where.OR = [
                { email: { contains: query, mode: "insensitive" } },
                { phone: { contains: query, mode: "insensitive" } },
            ];
        }

        if (role !== "ALL") {
            where.role = role as UserRole;
        }

        if (status !== "ALL") {
            where.status = status as UserStatus;
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    email: true,
                    phone: true,
                    role: true,
                    status: true,
                    authProvider: true,
                    createdAt: true,
                    updatedAt: true,
                    student: {
                        select: {
                            id: true,
                            grade: true,
                            gender: true,
                        },
                    },
                    parent: {
                        select: {
                            id: true,
                            occupation: true,
                        },
                    },
                    tutor: {
                        select: {
                            id: true,
                            verificationStatus: true,
                            experienceYears: true,
                        },
                    },
                },
            }),
            prisma.user.count({ where }),
        ]);

        return NextResponse.json({
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Fetch users error:", error);
        return NextResponse.json(
            { message: "Failed to retrieve user directory" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized. Admin access required." },
                { status: 403 }
            );
        }

        const adminUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
        });

        const body = await request.json();
        const { userId, status, role } = body;

        if (!userId) {
            return NextResponse.json(
                { message: "User ID is required." },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            return NextResponse.json(
                { message: "User not found." },
                { status: 404 }
            );
        }

        const updateData: any = {};
        if (status) updateData.status = status as UserStatus;
        if (role) updateData.role = role as UserRole;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                role: true,
                status: true,
                updatedAt: true,
            },
        });

        // Record audit log
        await prisma.auditLog.create({
            data: {
                actorId: adminUser?.id,
                action: "USER_UPDATE",
                entity: "User",
                entityId: userId,
                metadata: {
                    previousStatus: existingUser.status,
                    newStatus: updatedUser.status,
                    previousRole: existingUser.role,
                    newRole: updatedUser.role,
                },
            },
        });

        return NextResponse.json({
            message: "User updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Update user error:", error);
        return NextResponse.json(
            { message: "Failed to update user" },
            { status: 500 }
        );
    }
}
