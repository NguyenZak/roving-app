import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/testimonials - public list (active only), ordered
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('Error fetching public testimonials:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


