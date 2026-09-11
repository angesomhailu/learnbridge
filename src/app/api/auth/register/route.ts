import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { sendAccountCreationNotifications } from "@/lib/services/notificationService";

const registerSchema = z.object({
    email: z
        .string()
        .email()
        .transform((value) => value.toLowerCase().trim()),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),

    role: z.enum(["STUDENT", "PARENT", "TUTOR"]),

    phone: z.string().optional(),

    dateOfBirth: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        let body: unknown;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    message: "Request body must contain valid JSON",
                },
                { status: 400 }
            );
        }

        const result = registerSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid registration data",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const {
            email,
            password,
            role,
            phone,
            dateOfBirth,
        } = result.data;

        const cleanPhone = phone
            ? phone.trim()
            : undefined;

        // Check if email or phone is already registered
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    ...(cleanPhone
                        ? [{ phone: cleanPhone }]
                        : []),
                ],
            },
        });

        if (existingUser) {
            const isEmailMatch =
                existingUser.email === email;

            return NextResponse.json(
                {
                    success: false,
                    message: isEmailMatch
                        ? "An account with this email already exists"
                        : "An account with this phone number already exists",
                },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(
            password,
            12
        );

        const user = await prisma.$transaction(
            async (tx) => {
                const newUser = await tx.user.create({
                    data: {
                        email,
                        phone: cleanPhone,
                        passwordHash,
                        role,
                        status:
                            role === "TUTOR"
                                ? "PENDING"
                                : "ACTIVE",
                    },
                });

                const parsedDob = dateOfBirth
                    ? new Date(dateOfBirth)
                    : new Date("2000-01-01");

                if (role === "STUDENT") {
                    await tx.studentProfile.create({
                        data: {
                            userId: newUser.id,
                            phone: cleanPhone,
                            dateOfBirth: parsedDob,
                            gender: "PREFER_NOT_TO_SAY",
                            grade: "Not specified",
                            languages: [],
                        },
                    });
                }

                if (role === "PARENT") {
                    await tx.parentProfile.create({
                        data: {
                            userId: newUser.id,
                            phone: cleanPhone,
                        },
                    });
                }

                if (role === "TUTOR") {
                    await tx.tutorProfile.create({
                        data: {
                            userId: newUser.id,
                            phone: cleanPhone,
                            dateOfBirth: parsedDob,
                            gender: "PREFER_NOT_TO_SAY",
                            languages: [],
                        },
                    });
                }

                return newUser;
            }
        );

        /*
         * Normal registration already has a validated
         * email and role, so use those values here.
         *
         * This also avoids the new nullable Prisma
         * User.email / User.role types.
         */
        sendAccountCreationNotifications({
            email,
            phone: user.phone || undefined,
            role,
        }).catch((err) => {
            console.error(
                "Account creation notification background error:",
                err
            );
        });

        return NextResponse.json(
            {
                success: true,
                message: "Account created successfully",
                user: {
                    id: user.id,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    status: user.status,
                    createdAt: user.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "An unexpected error occurred",
            },
            { status: 500 }
        );
    }
}