import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ReportStatus } from "@/generated/prisma/client";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(
    request: Request,
    { params }: Params
) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized. Admin access required." },
                { status: 403 }
            );
        }

        const adminUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
        });

        const { id } = await params;
        const body = await request.json();
        const { status, note } = body;

        const report = await prisma.report.findUnique({
            where: { id },
        });

        if (!report) {
            return NextResponse.json(
                { message: "Report ticket not found" },
                { status: 404 }
            );
        }

        const updatedReport = await prisma.report.update({
            where: { id },
            data: {
                status: status as ReportStatus,
            },
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                actorId: adminUser?.id,
                action: "REPORT_STATUS_UPDATE",
                entity: "Report",
                entityId: id,
                metadata: {
                    previousStatus: report.status,
                    newStatus: updatedReport.status,
                    adminNote: note || null,
                },
            },
        });

        return NextResponse.json({
            message: `Report status updated to ${status}`,
            report: updatedReport,
        });
    } catch (error) {
        console.error("Update report status error:", error);
        return NextResponse.json(
            { message: "Failed to update report ticket" },
            { status: 500 }
        );
    }
}
