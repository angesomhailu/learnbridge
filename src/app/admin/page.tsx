import { requireRole } from "@/lib/auth-guards";

export default async function AdminDashboard() {
    const session = await requireRole("ADMIN");

    return (
        <main>
            <h1>Admin Dashboard</h1>

            <p>Welcome, {session.user.email}</p>

            <p>Role: {session.user.role}</p>

            <p>
                Manage users, verify tutors, review reports, and monitor
                LearnBridge.
            </p>
        </main>
    );
}