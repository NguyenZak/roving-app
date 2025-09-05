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
  const item = await prisma.provinceCategory.findUnique({ where: { id } });
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
    await prisma.provinceCategory.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
  if (method === "PATCH") {
    const name = form.get("name") as string | null;
    const orderRaw = form.get("order");
    const order = orderRaw !== null ? Number(orderRaw) : undefined;
    const data: Record<string, unknown> = {};
    if (name) {
      data.name = name;
      data.slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    if (order !== undefined && !Number.isNaN(order)) data.order = order;
    const updated = await prisma.provinceCategory.update({ where: { id }, data });
    return NextResponse.json({ ok: true, id: updated.id });
  }
  return NextResponse.json({ error: "Unsupported method" }, { status: 405 });
}
