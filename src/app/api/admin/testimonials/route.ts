import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

// GET /api/admin/testimonials - list testimonials with paging/search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * pageSize;

    const where: Prisma.TestimonialWhereInput | undefined = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } },
            { tour: { contains: search, mode: 'insensitive' } },
            { comment: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined;

    const total = await prisma.testimonial.count({ where });

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      skip,
      take: pageSize,
    });

    return NextResponse.json({
      testimonials,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/testimonials - create testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, location, rating, comment, avatar, tour, isActive, order } = body;

    if (!name || !comment) {
      return NextResponse.json({ error: 'Name và comment là bắt buộc' }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        location,
        rating: typeof rating === 'number' ? Math.max(1, Math.min(5, rating)) : 5,
        comment,
        avatar,
        tour,
        isActive: typeof isActive === 'boolean' ? isActive : true,
        order: typeof order === 'number' ? order : 0,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


