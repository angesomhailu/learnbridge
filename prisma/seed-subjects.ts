import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
    adapter,
});

const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Amharic",
    "Tigrinya",
    "Computer Science",
    "Programming",
    "Software Engineering",
    "Business",
    "Accounting",
    "Economics",
];

async function main() {
    for (const name of subjects) {
        await prisma.subject.upsert({
            where: {
                name,
            },
            update: {},
            create: {
                name,
            },
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