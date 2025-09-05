import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || 20)));
    const skip = (page - 1) * pageSize;
    
    const [items, total] = await Promise.all([
      prisma.region.findMany({ 
        orderBy: [{ order: "asc" }, { createdAt: "asc" }], 
        skip, 
        take: pageSize,
        include: {
          _count: {
            select: { Destinations: true }
          }
        }
      }),
      prisma.region.count(),
    ]);
    
    return NextResponse.json({ items, page, pageSize, total });
  } catch (e) {
    console.error("Failed to fetch regions:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const form = await req.formData();
  const key = String(form.get("key") ?? "").trim();
  const nameVi = String(form.get("nameVi") ?? "").trim();
  const nameEn = String(form.get("nameEn") ?? "").trim();
  const descriptionVi = String(form.get("descriptionVi") ?? "").trim();
  const descriptionEn = String(form.get("descriptionEn") ?? "").trim();
  const image = String(form.get("image") ?? "").trim();
  const order = Number(form.get("order") ?? 0) || 0;

  try {
    const missing: string[] = [];
    if (!key) missing.push("key");
    if (!nameVi) missing.push("nameVi");
    if (!nameEn) missing.push("nameEn");
    
    if (missing.length > 0) {
      return NextResponse.json(
        { ok: false, error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    const created = await prisma.region.create({
      data: { 
        key, 
        nameVi, 
        nameEn, 
        descriptionVi: descriptionVi || null, 
        descriptionEn: descriptionEn || null, 
        image: image || null, 
        order 
      },
    });
    
    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    const err = e as { code?: string; meta?: { target?: string[] } } | Error;
    const isP2002 = typeof err === 'object' && 'code' in err && (err as any).code === 'P2002';
    const target = isP2002 ? ((err as { meta?: { target?: string[] } }).meta?.target ?? []).join(", ") : undefined;
    const msg = isP2002 ? `Duplicate value for unique field(s): ${target || "unknown"}` : (err instanceof Error ? err.message : String(e));
    
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
