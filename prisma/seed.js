require("dotenv").config({ path: ".env.local" });

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seed started");

    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection OK");

    const categories = [
        { name: "Sensores", slug: "sensores" },
        { name: "Alternadores", slug: "alternadores" },
        { name: "Marchas", slug: "marchas" },
        { name: "Componentes", slug: "componentes" },
        { name: "Otros", slug: "otros" },
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: {
                name: category.name,
                isActive: true,
            },
            create: {
                name: category.name,
                slug: category.slug,
                isActive: true,
            },
        });
    }

    console.log("✅ Categories seeded");
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