import { requireRole } from "@/lib/auth-guards";

export default async function StudentDashboard() {
    const session = await requireRole("STUDENT");

    return (
        <main>
            <h1>Student Dashboard</h1>

            <p>Welcome, {session.user.email}</p>

            <p>Role: {session.user.role}</p>

            <p>Find tutors, manage your learning goals, and track your progress.</p>
        </main>
    );
}