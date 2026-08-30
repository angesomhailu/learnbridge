import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateAge } from "@/lib/utils/age";
import { appConfig } from "@/lib/config";

const updateChildSchema = z.object({
    dateOfBirth: z.coerce.date().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
    grade: z.string().optional(),
    schoolName: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    learningNeeds: z.string().optional().nullable(),
    languages: z.array(z.string()).optional(),
    budget: z
        .object({
            maxAmount: z.coerce.number().positive(),
            currency: z.string().default("ETB"),
            period: z.enum(["PER_SESSION", "WEEKLY", "MONTHLY"]).default("WEEKLY"),
            isFlexible: z.boolean().default(false),
        })
        .optional(),
});

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

        if (!session?.user) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        if (session.user.role !== "PARENT") {
            return NextResponse.json(
                { success: false, message: "Only parents can update child profiles" },
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

        const { id: childStudentId } = await params;

        // Verify parent child relationship
        const relationship = await prisma.parentStudent.findUnique({
            where: {
                parentId_studentId: {
                    parentId: parentProfile.id,
                    studentId: childStudentId,
                },
            },
        });

        if (!relationship) {
            return NextResponse.json(
                { success: false, message: "You are not authorized to manage this child profile" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const result = updateChildSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid update data",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { budget, ...profileData } = result.data;

        const updateData: any = { ...profileData };
        if (profileData.dateOfBirth) {
            const age = calculateAge(new Date(profileData.dateOfBirth));
            updateData.independentRequestEligible = age >= appConfig.independentRequestAgeThreshold;
        }

        // Run updating child profile & budget inside transaction
        const updatedStudent = await prisma.$transaction(async (tx) => {
            const student = await tx.studentProfile.update({
                where: { id: childStudentId },
                data: updateData,
                include: { budget: true },
            });

            if (budget) {
                if (student.budget) {
                    await tx.budget.update({
                        where: { studentId: childStudentId },
                        data: {
                            maxAmount: budget.maxAmount,
                            currency: budget.currency,
                            period: budget.period,
                            isFlexible: budget.isFlexible,
                        },
                    });
                } else {
                    await tx.budget.create({
                        data: {
                            studentId: childStudentId,
                            maxAmount: budget.maxAmount,
                            currency: budget.currency,
                            period: budget.period,
                            isFlexible: budget.isFlexible,
                        },
                    });
                }
            }

            return tx.studentProfile.findUnique({
                where: { id: childStudentId },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            status: true,
                        },
                    },
                    budget: true,
                },
            });
        });

        return NextResponse.json({
            success: true,
            message: "Child profile details and budget updated successfully",
            student: updatedStudent,
        });
    } catch (error) {
        console.error("Update child info error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update child profile details" },
            { status: 500 }
        );
    }
}
