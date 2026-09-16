import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized. Admin role required." },
                { status: 403 }
            );
        }

        // Gather metrics in parallel
        const [
            totalUsers,
            studentCount,
            parentCount,
            tutorCount,
            adminCount,
            tutorPendingCount,
            tutorVerifiedCount,
            tutorRejectedCount,
            tutorResubmitCount,
            totalBookings,
            pendingBookings,
            confirmedBookings,
            completedBookings,
            cancelledBookings,
            totalSubjects,
            openReportsCount,
            totalPaymentsResult,
            recentUsers,
            recentAuditLogs,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: "STUDENT" } }),
            prisma.user.count({ where: { role: "PARENT" } }),
            prisma.user.count({ where: { role: "TUTOR" } }),
            prisma.user.count({ where: { role: "ADMIN" } }),
            prisma.tutorProfile.count({ where: { verificationStatus: "PENDING" } }),
            prisma.tutorProfile.count({ where: { verificationStatus: "VERIFIED" } }),
            prisma.tutorProfile.count({ where: { verificationStatus: "REJECTED" } }),
            prisma.tutorProfile.count({ where: { verificationStatus: "RESUBMISSION_REQUIRED" } }),
            prisma.booking.count(),
            prisma.booking.count({ where: { status: "PENDING" } }),
            prisma.booking.count({ where: { status: "CONFIRMED" } }),
            prisma.booking.count({ where: { status: "COMPLETED" } }),
            prisma.booking.count({ where: { status: "CANCELLED" } }),
            prisma.subject.count(),
            prisma.report.count({ where: { status: { in: ["OPEN", "UNDER_REVIEW"] } } }),
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: { status: "PAID" },
            }),
            prisma.user.findMany({
                take: 6,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true,
                    createdAt: true,
                },
            }),
            prisma.auditLog.findMany({
                take: 6,
                orderBy: { createdAt: "desc" },
                include: {
                    actor: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            }),
        ]);

        const totalRevenue = Number(totalPaymentsResult._sum.amount || 0);

        return NextResponse.json({
            stats: {
                totalUsers,
                roles: {
                    STUDENT: studentCount,
                    PARENT: parentCount,
                    TUTOR: tutorCount,
                    ADMIN: adminCount,
                },
                tutors: {
                    total: tutorCount,
                    pending: tutorPendingCount,
                    verified: tutorVerifiedCount,
                    rejected: tutorRejectedCount,
                    resubmit: tutorResubmitCount,
                },
                bookings: {
                    total: totalBookings,
                    pending: pendingBookings,
                    confirmed: confirmedBookings,
                    completed: completedBookings,
                    cancelled: cancelledBookings,
                },
                totalSubjects,
                openReportsCount,
                totalRevenue,
            },
            recentUsers,
            recentAuditLogs,
        });
    } catch (error) {
        console.error("Admin stats fetch error:", error);
        return NextResponse.json(
            { message: "Failed to fetch admin stats" },
            { status: 500 }
        );
    }
}
