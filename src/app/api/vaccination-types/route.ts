import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const vaccinationTypes = await prisma.vaccinationType.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(vaccinationTypes);
  } catch (error) {
    console.error('Error fetching vaccination types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vaccination types' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
