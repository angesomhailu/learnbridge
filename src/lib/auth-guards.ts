import { auth } from "@/auth";
import { redirect } from "next/navigation";

export type AppRole =
    | "STUDENT"
    | "PARENT"
    | "TUTOR"
    | "ADMIN";

export async function requireAuth() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role === null || session.user.role === undefined) {
        redirect("/social-complete");
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

export async function requireAnyRole(
    roles: AppRole[]
) {
    const session = await requireAuth();

    const userRole = session.user.role;

    if (
        userRole === null ||
        userRole === undefined ||
        !roles.includes(userRole)
    ) {
        redirect("/unauthorized");
    }

    return session;
}