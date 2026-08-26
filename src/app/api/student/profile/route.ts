import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const updateProfileSchema = z.object({
    dateOfBirth: z.coerce.date().optional(),

    gender: z
        .enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"])
        .optional(),

    grade: z.string().min(1).max(100).optional(),

    schoolName: z.string().max(200).optional().nullable(),

    bio: z.string().max(1000).optional().nullable(),

    learningNeeds: z.string().max(2000).optional().nullable(),

    languages: z.array(z.string().min(1).max(50)).optional(),
});

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authentication required",
                },
                { status: 401 }
            );
        }

        if (session.user.role !== "STUDENT") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Only students can access this profile",
                },
                { status: 403 }
            );
        }

        const profile = await prisma.studentProfile.findUnique({
            where: {
                userId: session.user.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!profile) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Student profile not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            profile,
        });
    } catch (error) {
        console.error("Get student profile error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve student profile",
            },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authentication required",
                },
                { status: 401 }
            );
        }

        if (session.user.role !== "STUDENT") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Only students can update this profile",
                },
                { status: 403 }
            );
        }

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

        const result = updateProfileSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid profile data",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const data = result.data;

        const existingProfile = await prisma.studentProfile.findUnique({
            where: {
                userId: session.user.id,
            },
        });

        if (!existingProfile) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Student profile not found",
                },
                { status: 404 }
            );
        }

        const profile = await prisma.studentProfile.update({
            where: {
                userId: session.user.id,
            },
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: "Student profile updated successfully",
            profile,
        });
    } catch (error) {
        console.error("Update student profile error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update student profile",
            },
            { status: 500 }
        );
    }
}