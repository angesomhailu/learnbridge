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
                tutor: {
                    include: {
                        educationRecords: {
                            orderBy: {
                                graduationYear: "desc",
                            },
                        },
                    },
                },
            },
        });

        if (!user || user.role !== "TUTOR") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Tutor account required",
                },
                { status: 403 }
            );
        }

        if (!user.tutor) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Tutor profile not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            education: user.tutor.educationRecords,
        });
    } catch (error) {
        console.error("Get tutor education error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve education records",
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

        const institution = body.institution?.trim();
        const degree = body.degree?.trim();
        const department = body.department?.trim() || null;

        const graduationYear =
            body.graduationYear !== undefined &&
                body.graduationYear !== ""
                ? Number(body.graduationYear)
                : null;

        if (!institution || !degree) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Institution and degree are required",
                },
                { status: 400 }
            );
        }

        if (
            graduationYear !== null &&
            (!Number.isInteger(graduationYear) ||
                graduationYear < 1900 ||
                graduationYear > new Date().getFullYear() + 10)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid graduation year",
                },
                { status: 400 }
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

        if (!user || user.role !== "TUTOR") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Tutor account required",
                },
                { status: 403 }
            );
        }

        if (!user.tutor) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please create your tutor profile first",
                },
                { status: 404 }
            );
        }

        const education = await prisma.educationRecord.create({
            data: {
                tutorId: user.tutor.id,
                institution,
                degree,
                department,
                graduationYear,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Education record added successfully",
            education,
        });
    } catch (error) {
        console.error("Create tutor education error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to add education record",
            },
            { status: 500 }
        );
    }
}