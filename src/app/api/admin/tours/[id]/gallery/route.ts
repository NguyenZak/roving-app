import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get all gallery images for a tour
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const galleryImages = await (prisma as any).tourGallery.findMany({
      where: { tourId: id },
      orderBy: { order: 'asc' }
    });
    
    return NextResponse.json({ ok: true, gallery: galleryImages });
  } catch (e) {
    console.error("GET gallery error:", e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST - Add a new gallery image to a tour
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const contentType = req.headers.get("content-type") || "";
    let data: Record<string, unknown> = {};
    
    if (contentType.includes("application/json")) {
      data = await req.json();
    } else {
      const form = await req.formData();
      data = Object.fromEntries(form.entries());
    }

    const { imageUrl, alt, caption, order } = data;

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    // Get the next order if not provided
    let imageOrder = order ? Number(order) : 0;
    if (!imageOrder || isNaN(imageOrder)) {
      const lastImage = await (prisma as any).tourGallery.findFirst({
        where: { tourId: id },
        orderBy: { order: 'desc' }
      });
      imageOrder = lastImage ? lastImage.order + 1 : 0;
    }

    const galleryImage = await (prisma as any).tourGallery.create({
      data: {
        tourId: id,
        imageUrl: imageUrl as string,
        alt: alt as string || null,
        caption: caption as string || null,
        order: imageOrder
      }
    });

    return NextResponse.json({ ok: true, galleryImage });
  } catch (e) {
    console.error("POST gallery error:", e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
