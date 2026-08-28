
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function POST(
    request: Request,
    context: RouteContext
) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
            include: {
                student: true,
            },
        });

        if (!user || user.role !== "STUDENT") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Student access required",
                },
                { status: 403 }
            );
        }

        if (!user.student) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Student profile not found",
                },
                { status: 404 }
            );
        }

        const { id } = await context.params;

        const body = await request.json();

        const transactionId =
            typeof body.transactionId === "string"
                ? body.transactionId.trim()
                : "";

        if (!transactionId) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "transactionId is required",
                },
                { status: 400 }
            );
        }

        const payment =
            await prisma.payment.findUnique({
                where: {
                    id,
                },
                include: {
                    booking: true,
                },
            });

        if (!payment) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Payment not found",
                },
                { status: 404 }
            );
        }

        if (
            payment.booking.studentId !==
            user.student.id
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "You are not authorized to verify this payment",
                },
                { status: 403 }
            );
        }

        if (payment.status === "PAID") {
            return NextResponse.json({
                success: true,
                message: "Payment is already paid",
                payment,
            });
        }

        const updatedPayment =
            await prisma.payment.update({
                where: {
                    id,
                },
                data: {
                    status: "PAID",
                    provider: "TEST",
                    transactionId,
                    paidAt: new Date(),
                },
            });

        return NextResponse.json({
            success: true,
            message:
                "Payment verified successfully",
            payment: updatedPayment,
        });
    } catch (error) {
        console.error(
            "Verify payment error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to verify payment",
            },
            { status: 500 }
        );
    }
}

