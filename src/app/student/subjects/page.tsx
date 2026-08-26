import StudentSubjects from "@/components/student/StudentSubjects";

export default function StudentSubjectsPage() {
    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold">My Subjects</h1>

                <p className="mt-2 text-gray-600">
                    Select the subjects you want help with. LearnBridge will use
                    these subjects to help match you with suitable tutors.
                </p>

                <div className="mt-8">
                    <StudentSubjects />
                </div>
            </div>
        </main>
    );
}