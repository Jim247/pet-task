import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function PATCH(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split('/').pop() || '');
    const body = await request.json();
    
    const updatedRecord = await prisma.vaccinationRecord.update({
      where: { id },
      data: {
        completedAt: new Date(body.completedAt),
      },
      include: {
        type: true,
      },
    });

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error('Error updating vaccination record:', error);
    return NextResponse.json(
      { error: 'Failed to update vaccination record' },
      { status: 500 }
    );
  }
}
