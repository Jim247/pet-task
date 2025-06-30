// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.vaccinationRecord.deleteMany();
  await prisma.vaccinationType.deleteMany();
  await prisma.pet.deleteMany();

  // Add some vaccination types
  const distemper = await prisma.vaccinationType.create({
    data: { name: 'Distemper', interval: 12 },
  });
  const rabies = await prisma.vaccinationType.create({
    data: { name: 'Rabies', interval: 12 },
  });
  const fvrcp = await prisma.vaccinationType.create({
    data: { name: 'FVRCP', interval: 12 },
  });

  // Add multiple pets with species and breed
  const max = await prisma.pet.create({
    data: {
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      birthDate: new Date('2022-05-10'),
      records: {
        create: [
          {
            typeId: distemper.id,
            completedAt: new Date('2024-07-15'), // 15/07/2024
          },
          {
            typeId: rabies.id,
            completedAt: new Date('2024-01-20'), // 20/01/2024
          },
        ],
      },
    },
  });

  const luna = await prisma.pet.create({
    data: {
      name: 'Luna',
      species: 'Cat',
      breed: 'Siamese',
      birthDate: new Date('2021-03-20'),
      records: {
        create: [
          {
            typeId: fvrcp.id,
            completedAt: new Date('2024-03-25'), // 25/03/2024
          },
          {
            typeId: rabies.id,
            completedAt: null, // Pending vaccination
          },
        ],
      },
    },
  });

  const buddy = await prisma.pet.create({
    data: {
      name: 'Buddy',
      species: 'Dog',
      breed: 'Mixed Breed',
      birthDate: new Date('2020-08-15'),
      records: {
        create: [
          {
            typeId: distemper.id,
            completedAt: new Date('2023-08-15'), // 15/08/2023 (overdue)
          },
          {
            typeId: rabies.id,
            completedAt: new Date('2023-08-15'), // 15/08/2023 (overdue)
          },
        ],
      },
    },
  });

  console.log('✅ Seed complete. Created pets:', max.name, luna.name, buddy.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
