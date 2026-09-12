import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";

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
    } else if (
        digitsOnly.length === 12 &&
        digitsOnly.startsWith("2519")
    ) {
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
            id: "telegram",
            name: "Telegram",
            credentials: {
                telegramId: { label: "Telegram ID", type: "text" },
                email: { label: "Email", type: "text" },
                name: { label: "Name", type: "text" },
                username: { label: "Username", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.telegramId) return null;

                const telegramId = credentials.telegramId as string;
                const emailInput = credentials.email as string;
                const username = credentials.username as string;

                const primaryEmail = (
                    emailInput ||
                    (username ? `${username}@telegram.learnbridge` : `tg_${telegramId}@telegram.learnbridge`)
                ).toLowerCase().trim();

                let user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: primaryEmail },
                            { email: `tg_${telegramId}@telegram.learnbridge` },
                        ],
                    },
                });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            email: primaryEmail,
                            passwordHash: null,
                            role: null,
                            status: "PENDING",
                        },
                    });
                }

                if (
                    user.status === "SUSPENDED" ||
                    user.status === "DEACTIVATED"
                ) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email ?? undefined,
                    role: user.role ?? null,
                };
            },
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

                const {
                    identifier,
                    email,
                    password,
                } = result.data;

                const loginInput = (
                    email ||
                    identifier ||
                    ""
                )
                    .toLowerCase()
                    .trim();

                if (!loginInput) {
                    return null;
                }

                const phoneVariants =
                    getPhoneVariants(loginInput);

                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            {
                                email: loginInput,
                            },
                            {
                                phone: {
                                    in: phoneVariants,
                                },
                            },
                            {
                                student: {
                                    phone: {
                                        in: phoneVariants,
                                    },
                                },
                            },
                            {
                                parent: {
                                    phone: {
                                        in: phoneVariants,
                                    },
                                },
                            },
                            {
                                tutor: {
                                    phone: {
                                        in: phoneVariants,
                                    },
                                },
                            },
                        ],
                    },
                });

                if (!user) {
                    return null;
                }

                if (
                    user.status === "SUSPENDED" ||
                    user.status === "DEACTIVATED"
                ) {
                    return null;
                }

                if (!user.passwordHash) {
                    return null;
                }

                const passwordMatches =
                    await bcrypt.compare(
                        password,
                        user.passwordHash
                    );

                if (!passwordMatches) {
                    return null;
                }

                /*
                 * Normal credential accounts should always
                 * have a role.
                 *
                 * A role-null account belongs to the social
                 * authentication completion flow.
                 */
                if (!user.role) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email ?? undefined,
                    role: user.role,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async signIn({ user, account }) {
            /*
             * GOOGLE LOGIN
             */
            if (account?.provider === "google") {
                if (!user.email) {
                    return false;
                }

                const email =
                    user.email.toLowerCase().trim();

                const existingUser =
                    await prisma.user.findUnique({
                        where: {
                            email,
                        },
                    });

                /*
                 * Existing LearnBridge account
                 */
                if (existingUser) {
                    if (
                        existingUser.status === "SUSPENDED" ||
                        existingUser.status === "DEACTIVATED"
                    ) {
                        return false;
                    }

                    user.id = existingUser.id;
                    user.email =
                        existingUser.email ?? undefined;

                    /*
                     * IMPORTANT:
                     * Only assign a role when one exists.
                     *
                     * If role is null, the user is sent to
                     * /social-complete after authentication.
                     */
                    if (existingUser.role !== null) {
                        user.role = existingUser.role;
                    }

                    return true;
                }

                /*
                 * New Google account
                 */
                const newUser =
                    await prisma.user.create({
                        data: {
                            email,
                            passwordHash: null,
                            role: null,
                            status: "PENDING",
                        },
                    });

                user.id = newUser.id;
                user.email =
                    newUser.email ?? undefined;

                /*
                 * Do NOT do:
                 *
                 * user.role = null
                 *
                 * because the NextAuth User type currently
                 * expects a concrete role.
                 *
                 * The JWT callback below will explicitly
                 * preserve the absence of a role as null.
                 */

                return true;
            }

            return true;
        },

        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;

                const dbUser = await prisma.user.findUnique({
                    where: {
                        id: user.id,
                    },
                    select: {
                        role: true,
                    },
                });

                token.role = dbUser?.role ?? null;
            }

            if (trigger === "update" && session?.role) {
                token.role = session.role;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;

                /*
                 * Session role must be either a valid role
                 * or null. Never assign undefined.
                 */
                session.user.role =
                    token.role ??
                    null;
            }

            return session;
        },
    },

    pages: {
        signIn: "/login",
    },
});