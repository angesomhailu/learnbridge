import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
    email: z
        .string()
        .email()
        .transform((value) => value.toLowerCase().trim()),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),

    role: z.enum(["STUDENT", "PARENT", "TUTOR"]),
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

        const { email, password, role } = result.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "An account with this email already exists",
                },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email,
                    passwordHash,
                    role,
                    status: role === "TUTOR" ? "PENDING" : "ACTIVE",
                },
            });

            if (role === "STUDENT") {
                await tx.studentProfile.create({
                    data: {
                        userId: newUser.id,
                        dateOfBirth: new Date("2000-01-01"),
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
                    },
                });
            }

            if (role === "TUTOR") {
                await tx.tutorProfile.create({
                    data: {
                        userId: newUser.id,
                        dateOfBirth: new Date("2000-01-01"),
                        gender: "PREFER_NOT_TO_SAY",
                        languages: [],
                    },
                });
            }

            return newUser;
        });

        return NextResponse.json(
            {
                success: true,
                message: "Account created successfully",
                user: {
                    id: user.id,
                    email: user.email,
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