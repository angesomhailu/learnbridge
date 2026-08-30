import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const updateParentProfileSchema = z.object({
    dateOfBirth: z.coerce.date().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
    phone: z.string().max(30).optional().nullable(),
    occupation: z.string().max(100).optional().nullable(),
    address: z.string().max(200).optional().nullable(),
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
                { success: false, message: "Only parents can access this profile" },
                { status: 403 }
            );
        }

        const profile = await prisma.parentProfile.findUnique({
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
                { success: false, message: "Parent profile not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            profile,
        });
    } catch (error) {
        console.error("Get parent profile error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to retrieve parent profile" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
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
                { success: false, message: "Only parents can update this profile" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const result = updateParentProfileSchema.safeParse(body);

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

        const existingProfile = await prisma.parentProfile.findUnique({
            where: {
                userId: session.user.id,
            },
        });

        if (!existingProfile) {
            return NextResponse.json(
                { success: false, message: "Parent profile not found" },
                { status: 404 }
            );
        }

        const profile = await prisma.parentProfile.update({
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
            message: "Parent profile updated successfully",
            profile,
        });
    } catch (error) {
        console.error("Update parent profile error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update parent profile" },
            { status: 500 }
        );
    }
}
