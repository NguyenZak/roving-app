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
      prisma.destination.findMany({ orderBy: [{ createdAt: "desc" }], skip, take: pageSize }),
      prisma.destination.count(),
    ]);
    return NextResponse.json({ items, page, pageSize, total });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  const region = String(form.get("region") ?? "").trim();
  const regionId = String(form.get("regionId") ?? "").trim();
  const nameVi = String(form.get("nameVi") ?? "").trim();
  const nameEn = String(form.get("nameEn") ?? "").trim();
  const descriptionVi = String(form.get("descriptionVi") ?? "").trim();
  const descriptionEn = String(form.get("descriptionEn") ?? "").trim();
  const image = String(form.get("image") ?? "").trim();
  const imagesRaw = String(form.get("images") ?? "").trim();
  const images = imagesRaw
    ? imagesRaw
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    : [];
  console.log('[DESTINATIONS POST] images parsed:', images);
  const alt = String(form.get("alt") ?? "").trim();
  const isFeatured = form.get("isFeatured") ? true : false;
  const order = Number(form.get("order") ?? 0) || 0;
  const slug = nameEn.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  try {
    const missing: string[] = [];
    if (!region && !regionId) missing.push("region|regionId");
    if (!nameVi) missing.push("nameVi");
    if (!nameEn) missing.push("nameEn");
    if (!image) missing.push("image");
    if (!alt) missing.push("alt");
    if (!slug) missing.push("slug (derived from nameEn)");
    if (missing.length > 0) {
      return NextResponse.json(
        { ok: false, error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }
    const created = await prisma.destination.create({
      data: { region, regionId: regionId || null, nameVi, nameEn, descriptionVi: descriptionVi || null, descriptionEn: descriptionEn || null, image, images, alt, slug, isFeatured, order },
    });
    console.log('[DESTINATIONS POST] created id:', created.id, 'images count:', created.images.length);
    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    const err = e as { code?: string; meta?: { target?: string[] } } | Error;
    const isP2002 = typeof err === 'object' && 'code' in err && (err as any).code === 'P2002';
    const target = isP2002 ? ((err as { meta?: { target?: string[] } }).meta?.target ?? []).join(", ") : undefined;
    const msg = isP2002 ? `Duplicate value for unique field(s): ${target || "unknown"}` : (err instanceof Error ? err.message : String(e));
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}


