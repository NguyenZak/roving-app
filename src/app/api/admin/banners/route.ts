import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

// GET /api/admin/banners - Lấy danh sách banner
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * pageSize;

    // Xây dựng điều kiện tìm kiếm với kiểu Prisma
    const where: Prisma.BannerWhereInput | undefined = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { subtitle: { contains: search, mode: 'insensitive' } },
            { alt: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined;

    // Lấy tổng số banner
    const total = await prisma.banner.count({ where });

    // Lấy danh sách banner
    const banners = await prisma.banner.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      skip,
      take: pageSize,
    });

    return NextResponse.json({
      banners,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/banners - Tạo banner mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, image, alt, type, videoUrl, youtubeUrl, poster, order, isActive } = body;

    // Validation
    if (!title || !image || !alt) {
      return NextResponse.json(
        { error: 'Title, image và alt là bắt buộc' },
        { status: 400 }
      );
    }

    // Tạo banner mới
    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        image,
        alt,
        type: type || 'image',
        videoUrl,
        youtubeUrl,
        poster,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
