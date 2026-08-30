import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const reviewSchema = z.object({
    tutorId: z.string().min(1, "Tutor ID is required"),
    studentId: z.string().min(1, "Student ID is required"),
    rating: z.coerce.number().int().min(1).max(5, "Rating must be between 1 and 5"),
    comment: z.string().optional().nullable(),
});

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const result = reviewSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid review input",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { tutorId, studentId, rating, comment } = result.data;

        // Verify that current user is authorized to review for this studentId
        let isAuthorized = false;

        if (session.user.role === "STUDENT") {
            const studentProfile = await prisma.studentProfile.findUnique({
                where: { userId: session.user.id },
            });
            if (studentProfile && studentProfile.id === studentId) {
                isAuthorized = true;
            }
        } else if (session.user.role === "PARENT") {
            const parentProfile = await prisma.parentProfile.findUnique({
                where: { userId: session.user.id },
            });
            if (parentProfile) {
                const relation = await prisma.parentStudent.findUnique({
                    where: {
                        parentId_studentId: {
                            parentId: parentProfile.id,
                            studentId,
                        },
                    },
                });
                if (relation) {
                    isAuthorized = true;
                }
            }
        }

        if (!isAuthorized) {
            return NextResponse.json(
                { success: false, message: "You are not authorized to write reviews for this student profile" },
                { status: 403 }
            );
        }

        // Verify tutor exists
        const tutor = await prisma.tutorProfile.findUnique({
            where: { id: tutorId },
        });

        if (!tutor) {
            return NextResponse.json(
                { success: false, message: "Tutor not found" },
                { status: 404 }
            );
        }

        // Enforce completed booking check: must have at least one COMPLETED booking with the tutor
        const completedBooking = await prisma.booking.findFirst({
            where: {
                studentId,
                tutorId,
                status: "COMPLETED",
            },
        });

        if (!completedBooking) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You can only review a tutor after completing at least one scheduled class session with them.",
                },
                { status: 400 }
            );
        }

        // Create review and publish it directly
        const review = await prisma.review.create({
            data: {
                tutorId,
                studentId,
                authorId: session.user.id,
                rating,
                comment: comment || null,
                status: "PUBLISHED", // Auto-publish for direct testing feedback
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Review submitted and published successfully",
                review,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create review error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to submit review" },
            { status: 500 }
        );
    }
}
