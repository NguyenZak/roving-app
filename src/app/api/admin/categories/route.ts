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
    prisma.provinceCategory.findMany({ orderBy: [{ order: "asc" }], skip, take: pageSize }),
    prisma.provinceCategory.count(),
  ]);
  return NextResponse.json({ items, page, pageSize, total });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  const name = String(form.get("name"));
  const order = Number(form.get("order") ?? 0) || 0;
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const created = await prisma.provinceCategory.create({ data: { name, slug, order } });
  return NextResponse.json({ ok: true, id: created.id });
}
