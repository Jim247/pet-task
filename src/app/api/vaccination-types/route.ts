/**
 * Vaccination Types API Route
 * 
 * GET /api/vaccination-types
 * Returns all available vaccination types for the dropdown in the add modal.
 * Used to dynamically populate vaccination options based on database content.
 */

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET handler - Fetches all vaccination types
 * @returns JSON array of vaccination types with id and name
 */

export async function GET() {
  try {
    // Fetch all vaccination types, selecting only needed fields
    const vaccinationTypes = await prisma.vaccinationType.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc', // Alphabetical order for better UX
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
    // Always disconnect Prisma client to prevent connection leaks
    await prisma.$disconnect();
  }
}
