import { auth } from "@/auth";
import { redirect } from "next/navigation";

export type AppRole = "STUDENT" | "PARENT" | "TUTOR" | "ADMIN";

export async function requireAuth() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return session;
}

export async function requireRole(role: AppRole) {
    const session = await requireAuth();

    if (session.user.role !== role) {
        redirect("/unauthorized");
    }

    return session;
}

export async function requireAnyRole(roles: AppRole[]) {
    const session = await requireAuth();

    if (!roles.includes(session.user.role)) {
        redirect("/unauthorized");
    }

    return session;
}