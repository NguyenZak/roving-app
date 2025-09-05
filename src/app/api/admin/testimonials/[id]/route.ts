import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/testimonials/[id]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const testimonial = await (prisma as any).testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      return NextResponse.json({ error: 'Không tìm thấy testimonial' }, { status: 404 });
    }
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/testimonials/[id]
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const existing = await (prisma as any).testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Không tìm thấy testimonial' }, { status: 404 });
    }

    const updated = await (prisma as any).testimonial.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        location: body.location ?? existing.location,
        rating: typeof body.rating === 'number' ? Math.max(1, Math.min(5, body.rating)) : existing.rating,
        comment: body.comment ?? existing.comment,
        avatar: body.avatar ?? existing.avatar,
        tour: body.tour ?? existing.tour,
        isActive: typeof body.isActive === 'boolean' ? body.isActive : existing.isActive,
        order: typeof body.order === 'number' ? body.order : existing.order,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/testimonials/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const existing = await (prisma as any).testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Không tìm thấy testimonial' }, { status: 404 });
    }

    await (prisma as any).testimonial.delete({ where: { id } });
    return NextResponse.json({ message: 'Đã xóa testimonial' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


