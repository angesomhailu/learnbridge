import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

// GET details of specific conversation
export async function GET(
    request: Request,
    { params }: Params
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        const { id: conversationId } = await params;

        // Check if user is a participant
        const participant = await prisma.conversationParticipant.findUnique({
            where: {
                conversationId_userId: {
                    conversationId,
                    userId: session.user.id,
                },
            },
        });

        if (!participant) {
            return NextResponse.json(
                { success: false, message: "You are not authorized to view this conversation" },
                { status: 403 }
            );
        }

        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            conversation,
        });
    } catch (error) {
        console.error("Get specific conversation detail error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to retrieve conversation logs" },
            { status: 500 }
        );
    }
}

// PATCH to close conversation
export async function PATCH(
    request: Request,
    { params }: Params
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        const { id: conversationId } = await params;

        // Check if user is participant
        const participant = await prisma.conversationParticipant.findUnique({
            where: {
                conversationId_userId: {
                    conversationId,
                    userId: session.user.id,
                },
            },
        });

        if (!participant) {
            return NextResponse.json(
                { success: false, message: "You are not a participant in this conversation" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { status } = body;

        if (status !== "CLOSED") {
            return NextResponse.json(
                { success: false, message: "Status can only be updated to CLOSED" },
                { status: 400 }
            );
        }

        const updatedConversation = await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                status: "CLOSED",
                closedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            message: "Conversation closed successfully. It is now read-only.",
            conversation: updatedConversation,
        });
    } catch (error) {
        console.error("Update conversation status error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to close conversation" },
            { status: 500 }
        );
    }
}
