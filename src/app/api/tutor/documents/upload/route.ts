import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const allowedTypes = [
    "DEGREE",
    "CERTIFICATE",
    "IDENTITY",
    "TRANSCRIPT",
    "OTHER",
];

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

        const {
            type,
            title,
            fileUrl,
            fileName,
            mimeType,
            fileSize,
        } = body;

        if (!type || !title || !fileUrl || !fileName) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Type, title, file URL and file name are required",
                },
                { status: 400 }
            );
        }

        if (!allowedTypes.includes(type)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid document type",
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

        const document = await prisma.tutorDocument.create({
            data: {
                tutorId: user.tutor.id,
                type,
                title,
                fileUrl,
                fileName,
                mimeType: mimeType || "application/octet-stream",
                fileSize: Number(fileSize) || 0,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Document uploaded successfully",
            document,
        });
    } catch (error) {
        console.error("Upload tutor document error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to upload document",
            },
            { status: 500 }
        );
    }
}