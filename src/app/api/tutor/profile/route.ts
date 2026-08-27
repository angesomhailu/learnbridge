import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authentication required",
                },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
            include: {
                tutor: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        if (user.role !== "TUTOR") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Only tutors can access this profile",
                },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            profile: user.tutor,
        });
    } catch (error) {
        console.error("Get tutor profile error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve tutor profile",
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authentication required",
                },
                { status: 401 }
            );
        }

        const body = await request.json();

        const dateOfBirth = body.dateOfBirth;
        const gender = body.gender;
        const bio = body.bio?.trim() || null;
        const experienceYears =
            body.experienceYears !== undefined &&
                body.experienceYears !== ""
                ? Number(body.experienceYears)
                : null;

        const languages = Array.isArray(body.languages)
            ? body.languages
            : [];

        if (!dateOfBirth) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Date of birth is required",
                },
                { status: 400 }
            );
        }

        if (!["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"].includes(gender)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid gender",
                },
                { status: 400 }
            );
        }

        if (
            experienceYears !== null &&
            (!Number.isInteger(experienceYears) ||
                experienceYears < 0)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid experience years",
                },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        if (user.role !== "TUTOR") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Only tutors can create a tutor profile",
                },
                { status: 403 }
            );
        }

        const profile = await prisma.tutorProfile.upsert({
            where: {
                userId: user.id,
            },
            update: {
                dateOfBirth: new Date(dateOfBirth),
                gender,
                bio,
                experienceYears,
                languages,
            },
            create: {
                userId: user.id,
                dateOfBirth: new Date(dateOfBirth),
                gender,
                bio,
                experienceYears,
                languages,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Tutor profile saved successfully",
            profile,
        });
    } catch (error) {
        console.error("Save tutor profile error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to save tutor profile",
            },
            { status: 500 }
        );
    }
}