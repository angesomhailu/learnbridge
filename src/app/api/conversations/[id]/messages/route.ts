import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

const createMessageSchema = z.object({
    content: z.string().min(1, "Message content cannot be empty"),
});

// GET /api/conversations/[id]/messages
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

        // Verify participant
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
                { success: false, message: "You are not authorized to view messages in this conversation" },
                { status: 403 }
            );
        }

        const messages = await prisma.message.findMany({
            where: { conversationId },
            include: {
                sender: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json({
            success: true,
            messages,
        });
    } catch (error) {
        console.error("Get messages error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to retrieve messages" },
            { status: 500 }
        );
    }
}

// POST /api/conversations/[id]/messages
export async function POST(
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

        // Check if conversation exists and retrieve status
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
        });

        if (!conversation) {
            return NextResponse.json(
                { success: false, message: "Conversation not found" },
                { status: 404 }
            );
        }

        // Prevent new messages under closed conversations
        if (conversation.status === "CLOSED") {
            return NextResponse.json(
                { success: false, message: "This conversation has been closed and is read-only." },
                { status: 400 }
            );
        }

        // Verify user is a participant
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
                { success: false, message: "You are not authorized to send messages to this conversation" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const result = createMessageSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid message data",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { content } = result.data;

        // Post message
        const message = await prisma.$transaction(async (tx) => {
            const msg = await tx.message.create({
                data: {
                    conversationId,
                    senderId: session.user.id,
                    content,
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            });

            return msg;
        });

        return NextResponse.json(
            {
                success: true,
                message: "Message sent successfully",
                messageDetails: message,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create message error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to send message" },
            { status: 500 }
        );
    }
}
