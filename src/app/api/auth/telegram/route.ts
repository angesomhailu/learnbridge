import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { telegramId, username, firstName, lastName, photoUrl, email } = body;

        if (!telegramId && !username && !email) {
            return NextResponse.json(
                { message: "Telegram ID or username or email is required." },
                { status: 400 }
            );
        }

        const effectiveTelegramId = telegramId || `user_${Date.now()}`;
        const effectiveEmail = (
            email ||
            (username ? `${username}@telegram.learnbridge` : `tg_${effectiveTelegramId}@telegram.learnbridge`)
        ).toLowerCase().trim();

        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: effectiveEmail },
                    { email: `tg_${effectiveTelegramId}@telegram.learnbridge` },
                ],
            },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: effectiveEmail,
                    passwordHash: null,
                    role: null,
                    status: "PENDING",
                },
            });
        }

        if (user.status === "SUSPENDED" || user.status === "DEACTIVATED") {
            return NextResponse.json(
                { message: "Account is suspended or deactivated." },
                { status: 403 }
            );
        }

        return NextResponse.json({
            ok: true,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                telegramId: effectiveTelegramId,
                username: username || null,
            },
            requiresRole: user.role === null,
        });
    } catch (error) {
        console.error("Telegram Auth API error:", error);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}
