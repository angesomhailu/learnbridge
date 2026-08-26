import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <main>
            <h1>Welcome to LearnBridge</h1>

            <p>Email: {session.user.email}</p>

            <p>Role: {session.user.role}</p>

            <p>User ID: {session.user.id}</p>

            <LogoutButton />
        </main>
    );
}