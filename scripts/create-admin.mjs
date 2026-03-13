import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Administrador";

  if (!email) throw new Error("Falta ADMIN_EMAIL en .env.local");
  if (!password) throw new Error("Falta ADMIN_PASSWORD en .env.local");

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "ADMIN",
      isActive: true,
      name,
    },
    create: {
      email,
      passwordHash,
      role: "ADMIN",
      isActive: true,
      name,
    },
  });

  console.log("Admin listo:", user.email);
}

main()
  .catch((error) => {
    console.error("Error creando admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });