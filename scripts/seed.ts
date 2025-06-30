// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.vaccinationRecord.deleteMany();
  await prisma.vaccinationType.deleteMany();
  await prisma.pet.deleteMany();

  // Add some vaccination types
  const rabies = await prisma.vaccinationType.create({
    data: { name: 'Rabies', interval: 12 },
  });
  const leptospirosis = await prisma.vaccinationType.create({
    data: { name: 'Leptospirosis', interval: 12 },
  });
  const parvovirus = await prisma.vaccinationType.create({
    data: { name: 'Parvovirus', interval: 12 },
  });
  const kennelCough = await prisma.vaccinationType.create({
    data: { name: 'Kennel Cough', interval: 12 },
  });

  // Add multiple pets with species and breed
  const max = await prisma.pet.create({
    data: {
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      birthDate: new Date('2022-05-10'), // 10/05/2022
      records: {
        create: [
          {
            typeId: rabies.id,
            completedAt: new Date('2025-03-15'), // 15/03/2025 - current
          },
          {
            typeId: leptospirosis.id,
            completedAt: new Date('2024-10-10'), // 10/10/2024 - current
          },
          {
            typeId: parvovirus.id,
            completedAt: new Date('2024-06-30'), // 30/06/2024 - due today (30/06/2025)
          },
          {
            typeId: kennelCough.id,
            completedAt: null, // Never completed - overdue (due 15/06/2025)
          },
        ],
      },
    },
  });

  console.log('✅ Seed complete. Created pets:', max.name,);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
