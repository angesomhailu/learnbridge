import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const socialCompleteSchema = z.object({
    role: z.enum(["STUDENT", "PARENT", "TUTOR"]),

    dateOfBirth: z.string().optional(),
    gender: z
        .enum([
            "MALE",
            "FEMALE",
            "OTHER",
            "PREFER_NOT_TO_SAY",
        ])
        .optional(),

    grade: z.string().optional(),
    phone: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You must be signed in.",
                },
                { status: 401 }
            );
        }

        const result = socialCompleteSchema.safeParse(
            await request.json()
        );

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid profile information.",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const {
            role,
            dateOfBirth,
            gender,
            grade,
            phone,
        } = result.data;

        const existingUser = await prisma.user.findUnique({
            where: {
                id: session.user.id,
            },
            include: {
                student: true,
                parent: true,
                tutor: true,
            },
        });

        if (!existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User account not found.",
                },
                { status: 404 }
            );
        }

        if (existingUser.role !== null) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Your profile has already been completed.",
                },
                { status: 400 }
            );
        }

        if (
            existingUser.status === "SUSPENDED" ||
            existingUser.status === "DEACTIVATED"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "This account cannot be completed.",
                },
                { status: 403 }
            );
        }

        /*
         * Validate role-specific required fields.
         */
        if (role === "STUDENT") {
            if (!dateOfBirth || !gender || !grade) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Date of birth, gender, and grade are required for students.",
                    },
                    { status: 400 }
                );
            }
        }

        if (role === "TUTOR") {
            if (!dateOfBirth || !gender) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Date of birth and gender are required for tutors.",
                    },
                    { status: 400 }
                );
            }
        }

        const parsedDob = dateOfBirth
            ? new Date(dateOfBirth)
            : new Date("2000-01-01");

        if (Number.isNaN(parsedDob.getTime())) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid date of birth.",
                },
                { status: 400 }
            );
        }

        /*
         * Make sure the phone isn't already being used
         * by another account.
         */
        if (phone?.trim()) {
            const cleanPhone = phone.trim();

            const phoneOwner = await prisma.user.findFirst({
                where: {
                    phone: cleanPhone,
                    NOT: {
                        id: existingUser.id,
                    },
                },
            });

            if (phoneOwner) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "This phone number is already associated with another account.",
                    },
                    { status: 409 }
                );
            }
        }

        const cleanPhone = phone?.trim() || null;

        /*
         * Create the appropriate profile and update
         * the User record in one transaction.
         */
        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: {
                    id: existingUser.id,
                },
                data: {
                    role,
                    phone: cleanPhone,
                    status:
                        role === "TUTOR"
                            ? "PENDING"
                            : "ACTIVE",
                },
            });

            if (role === "STUDENT") {
                await tx.studentProfile.create({
                    data: {
                        userId: existingUser.id,
                        phone: cleanPhone,
                        dateOfBirth: parsedDob,
                        gender: gender!,
                        grade: grade!,
                        languages: [],
                    },
                });
            }

            if (role === "PARENT") {
                await tx.parentProfile.create({
                    data: {
                        userId: existingUser.id,
                        phone: cleanPhone,
                    },
                });
            }

            if (role === "TUTOR") {
                await tx.tutorProfile.create({
                    data: {
                        userId: existingUser.id,
                        phone: cleanPhone,
                        dateOfBirth: parsedDob,
                        gender: gender!,
                        languages: [],
                    },
                });
            }
        });

        return NextResponse.json({
            success: true,
            message: "Profile completed successfully.",
            role,
            status:
                role === "TUTOR"
                    ? "PENDING"
                    : "ACTIVE",
        });
    } catch (error) {
        console.error(
            "Social profile completion error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "An unexpected error occurred while completing your profile.",
            },
            { status: 500 }
        );
    }
}