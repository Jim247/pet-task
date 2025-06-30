// scripts/check-prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const types = await prisma.vaccinationType.findMany();
  console.log(types);
}

main().finally(() => prisma.$disconnect());
