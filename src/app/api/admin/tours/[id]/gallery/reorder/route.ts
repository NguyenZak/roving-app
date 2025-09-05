import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Reorder gallery images
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

    const { galleryIds } = data;

    if (!Array.isArray(galleryIds)) {
      return NextResponse.json({ error: "galleryIds must be an array" }, { status: 400 });
    }

    // Verify all gallery images belong to this tour
    const existingImages = await (prisma as any).tourGallery.findMany({
      where: { 
        id: { in: galleryIds as string[] },
        tourId: id 
      }
    });

    if (existingImages.length !== galleryIds.length) {
      return NextResponse.json({ error: "Some gallery images not found or don't belong to this tour" }, { status: 400 });
    }

    // Update the order for each gallery image
    const updatePromises = galleryIds.map((galleryId: string, index: number) => 
      (prisma as any).tourGallery.update({
        where: { id: galleryId },
        data: { order: index }
      })
    );

    await Promise.all(updatePromises);

    // Return updated gallery images
    const updatedGallery = await (prisma as any).tourGallery.findMany({
      where: { tourId: id },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({ ok: true, gallery: updatedGallery });
  } catch (e) {
    console.error("POST reorder gallery error:", e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
