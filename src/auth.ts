import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
    identifier: z.string().min(1).optional(),
    email: z.string().optional(),
    password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",

            credentials: {
                identifier: {
                    label: "Email or Phone",
                    type: "text",
                },
                email: {
                    label: "Email",
                    type: "email",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize(credentials) {
                const result = loginSchema.safeParse(credentials);

                if (!result.success) {
                    return null;
                }

                const { identifier, email, password } = result.data;
                const loginInput = (email || identifier || "").toLowerCase().trim();

                if (!loginInput) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: loginInput,
                    },
                });

                if (!user) {
                    return null;
                }

                if (user.status === "SUSPENDED" || user.status === "DEACTIVATED") {
                    return null;
                }

                const passwordMatches = await bcrypt.compare(
                    password,
                    user.passwordHash
                );

                if (!passwordMatches) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as
                    | "STUDENT"
                    | "PARENT"
                    | "TUTOR"
                    | "ADMIN";
            }

            return session;
        },
    },

    pages: {
        signIn: "/login",
    },
});