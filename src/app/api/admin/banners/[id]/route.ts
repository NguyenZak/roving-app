import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/banners/[id] - Lấy thông tin banner theo ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const banner = await (prisma as any).banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/banners/[id] - Cập nhật banner
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { title, subtitle, image, alt, type, videoUrl, youtubeUrl, poster, order, isActive } = body;

    // Kiểm tra banner có tồn tại không
    const existingBanner = await (prisma as any).banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return NextResponse.json(
        { error: 'Banner không tồn tại' },
        { status: 404 }
      );
    }

    // Cập nhật banner
    const updatedBanner = await (prisma as any).banner.update({
      where: { id },
      data: {
        title,
        subtitle,
        image,
        alt,
        type,
        videoUrl,
        youtubeUrl,
        poster,
        order,
        isActive,
      },
    });

    return NextResponse.json(updatedBanner);
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/banners/[id] - Xóa banner
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    // Kiểm tra banner có tồn tại không
    const existingBanner = await (prisma as any).banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return NextResponse.json(
        { error: 'Banner không tồn tại' },
        { status: 404 }
      );
    }

    // Xóa banner
    await (prisma as any).banner.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Banner đã được xóa thành công' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
