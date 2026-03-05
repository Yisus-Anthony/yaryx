require("dotenv").config({ path: ".env.local" });

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const { products } = require("../src/data/products");

const url = (process.env.DATABASE_URL || "").trim();
if (!url) throw new Error("DATABASE_URL no está definida en .env.local");

const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false }, // Neon requiere TLS
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("SEED START", { count: products.length });

    for (const p of products) {
        await prisma.product.upsert({
            where: { slug: String(p.slug).toLowerCase() },
            update: {
                name: p.name,
                folder: p.folder,
                coverPublicId: p.coverPublicId,
                condition: String(p.condition).toLowerCase(),
                category: String(p.category).toLowerCase(),
                price: Number(p.price),
            },
            create: {
                slug: String(p.slug).toLowerCase(),
                name: p.name,
                folder: p.folder,
                coverPublicId: p.coverPublicId,
                condition: String(p.condition).toLowerCase(),
                category: String(p.category).toLowerCase(),
                price: Number(p.price),
            },
        });
    }

    console.log("✅ Seed listo");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });