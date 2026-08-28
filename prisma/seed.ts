
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
    connectionString,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    // ============================================
    // 1. CREATE ADMIN ACCOUNT
    // ============================================

    const passwordHash = await bcrypt.hash(
        "Admin@123456",
        12
    );

    const admin = await prisma.user.upsert({
        where: {
            email: "admin@learnbridge.com",
        },

        update: {
            role: "ADMIN",
            status: "ACTIVE",
            passwordHash,
        },

        create: {
            email: "admin@learnbridge.com",
            passwordHash,
            role: "ADMIN",
            status: "ACTIVE",
        },
    });

    console.log(
        "Admin created:",
        admin.email
    );

    // ============================================
    // 2. CREATE SUBJECTS
    // ============================================

    const subjects = [
        {
            name: "Mathematics",
            description:
                "Mathematics and problem solving",
        },
        {
            name: "Physics",
            description:
                "Physics and physical sciences",
        },
        {
            name: "Chemistry",
            description:
                "Chemistry and chemical sciences",
        },
        {
            name: "Biology",
            description:
                "Biology and life sciences",
        },
        {
            name: "English",
            description:
                "English language and communication",
        },
        {
            name: "Computer Science",
            description:
                "Computer science and computing",
        },
        {
            name: "Programming",
            description:
                "Programming and software development",
        },
        {
            name: "Accounting",
            description:
                "Accounting and financial fundamentals",
        },
        {
            name: "Business",
            description:
                "Business and management",
        },
        {
            name: "Economics",
            description:
                "Economics and economic theory",
        },
    ];

    for (const subject of subjects) {
        await prisma.subject.upsert({
            where: {
                name: subject.name,
            },

            update: {
                description:
                    subject.description,
            },

            create: subject,
        });
    }

    console.log(
        "Subjects seeded successfully."
    );
}

main()
    .catch((error) => {
        console.error(
            "Seed failed:",
            error
        );

        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

