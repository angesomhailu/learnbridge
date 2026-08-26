import StudentBudget from "@/components/student/StudentBudget";

export default function StudentBudgetPage() {
    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-3xl font-bold">
                    Tutoring Budget
                </h1>

                <p className="mt-2 text-gray-600">
                    Set your preferred tutoring budget so LearnBridge
                    can find tutors within your price range.
                </p>

                <div className="mt-8">
                    <StudentBudget />
                </div>
            </div>
        </main>
    );
}