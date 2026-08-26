import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

console.log(
    "DATABASE_URL exists:",
    Boolean(process.env.DATABASE_URL)
);
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
    adapter,
});

const subjects = [
    {
        name: "Mathematics",
        description: "Mathematics and problem solving",
    },
    {
        name: "Physics",
        description: "Physics and physical sciences",
    },
    {
        name: "Chemistry",
        description: "Chemistry and chemical sciences",
    },
    {
        name: "Biology",
        description: "Biology and life sciences",
    },
    {
        name: "English",
        description: "English language and communication",
    },
    {
        name: "Computer Science",
        description: "Computer science and computing",
    },
    {
        name: "Programming",
        description: "Programming and software development",
    },
    {
        name: "Accounting",
        description: "Accounting and financial fundamentals",
    },
    {
        name: "Business",
        description: "Business and management",
    },
    {
        name: "Economics",
        description: "Economics and economic theory",
    },
];

async function main() {
    for (const subject of subjects) {
        await prisma.subject.upsert({
            where: {
                name: subject.name,
            },
            update: {
                description: subject.description,
            },
            create: subject,
        });
    }

    console.log("Subjects seeded successfully.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });