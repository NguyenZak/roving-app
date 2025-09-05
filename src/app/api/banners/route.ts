import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/banners - Lấy danh sách banner cho frontend
export async function GET(request: NextRequest) {
  try {
    // Lấy tất cả banner đang hoạt động, sắp xếp theo thứ tự
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
