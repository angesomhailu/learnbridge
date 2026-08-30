import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateTutorScore } from "@/lib/recommendation";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const subject = searchParams.get("subject");
        const studentIdParam = searchParams.get("studentId");

        const session = await auth();
        let studentProfile: any = null;

        if (session?.user) {
            if (session.user.role === "STUDENT") {
                studentProfile = await prisma.studentProfile.findUnique({
                    where: { userId: session.user.id },
                    include: {
                        subjects: { include: { subject: true } },
                        availability: true,
                        budget: true,
                        learningGoals: true,
                    },
                });
            } else if (session.user.role === "PARENT" && studentIdParam) {
                // Verify relationship
                const parentProfile = await prisma.parentProfile.findUnique({
                    where: { userId: session.user.id },
                });
                if (parentProfile) {
                    const relation = await prisma.parentStudent.findUnique({
                        where: {
                            parentId_studentId: {
                                parentId: parentProfile.id,
                                studentId: studentIdParam,
                            },
                        },
                    });
                    if (relation) {
                        studentProfile = await prisma.studentProfile.findUnique({
                            where: { id: studentIdParam },
                            include: {
                                subjects: { include: { subject: true } },
                                availability: true,
                                budget: true,
                                learningGoals: true,
                            },
                        });
                    }
                }
            }
        }

        const tutors = await prisma.tutorProfile.findMany({
            where: {
                verificationStatus: "VERIFIED",
                user: {
                    status: "ACTIVE",
                },
                ...(subject
                    ? {
                        subjects: {
                            some: {
                                subject: {
                                    name: {
                                        equals: subject,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        },
                    }
                    : {}),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                educationRecords: true,
                subjects: {
                    include: {
                        subject: true,
                    },
                },
                pricing: true,
                availability: true,
                reviews: true,
            },
        });

        const scoredTutors = tutors.map((tutor) => {
            if (studentProfile) {
                const recommendation = calculateTutorScore(studentProfile, tutor);
                return {
                    ...tutor,
                    recommendationScore: recommendation.score,
                    recommendationBreakdown: recommendation.breakdown,
                    recommendationExplanations: recommendation.explanations,
                };
            }
            return {
                ...tutor,
                recommendationScore: 0,
                recommendationBreakdown: null,
                recommendationExplanations: ["Sign in or select a student profile to see compatibility explanations."],
            };
        });

        // Sort: if student profile exists, sort by recommendationScore desc, else by createdAt desc
        if (studentProfile) {
            scoredTutors.sort((a, b) => b.recommendationScore - a.recommendationScore);
        } else {
            scoredTutors.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return NextResponse.json({
            success: true,
            tutors: scoredTutors,
        });
    } catch (error) {
        console.error("Get tutors error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve tutors",
            },
            { status: 500 }
        );
    }
}