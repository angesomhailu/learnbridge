import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <main>
            <h1>Access Denied</h1>

            <p>
                You don't have permission to access this page.
            </p>

            <Link href="/dashboard">
                Go to Dashboard
            </Link>
        </main>
    );
}