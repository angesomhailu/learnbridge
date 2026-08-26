import "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            role: "STUDENT" | "PARENT" | "TUTOR" | "ADMIN";
        };
    }

    interface User {
        id: string;
        email: string;
        role: "STUDENT" | "PARENT" | "TUTOR" | "ADMIN";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: "STUDENT" | "PARENT" | "TUTOR" | "ADMIN";
    }
}