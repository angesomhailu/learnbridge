import { requireRole } from "@/lib/auth-guards";
import ParentDashboardClient from "./ParentDashboardClient";

export default async function ParentDashboard() {
    const session = await requireRole("PARENT");

    return <ParentDashboardClient session={session} />;
}