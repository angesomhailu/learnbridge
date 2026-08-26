import LearningGoals from "@/components/student/LearningGoals";

export default function StudentGoalsPage() {
    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold">
                    Learning Goals
                </h1>

                <p className="mt-2 text-gray-600">
                    Tell LearnBridge what you want to achieve so we
                    can find tutors who are a good match for you.
                </p>

                <div className="mt-8">
                    <LearningGoals />
                </div>
            </div>
        </main>
    );
}