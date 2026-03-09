require("dotenv").config({ path: ".env.local" });

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seed started");

    // Verifica que la conexión funcione
    await prisma.$queryRaw`SELECT 1`;

    console.log("✅ Database connection OK");
    console.log("✅ No seed data required");
}

main()
    .catch(async (error) => {
        console.error("❌ Seed failed");
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });