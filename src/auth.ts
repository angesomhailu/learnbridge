import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
    identifier: z.string().min(1).optional(),
    email: z.string().optional(),
    password: z.string().min(8),
});

function getPhoneVariants(input: string): string[] {
    const clean = input.trim();
    const digitsOnly = clean.replace(/\D/g, "");

    const variants = new Set<string>([clean, digitsOnly]);

    // Handle Ethiopian phone numbers (9 digits starting with 9)
    if (digitsOnly.length === 9 && digitsOnly.startsWith("9")) {
        variants.add(digitsOnly);
        variants.add(`0${digitsOnly}`);
        variants.add(`+251${digitsOnly}`);
        variants.add(`251${digitsOnly}`);
    } else if (digitsOnly.length === 10 && digitsOnly.startsWith("09")) {
        const nineDigits = digitsOnly.slice(1);
        variants.add(nineDigits);
        variants.add(digitsOnly);
        variants.add(`+251${nineDigits}`);
        variants.add(`251${nineDigits}`);
    } else if (digitsOnly.length === 12 && digitsOnly.startsWith("2519")) {
        const nineDigits = digitsOnly.slice(3);
        variants.add(nineDigits);
        variants.add(`0${nineDigits}`);
        variants.add(`+251${nineDigits}`);
        variants.add(digitsOnly);
    }

    return Array.from(variants).filter(Boolean);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
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

                const phoneVariants = getPhoneVariants(loginInput);

                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: loginInput },
                            { phone: { in: phoneVariants } },
                            { student: { phone: { in: phoneVariants } } },
                            { parent: { phone: { in: phoneVariants } } },
                            { tutor: { phone: { in: phoneVariants } } },
                        ],
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