import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized. Admin access required." },
                { status: 403 }
            );
        }

        const subjects = await prisma.subject.findMany({
            include: {
                _count: {
                    select: {
                        tutors: true,
                        students: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json({
            subjects,
        });
    } catch (error) {
        console.error("Fetch subjects error:", error);
        return NextResponse.json(
            { message: "Failed to fetch subjects catalog" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
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
        const { name, description } = body;

        if (!name || typeof name !== "string" || !name.trim()) {
            return NextResponse.json(
                { message: "Subject name is required." },
                { status: 400 }
            );
        }

        const existingSubject = await prisma.subject.findUnique({
            where: { name: name.trim() },
        });

        if (existingSubject) {
            return NextResponse.json(
                { message: "A subject with this name already exists." },
                { status: 400 }
            );
        }

        const subject = await prisma.subject.create({
            data: {
                name: name.trim(),
                description: description?.trim() || null,
            },
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                actorId: adminUser?.id,
                action: "SUBJECT_CREATE",
                entity: "Subject",
                entityId: subject.id,
                metadata: {
                    subjectName: subject.name,
                },
            },
        });

        return NextResponse.json({
            message: "Subject created successfully",
            subject,
        });
    } catch (error) {
        console.error("Create subject error:", error);
        return NextResponse.json(
            { message: "Failed to create subject" },
            { status: 500 }
        );
    }
}
