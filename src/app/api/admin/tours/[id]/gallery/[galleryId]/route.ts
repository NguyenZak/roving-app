import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get a specific gallery image
export async function GET(req: NextRequest, context: { params: Promise<{ id: string; galleryId: string }> }) {
  const { id, galleryId } = await context.params;
  try {
    const galleryImage = await (prisma as any).tourGallery.findFirst({
      where: { 
        id: galleryId,
        tourId: id 
      }
    });
    
    if (!galleryImage) {
      return NextResponse.json({ error: "Gallery image not found" }, { status: 404 });
    }
    
    return NextResponse.json({ ok: true, galleryImage });
  } catch (e) {
    console.error("GET gallery image error:", e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PATCH - Update a specific gallery image
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string; galleryId: string }> }) {
  const { id, galleryId } = await context.params;
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

    // Check if gallery image exists and belongs to the tour
    const existingImage = await (prisma as any).tourGallery.findFirst({
      where: { 
        id: galleryId,
        tourId: id 
      }
    });

    if (!existingImage) {
      return NextResponse.json({ error: "Gallery image not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl as string;
    if (alt !== undefined) updateData.alt = alt as string || null;
    if (caption !== undefined) updateData.caption = caption as string || null;
    if (order !== undefined) updateData.order = Number(order) || 0;

    const galleryImage = await (prisma as any).tourGallery.update({
      where: { id: galleryId },
      data: updateData
    });

    return NextResponse.json({ ok: true, galleryImage });
  } catch (e) {
    console.error("PATCH gallery image error:", e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE - Delete a specific gallery image
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string; galleryId: string }> }) {
  const { id, galleryId } = await context.params;
  try {
    // Check if gallery image exists and belongs to the tour
    const existingImage = await (prisma as any).tourGallery.findFirst({
      where: { 
        id: galleryId,
        tourId: id 
      }
    });

    if (!existingImage) {
      return NextResponse.json({ error: "Gallery image not found" }, { status: 404 });
    }

    await (prisma as any).tourGallery.delete({
      where: { id: galleryId }
    });

    return NextResponse.json({ ok: true, message: "Gallery image deleted successfully" });
  } catch (e) {
    console.error("DELETE gallery image error:", e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
