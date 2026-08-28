import TutorPricing from "@/components/tutor/TutorPricing";

export default function TutorPricingPage() {
    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold">
                    Pricing
                </h1>

                <p className="mt-2 text-gray-600">
                    Set your tutoring rates and session durations.
                </p>

                <div className="mt-8">
                    <TutorPricing />
                </div>
            </div>
        </main>
    );
}