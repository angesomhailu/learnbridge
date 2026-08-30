import { calculateAge } from "../src/lib/utils/age";
import { calculateTutorScore } from "../src/lib/recommendation";

console.log("==================================================");
console.log("   LEARNBRIDGE LOGIC & VERIFICATION TEST SUITE    ");
console.log("==================================================");

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string) {
    if (condition) {
        console.log(`[PASS] ${testName}`);
        testsPassed++;
    } else {
        console.error(`[FAIL] ${testName}`);
        testsFailed++;
    }
}

// --------------------------------------------------
// 1. UNIT TESTS: AGE CALCULATION
// --------------------------------------------------
console.log("\n--- Running Age Calculation Tests ---");

const today = new Date();

// Test A: Age today
const dobToday = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
assert(calculateAge(dobToday) === 16, "Should calculate exactly 16 years old today");

// Test B: Almost 16 (one day left)
const dobAlmost16 = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate() + 1);
assert(calculateAge(dobAlmost16) === 15, "Should calculate 15 years old (birthday tomorrow)");

// Test C: Halfway birthday
const dobOlder = new Date(today.getFullYear() - 25, today.getMonth() - 2, today.getDate());
assert(calculateAge(dobOlder) === 25, "Should calculate 25 years old");

// Test D: Minors
const dobMinor = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
assert(calculateAge(dobMinor) === 10, "Should calculate 10 years old");


// --------------------------------------------------
// 2. UNIT TESTS: TUTOR MATCHING ENGINE (RECOMMENDATION)
// --------------------------------------------------
console.log("\n--- Running Tutor Recommendation Weight Tests ---");

// Mock Student Profile
const mockStudent = {
    grade: "Grade 12",
    learningNeeds: "I need help with algebra problems and calculus prep basics",
    languages: ["English", "Amharic"],
    subjects: [
        { needsHelp: true, subject: { name: "Mathematics" } },
        { needsHelp: false, subject: { name: "Physics" } },
    ],
    availability: [
        { dayOfWeek: 1, startTime: "10:00", endTime: "12:00" }, // Monday 10-12
        { dayOfWeek: 3, startTime: "14:00", endTime: "16:00" }, // Wednesday 14-16
    ],
    budget: {
        maxAmount: 250,
        currency: "ETB",
        isFlexible: true,
    }
};

// Mock Tutors
const perfectMatchTutor = {
    bio: "Passionate math precalculus teacher and calculus prep help. Fluent in languages.",
    experienceYears: 10,
    languages: ["English", "Amharic"],
    subjects: [
        {
            gradeLevels: ["Grade 11", "Grade 12"],
            subject: { name: "Mathematics" }
        }
    ],
    availability: [
        { dayOfWeek: 1, startTime: "11:00", endTime: "13:00" }, // Overlaps on Mon 11-12
    ],
    educationRecords: [
        { degree: "B.Sc. Mathematics", institution: "Addis Ababa University" }
    ],
    pricing: [
        { amount: 200, currency: "ETB" }
    ],
    reviews: [
        { rating: 5.0, status: "PUBLISHED" },
        { rating: 4.8, status: "PUBLISHED" }
    ]
};

const poorMatchTutor = {
    bio: "English literature enthusiast.",
    experienceYears: 1,
    languages: ["French"],
    subjects: [
        {
            gradeLevels: ["Grade 5", "Grade 6"],
            subject: { name: "English" }
        }
    ],
    availability: [
        { dayOfWeek: 5, startTime: "09:00", endTime: "11:00" }, // No overlap
    ],
    educationRecords: [],
    pricing: [
        { amount: 500, currency: "ETB" }
    ],
    reviews: []
};

// Test A: High Score Tutor
const perfectResult = calculateTutorScore(mockStudent, perfectMatchTutor);
console.log("Perfect Tutor Score:", perfectResult.score, "/ 100");
console.log("Breakdown:", perfectResult.breakdown);
assert(perfectResult.score >= 80, "Perfect tutor should score high (>= 80)");
assert(perfectResult.breakdown.subject === 100, "Subject compatibility should be 100");
assert(perfectResult.breakdown.grade === 100, "Grade compatibility should be 100");
assert(perfectResult.breakdown.availability === 100, "Availability compatibility should be 100");

// Test B: Low Score Tutor
const poorResult = calculateTutorScore(mockStudent, poorMatchTutor);
console.log("Poor Tutor Score:", poorResult.score, "/ 100");
console.log("Breakdown:", poorResult.breakdown);
assert(poorResult.score < 40, "Indifferent tutor should score low (< 40)");

// Test C: Budget Overlimit Flexible Matching
const flexibleOverlimitTutor = {
    ...perfectMatchTutor,
    pricing: [{ amount: 290, currency: "ETB" }] // budget max = 250, 290 is 16% higher (under 20% flexible threshold)
};
const budgetResult = calculateTutorScore(mockStudent, flexibleOverlimitTutor);
console.log("Flexible Budget match score:", budgetResult.breakdown.budget);
assert(budgetResult.breakdown.budget === 50, "Flexible budget should score 50 (within 20% flexibility limit)");

const strictExorbitantTutor = {
    ...perfectMatchTutor,
    pricing: [{ amount: 350, currency: "ETB" }] // > 20% limit
};
const exorbitantResult = calculateTutorScore(mockStudent, strictExorbitantTutor);
console.log("Strict Exorbitant Budget match score:", exorbitantResult.breakdown.budget);
assert(exorbitantResult.breakdown.budget === 0, "Exorbitant budget should score 0");


// --------------------------------------------------
// SUMMARY OF TEST RESULTS
// --------------------------------------------------
console.log("\n==================================================");
console.log(`TEST RUN COMPLETED. Passed: ${testsPassed}, Failed: ${testsFailed}`);
console.log("==================================================");

if (testsFailed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
