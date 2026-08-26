import { requireRole } from "@/lib/auth-guards";

export default async function TutorDashboard() {
    const session = await requireRole("TUTOR");

    return (
        <main>
            <h1>Tutor Dashboard</h1>

            <p>Welcome, {session.user.email}</p>

            <p>Role: {session.user.role}</p>

            <p>Manage your profile, availability, students, and sessions.</p>
        </main>
    );
}