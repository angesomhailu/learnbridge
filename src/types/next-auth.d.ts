import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            role:
            | "STUDENT"
            | "PARENT"
            | "TUTOR"
            | "ADMIN"
            | null;
        };
    }

    interface User {
        id: string;
        name?: string | null;
        email?: string | null;
        role:
        | "STUDENT"
        | "PARENT"
        | "TUTOR"
        | "ADMIN"
        | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role:
        | "STUDENT"
        | "PARENT"
        | "TUTOR"
        | "ADMIN"
        | null;
    }
}