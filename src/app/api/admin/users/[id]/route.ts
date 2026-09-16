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

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized. Admin access required." },
                { status: 403 }
            );
        }

        const adminUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
        });

        const { id } = await params;

        const targetUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!targetUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Prevent self-deletion
        if (adminUser?.id === id) {
            return NextResponse.json(
                { message: "You cannot delete your own admin account." },
                { status: 400 }
            );
        }

        await prisma.user.delete({
            where: { id },
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                actorId: adminUser?.id,
                action: "USER_DELETE",
                entity: "User",
                entityId: id,
                metadata: {
                    deletedUserEmail: targetUser.email,
                    deletedUserRole: targetUser.role,
                },
            },
        });

        return NextResponse.json({
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Delete user error:", error);
        return NextResponse.json(
            { message: "Failed to delete user account" },
            { status: 500 }
        );
    }
}
