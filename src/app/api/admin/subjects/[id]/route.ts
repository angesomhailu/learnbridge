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
        const body = await request.json();
        const { name, description } = body;

        const existingSubject = await prisma.subject.findUnique({
            where: { id },
        });

        if (!existingSubject) {
            return NextResponse.json(
                { message: "Subject not found." },
                { status: 404 }
            );
        }

        const updateData: any = {};
        if (name && typeof name === "string") updateData.name = name.trim();
        if (description !== undefined) updateData.description = description?.trim() || null;

        const updatedSubject = await prisma.subject.update({
            where: { id },
            data: updateData,
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                actorId: adminUser?.id,
                action: "SUBJECT_UPDATE",
                entity: "Subject",
                entityId: id,
                metadata: {
                    previousName: existingSubject.name,
                    newName: updatedSubject.name,
                },
            },
        });

        return NextResponse.json({
            message: "Subject updated successfully",
            subject: updatedSubject,
        });
    } catch (error) {
        console.error("Update subject error:", error);
        return NextResponse.json(
            { message: "Failed to update subject" },
            { status: 500 }
        );
    }
}

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

        const existingSubject = await prisma.subject.findUnique({
            where: { id },
        });

        if (!existingSubject) {
            return NextResponse.json(
                { message: "Subject not found" },
                { status: 404 }
            );
        }

        await prisma.subject.delete({
            where: { id },
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                actorId: adminUser?.id,
                action: "SUBJECT_DELETE",
                entity: "Subject",
                entityId: id,
                metadata: {
                    subjectName: existingSubject.name,
                },
            },
        });

        return NextResponse.json({
            message: "Subject deleted successfully",
        });
    } catch (error) {
        console.error("Delete subject error:", error);
        return NextResponse.json(
            { message: "Failed to delete subject" },
            { status: 500 }
        );
    }
}
