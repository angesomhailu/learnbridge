import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    switch (session.user.role) {
        case "STUDENT":
            redirect("/student");

        case "PARENT":
            redirect("/parent");

        case "TUTOR":
            redirect("/tutor");

        case "ADMIN":
            redirect("/admin");

        default:
            redirect("/login");
    }
}