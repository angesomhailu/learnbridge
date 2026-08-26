import StudentProfileForm from "@/components/student/StudentProfileForm";

export default function StudentProfilePage() {
    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-3xl font-bold">
                    Student Profile
                </h1>

                <p className="mt-2 text-gray-600">
                    Complete your profile so LearnBridge can better
                    understand your learning needs.
                </p>

                <div className="mt-8">
                    <StudentProfileForm />
                </div>
            </div>
        </main>
    );
}