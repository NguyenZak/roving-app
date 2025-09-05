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
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || 20)));
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.tourPackage.findMany({ orderBy: [{ createdAt: "desc" }], skip, take: pageSize }),
    prisma.tourPackage.count(),
  ]);
  return NextResponse.json({ items, page, pageSize, total });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  const title = String(form.get("title"));
  const shortDesc = String(form.get("shortDesc"));
  const priceFrom = Number(form.get("priceFrom") ?? 0) || 0;
  const durationDays = Number(form.get("durationDays") ?? 1) || 1;
  const image = String(form.get("image") || "");
  const featured = String(form.get("featured") || "false") === "true";
  const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const created = await prisma.tourPackage.create({
    data: { title, shortDesc, priceFrom, durationDays, image, featured, slug },
  });
  return NextResponse.json({ ok: true, id: created.id });
}
