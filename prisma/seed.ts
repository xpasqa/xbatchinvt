import { config } from "dotenv";

// Load .env.local before reading process.env — required for tsx direct execution
config({ path: ".env.local" });

import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL tidak ditemukan. Pastikan .env.local sudah tersedia.",
  );
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const PASSWORD_ROUNDS = 10;

const demoUsers = [
  {
    name: "Owner Demo",
    email: "owner@ballfashion.demo",
    role: UserRole.OWNER,
    password: "Demo12345!",
  },
  {
    name: "Admin Inventory Demo",
    email: "admin@ballfashion.demo",
    role: UserRole.ADMIN_INVENTORY,
    password: "Demo12345!",
  },
  {
    name: "Admin Gudang Demo",
    email: "warehouse@ballfashion.demo",
    role: UserRole.ADMIN_WAREHOUSE,
    password: "Demo12345!",
  },
] as const;

const demoWarehouses = [
  {
    code: "GUD-SORTIR",
    name: "Gudang Sortir",
  },
  {
    code: "GUD-RETAIL",
    name: "Gudang Retail",
  },
  {
    code: "GUD-GROSIR",
    name: "Gudang Grosir",
  },
] as const;

async function cleanupLegacyUsers() {
  // Remove any record created with the incorrect typo domain (balfashion vs ballfashion)
  await prisma.user.deleteMany({
    where: {
      email: "owner@balfashion.demo",
    },
  });
}

async function seedUsers() {
  for (const user of demoUsers) {
    const passwordHash = await bcrypt.hash(user.password, PASSWORD_ROUNDS);
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        name: user.name,
        passwordHash,
        role: user.role,
        isActive: true,
      },
      create: {
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
        isActive: true,
      },
    });
  }
}

async function seedWarehouses() {
  for (const warehouse of demoWarehouses) {
    await prisma.warehouse.upsert({
      where: {
        code: warehouse.code,
      },
      update: {
        name: warehouse.name,
        isActive: true,
      },
      create: {
        code: warehouse.code,
        name: warehouse.name,
        isActive: true,
      },
    });
  }
}

async function main() {
  await cleanupLegacyUsers();
  await seedUsers();
  await seedWarehouses();
  console.log("Seed completed successfully.");
  console.log("Demo users: 3");
  console.log("Warehouses: 3");
}

main()
  .catch((error: unknown) => {
    console.error("Seed gagal dijalankan.");
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
