import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Retrieve all conversations that this user participates in
        const userParticipants = await prisma.conversationParticipant.findMany({
            where: { userId },
            select: { conversationId: true },
        });

        const conversationIds = userParticipants.map((p) => p.conversationId);

        const conversations = await prisma.conversation.findMany({
            where: {
                id: { in: conversationIds },
            },
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
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1, // last message snippet
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({
            success: true,
            conversations: conversations.map((conv) => {
                const latestMessage = conv.messages[0] || null;
                return {
                    id: conv.id,
                    status: conv.status,
                    createdAt: conv.createdAt,
                    updatedAt: conv.updatedAt,
                    creatorId: conv.creatorId,
                    participants: conv.participants.map((p) => p.user),
                    latestMessage,
                };
            }),
        });
    } catch (error) {
        console.error("Get conversations error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to retrieve conversations" },
            { status: 500 }
        );
    }
}
