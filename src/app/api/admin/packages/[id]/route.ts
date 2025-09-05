import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const item = await prisma.tourPackage.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const form = await req.formData();
  const method = String(form.get("_method") || "POST").toUpperCase();
  if (method === "DELETE") {
    await prisma.tourPackage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
  if (method === "PATCH") {
    const title = form.get("title") as string | null;
    const shortDesc = form.get("shortDesc") as string | null;
    const priceFromRaw = form.get("priceFrom");
    const durationDaysRaw = form.get("durationDays");
    const image = form.get("image") as string | null;
    const featuredStr = form.get("featured") as string | null;

    const data: Record<string, unknown> = {};
    if (title) {
      data.title = title;
      data.slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    if (shortDesc) data.shortDesc = shortDesc;
    if (priceFromRaw !== null && !Number.isNaN(Number(priceFromRaw))) data.priceFrom = Number(priceFromRaw);
    if (durationDaysRaw !== null && !Number.isNaN(Number(durationDaysRaw))) data.durationDays = Number(durationDaysRaw);
    if (image) data.image = image;
    if (featuredStr !== null) data.featured = featuredStr === "true";

    const updated = await prisma.tourPackage.update({ where: { id }, data });
    return NextResponse.json({ ok: true, id: updated.id });
  }
  return NextResponse.json({ error: "Unsupported method" }, { status: 405 });
}
