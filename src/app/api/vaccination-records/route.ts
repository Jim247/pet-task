/**
 * Vaccination Records API Route
 * 
 * POST /api/vaccination-records
 * Creates new vaccination records when users add vaccinations via the modal.
 * Validates input data and creates properly linked database records.
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST handler - Creates a new vaccination record
 * 
 * Expected request body:
 * {
 *   petId: number,
 *   typeId: number, 
 *   completedAt: string (ISO date)
 * }
 * 
 * @param request - Next.js request object containing the vaccination data
 * @returns Created vaccination record with related type information
 */

export async function POST(request: NextRequest) {
  try {
    const { petId, typeId, completedAt } = await request.json();

    if (!petId || !typeId || !completedAt) {
      return NextResponse.json(
        { error: 'Missing required fields: petId, typeId, or completedAt' },
        { status: 400 }
      );
    }

    const newRecord = await prisma.vaccinationRecord.create({
      data: {
        petId: parseInt(petId),
        typeId: parseInt(typeId),
        completedAt: new Date(completedAt),
      },
      include: {
        type: true,
      },
    });

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error('Error creating vaccination record:', error);
    return NextResponse.json(
      { error: 'Failed to create vaccination record' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
