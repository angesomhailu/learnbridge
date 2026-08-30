import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const parentRequestSchema = z.object({
    studentId: z.string().min(1, "Student ID is required"),
    tutorId: z.string().min(1, "Tutor ID is required"),
    message: z.string().optional(),
});

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        if (session.user.role !== "PARENT") {
            return NextResponse.json(
                { success: false, message: "Only parents can access parent tutor requests" },
                { status: 403 }
            );
        }

        const parentProfile = await prisma.parentProfile.findUnique({
            where: { userId: session.user.id },
        });

        if (!parentProfile) {
            return NextResponse.json(
                { success: false, message: "Parent profile not found" },
                { status: 404 }
            );
        }

        const requests = await prisma.tutorRequest.findMany({
            where: {
                parentId: parentProfile.id,
            },
            include: {
                student: {
                    select: {
                        id: true,
                        grade: true,
                        user: {
                            select: {
                                email: true,
                            },
                        },
                    },
                },
                tutor: {
                    include: {
                        user: {
                            select: {
                                email: true,
                            },
                        },
                        subjects: {
                            include: {
                                subject: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({
            success: true,
            requests,
        });
    } catch (error) {
        console.error("Get parent requests error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to retrieve parent requests" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        if (session.user.role !== "PARENT") {
            return NextResponse.json(
                { success: false, message: "Only parents can send requests on behalf of children" },
                { status: 403 }
            );
        }

        const parentProfile = await prisma.parentProfile.findUnique({
            where: { userId: session.user.id },
        });

        if (!parentProfile) {
            return NextResponse.json(
                { success: false, message: "Parent profile not found" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const result = parentRequestSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid request data",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { studentId, tutorId, message } = result.data;

        // Verify the student profile is linked to this parent
        const childRelationship = await prisma.parentStudent.findUnique({
            where: {
                parentId_studentId: {
                    parentId: parentProfile.id,
                    studentId,
                },
            },
        });

        if (!childRelationship) {
            return NextResponse.json(
                { success: false, message: "You are not authorized to request a tutor for this student" },
                { status: 403 }
            );
        }

        // Verify tutor exists and is verified
        const tutor = await prisma.tutorProfile.findUnique({
            where: { id: tutorId },
        });

        if (!tutor) {
            return NextResponse.json(
                { success: false, message: "Tutor not found" },
                { status: 404 }
            );
        }

        if (tutor.verificationStatus !== "VERIFIED") {
            return NextResponse.json(
                { success: false, message: "Tutor is not verified" },
                { status: 400 }
            );
        }

        // Check if a request already exists between this student and tutor that is PENDING
        const existingRequest = await prisma.tutorRequest.findFirst({
            where: {
                studentId,
                tutorId,
                status: "PENDING",
            },
        });

        if (existingRequest) {
            return NextResponse.json(
                { success: false, message: "A pending request has already been sent to this tutor for this child" },
                { status: 409 }
            );
        }

        const tutorRequest = await prisma.tutorRequest.create({
            data: {
                parentId: parentProfile.id,
                studentId,
                tutorId,
                message: message || null,
                status: "PENDING",
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Tutoring request sent successfully",
                request: tutorRequest,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create parent tutor request error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to send tutor request" },
            { status: 500 }
        );
    }
}
