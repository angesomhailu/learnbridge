import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateAge } from "@/lib/utils/age";
import { appConfig } from "@/lib/config";

const createChildSchema = z.object({
    email: z
        .string()
        .email()
        .transform((val) => val.toLowerCase().trim()),
    password: z.string().min(8, "Password must be at least 8 characters"),
    dateOfBirth: z.coerce.date(),
    gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]),
    grade: z.string().min(1, "Grade is required"),
    schoolName: z.string().optional(),
    bio: z.string().optional(),
    learningNeeds: z.string().optional(),
    languages: z.array(z.string()).default([]),
    budget: z
        .object({
            maxAmount: z.coerce.number().positive(),
            currency: z.string().default("ETB"),
            period: z.enum(["PER_SESSION", "WEEKLY", "MONTHLY"]).default("WEEKLY"),
            isFlexible: z.boolean().default(false),
        })
        .optional(),
});

export async function GET() {
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
                { success: false, message: "Only parents can access child profiles" },
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

        const children = await prisma.parentStudent.findMany({
            where: { parentId: parentProfile.id },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                status: true,
                            },
                        },
                        budget: true,
                        subjects: {
                            include: { subject: true },
                        },
                        learningGoals: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            children: children.map((c) => ({
                relationship: c.relationship,
                isPrimary: c.isPrimary,
                ...c.student,
            })),
        });
    } catch (error) {
        console.error("Get parent children error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to retrieve children profiles" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
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
                { success: false, message: "Only parents can add child profiles" },
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
        const result = createChildSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid child developer metadata",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const {
            email,
            password,
            dateOfBirth,
            gender,
            grade,
            schoolName,
            bio,
            learningNeeds,
            languages,
            budget,
        } = result.data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "A user account with this email already exists" },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const age = calculateAge(new Date(dateOfBirth));
        const isIndependent = age >= appConfig.independentRequestAgeThreshold;

        // Create user, studentProfile, and link them to parent in a transaction
        const student = await prisma.$transaction(async (tx) => {
            const childUser = await tx.user.create({
                data: {
                    email,
                    passwordHash,
                    role: "STUDENT",
                    status: "ACTIVE",
                },
            });

            const profile = await tx.studentProfile.create({
                data: {
                    userId: childUser.id,
                    dateOfBirth,
                    gender,
                    grade,
                    schoolName: schoolName || null,
                    bio: bio || null,
                    learningNeeds: learningNeeds || null,
                    languages,
                    independentRequestEligible: isIndependent,
                    ...(budget
                        ? {
                            budget: {
                                create: {
                                    maxAmount: budget.maxAmount,
                                    currency: budget.currency,
                                    period: budget.period,
                                    isFlexible: budget.isFlexible,
                                },
                            },
                        }
                        : {}),
                },
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

            await tx.parentStudent.create({
                data: {
                    parentId: parentProfile.id,
                    studentId: profile.id,
                    relationship: "CHILD",
                    isPrimary: true,
                },
            });

            return profile;
        });

        return NextResponse.json(
            {
                success: true,
                message: "Child student account registered and linked successfully",
                student,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create child student account error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create child profile" },
            { status: 500 }
        );
    }
}
