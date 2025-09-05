import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: { key: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const region = await prisma.region.findUnique({
      where: { key: params.key },
      include: {
        Destinations: {
          orderBy: [{ order: "asc" }, { nameEn: "asc" }],
          select: {
            id: true,
            nameVi: true,
            nameEn: true,
            image: true,
            slug: true,
            isFeatured: true,
            order: true,
          }
        }
      }
    });
    
    if (!region) {
      return NextResponse.json({ error: "Region not found" }, { status: 404 });
    }
    
    return NextResponse.json({ region });
  } catch (e) {
    console.error("Failed to fetch region:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { key: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const form = await req.formData();
  const method = form.get("_method") as string;
  
  if (method === "DELETE") {
    return DELETE(req, { params });
  }
  
  // Handle PATCH/UPDATE
  const nameVi = String(form.get("nameVi") ?? "").trim();
  const nameEn = String(form.get("nameEn") ?? "").trim();
  const descriptionVi = String(form.get("descriptionVi") ?? "").trim();
  const descriptionEn = String(form.get("descriptionEn") ?? "").trim();
  const image = String(form.get("image") ?? "").trim();
  const order = Number(form.get("order") ?? 0) || 0;

  try {
    const missing: string[] = [];
    if (!nameVi) missing.push("nameVi");
    if (!nameEn) missing.push("nameEn");
    
    if (missing.length > 0) {
      return NextResponse.json(
        { ok: false, error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    const updated = await prisma.region.update({
      where: { key: params.key },
      data: { 
        nameVi, 
        nameEn, 
        descriptionVi: descriptionVi || null, 
        descriptionEn: descriptionEn || null, 
        image: image || null, 
        order 
      },
    });
    
    return NextResponse.json({ ok: true, id: updated.id });
  } catch (e) {
    if (e instanceof Error && e.message.includes("Record to update not found")) {
      return NextResponse.json({ ok: false, error: "Region not found" }, { status: 404 });
    }
    
    console.error("Failed to update region:", e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

async function DELETE(
  req: Request,
  { params }: { params: { key: string } }
) {
  try {
    // Check if region has destinations
    const regionWithDestinations = await prisma.region.findUnique({
      where: { key: params.key },
      include: { _count: { select: { Destinations: true } } }
    });
    
    if (!regionWithDestinations) {
      return NextResponse.json({ ok: false, error: "Region not found" }, { status: 404 });
    }
    
    if (regionWithDestinations._count.Destinations > 0) {
      return NextResponse.json({ 
        ok: false, 
        error: `Cannot delete region with ${regionWithDestinations._count.Destinations} destinations. Please remove or reassign destinations first.` 
      }, { status: 400 });
    }
    
    await prisma.region.delete({
      where: { key: params.key }
    });
    
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Failed to delete region:", e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
