import { calculateAge } from "./utils/age";

export interface RecommendationResult {
    score: number;
    breakdown: {
        subject: number;
        grade: number;
        availability: number;
        qualification: number;
        experience: number;
        budget: number;
        language: number;
        rating: number;
        learningNeeds: number;
    };
    explanations: string[];
}

/**
 * Utility to convert Decimal or string to number safely.
 */
function toNumber(val: any): number {
    if (val === null || val === undefined) return 0;
    if (typeof val === "number") return val;
    return Number(val.toString()) || 0;
}

/**
 * Calculate the compatibility score between a Student and a Tutor.
 * Weights:
 * - Subject compatibility: 25%
 * - Grade compatibility: 15%
 * - Availability: 15%
 * - Qualification: 10%
 * - Teaching experience: 10%
 * - Budget compatibility: 10%
 * - Language compatibility: 5%
 * - Tutor rating: 5%
 * - Learning needs: 5%
 */
export function calculateTutorScore(student: any, tutor: any): RecommendationResult {
    const explanations: string[] = [];

    // 1. Subject compatibility (25%) -> match if student needs help in a subject that the tutor teaches
    let subjectMatch = 0;
    const studentHelpSubjects = student.subjects?.filter((s: any) => s.needsHelp) || [];
    const tutorSubjectNames = new Set(tutor.subjects?.map((s: any) => s.subject.name.toLowerCase()) || []);

    if (studentHelpSubjects.length > 0) {
        let matchingSubjectsCount = 0;
        studentHelpSubjects.forEach((ss: any) => {
            if (tutorSubjectNames.has(ss.subject.name.toLowerCase())) {
                matchingSubjectsCount++;
            }
        });
        subjectMatch = matchingSubjectsCount > 0 ? 100 : 0;
        if (matchingSubjectsCount > 0) {
            explanations.push(`Teaches ${matchingSubjectsCount} subject(s) you need help with.`);
        } else {
            explanations.push("Does not teach any subjects you listed as needing help with.");
        }
    } else {
        // Fallback: check any subject match if no specific help needs
        const studentAllSubjects = student.subjects?.map((s: any) => s.subject.name.toLowerCase()) || [];
        const common = studentAllSubjects.filter((name: string) => tutorSubjectNames.has(name));
        subjectMatch = common.length > 0 ? 80 : 50; // default 50% if no subject specified
        if (common.length > 0) {
            explanations.push(`Teaches subjects that match your interest areas.`);
        } else {
            explanations.push("Subject match is undefined (no common subjects selected yet).");
        }
    }

    // 2. Grade compatibility (15%) -> matches if tutor supports student's grade level
    let gradeMatch = 0;
    const studentGrade = (student.grade || "").toLowerCase().trim();
    if (studentGrade && tutor.subjects) {
        let matchesGrade = false;
        tutor.subjects.forEach((ts: any) => {
            if (ts.gradeLevels && Array.isArray(ts.gradeLevels)) {
                if (ts.gradeLevels.some((gl: string) => gl.toLowerCase().trim() === studentGrade)) {
                    matchesGrade = true;
                }
            }
        });
        gradeMatch = matchesGrade ? 100 : 0;
        if (matchesGrade) {
            explanations.push(`Fully supports your grade level: "${student.grade}".`);
        } else {
            explanations.push(`Does not list student's grade level "${student.grade}" as supported.`);
        }
    } else {
        gradeMatch = 50; // default
        explanations.push("Grade compatibility is neutral (grade not configured on student profile).");
    }

    // 3. Availability compatibility (15%) -> checks for scheduling overlaps
    let availabilityMatch = 0;
    const studentSlots = student.availability || [];
    const tutorSlots = tutor.availability || [];
    if (studentSlots.length > 0 && tutorSlots.length > 0) {
        let overlaps = 0;
        studentSlots.forEach((ss: any) => {
            tutorSlots.forEach((ts: any) => {
                if (ss.dayOfWeek === ts.dayOfWeek) {
                    // Check time overlap: convert start/end to minutes
                    const getMinutes = (timeStr: string) => {
                        const [h, m] = timeStr.split(":").map(Number);
                        return h * 60 + m;
                    };
                    const ssStart = getMinutes(ss.startTime);
                    const ssEnd = getMinutes(ss.endTime);
                    const tsStart = getMinutes(ts.startTime);
                    const tsEnd = getMinutes(ts.endTime);

                    if (ssStart < tsEnd && tsStart < ssEnd) {
                        overlaps++;
                    }
                }
            });
        });
        availabilityMatch = overlaps > 0 ? 100 : 0;
        if (overlaps > 0) {
            explanations.push(`Has overlapping availability slot(s) matching your schedule.`);
        } else {
            explanations.push("Schedule mismatch: no overlapping time slots identified.");
        }
    } else {
        availabilityMatch = 50; // default
        explanations.push("Schedule overlap is neutral (please configure availability on both profiles).");
    }

    // 4. Qualification (10%) -> relevance of degrees and certificates
    let qualificationScore = 0;
    const records = tutor.educationRecords || [];
    if (records.length > 0) {
        qualificationScore = 100;
        const mainDegree = records[0].degree;
        explanations.push(`Holds verified degree: "${mainDegree}" from ${records[0].institution}.`);
    } else {
        qualificationScore = 0;
        explanations.push("No education qualifications registered on profile yet.");
    }

    // 5. Teaching Experience (10%)
    const expYears = tutor.experienceYears ?? 0;
    const experienceScore = Math.min(100, expYears * 10); // 10 years = 100%
    if (expYears > 0) {
        explanations.push(`Possesses ${expYears} year(s) of active teaching experience.`);
    } else {
        explanations.push("Tutor has no teaching experience years listed.");
    }

    // 6. Budget compatibility (10%) -> strict or flexible matching
    let budgetScore = 0;
    const studentBudget = student.budget;
    const tutorPricing = tutor.pricing?.[0]; // take the primary pricing

    if (studentBudget && tutorPricing) {
        const sMax = toNumber(studentBudget.maxAmount);
        const tPrice = toNumber(tutorPricing.amount);

        // Normalize comparison by calculating rate (adjust duration to match if needed)
        // Assume period/duration: standardizing rates is helpful, but simpler form:
        // if period/rates exist directly, match price with budget.
        if (tPrice <= sMax) {
            budgetScore = 100;
            explanations.push(`Affordable option: rate is within your defined budget limit.`);
        } else if (studentBudget.isFlexible && tPrice <= (sMax * 1.2)) {
            // Price is up to 20% over budget but student budget is flexible
            budgetScore = 50;
            explanations.push(`Slightly above budget (within 20%), but matches your flexible preference.`);
        } else {
            budgetScore = 0;
            explanations.push(`Exceeds your budget budget (${tutorPricing.currency} ${tPrice} vs your max of ${studentBudget.currency} ${sMax}).`);
        }
    } else {
        budgetScore = 70; // default
        explanations.push("Budget compatibility is neutral (budget/pricing not fully filled).");
    }

    // 7. Language compatibility (5%)
    let languageScore = 0;
    const sLangs = student.languages || [];
    const tLangs = tutor.languages || [];
    if (sLangs.length > 0 && tLangs.length > 0) {
        const commonLangs = sLangs.filter((l: string) => tLangs.some((tl: string) => tl.toLowerCase().trim() === l.toLowerCase().trim()));
        languageScore = commonLangs.length > 0 ? 100 : 0;
        if (commonLangs.length > 0) {
            explanations.push(`Shares instruction language(s): ${commonLangs.join(", ")}.`);
        } else {
            explanations.push("No overlapping languages registered.");
        }
    } else {
        languageScore = 50; // default
        explanations.push("Language compatibility is neutral.");
    }

    // 8. Tutor Rating/Reputation (5%)
    let ratingScore = 80; // default to 80 (4.0 out of 5 stars) for new tutors
    const reviews = tutor.reviews || [];
    if (reviews.length > 0) {
        const verifiedReviews = reviews.filter((r: any) => r.status === "PUBLISHED" || r.status === "PENDING" || !r.status);
        if (verifiedReviews.length > 0) {
            const avgRating = verifiedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / verifiedReviews.length;
            ratingScore = (avgRating / 5.0) * 100;
            explanations.push(`Has an average rating of ${avgRating.toFixed(1)}/5 stars from ${verifiedReviews.length} review(s).`);
        } else {
            explanations.push("New tutor with no reviews given yet.");
        }
    } else {
        explanations.push("New tutor with no reviews given yet.");
    }

    // 9. Learning Needs Compatibility (5%)
    let needsScore = 0;
    const sNeeds = (student.learningNeeds || "").toLowerCase().trim();
    const tBio = (tutor.bio || "").toLowerCase().trim();

    // Simple text matching for learning goals / needs inside biography keywords
    if (sNeeds) {
        const keywords = sNeeds.split(/\s+/).filter((w: string) => w.length > 3);
        let matchCount = 0;
        keywords.forEach((word: string) => {
            if (tBio.includes(word)) {
                matchCount++;
            }
        });

        needsScore = matchCount > 0 ? 100 : 30;
        if (matchCount > 0) {
            needsScore = 100;
            explanations.push("Tutor profile matches detail words from your specified learning needs.");
        } else {
            explanations.push("No key words in learning needs found in tutor biography.");
        }
    } else {
        needsScore = 50;
        explanations.push("Learning needs are neutral (none specified on profile).");
    }

    // Total Weight Calculation
    // weights: subject 25%, grade 15%, availability 15%, qualification 10%, experience 10%, budget 10%, language 5%, rating 5%, learningNeeds 5%
    const totalScore = (
        (subjectMatch * 0.25) +
        (gradeMatch * 0.15) +
        (availabilityMatch * 0.15) +
        (qualificationScore * 0.10) +
        (experienceScore * 0.10) +
        (budgetScore * 0.10) +
        (languageScore * 0.05) +
        (ratingScore * 0.05) +
        (needsScore * 0.05)
    );

    return {
        score: Math.round(totalScore),
        breakdown: {
            subject: subjectMatch,
            grade: gradeMatch,
            availability: availabilityMatch,
            qualification: qualificationScore,
            experience: experienceScore,
            budget: budgetScore,
            language: languageScore,
            rating: ratingScore,
            learningNeeds: needsScore,
        },
        explanations,
    };
}
