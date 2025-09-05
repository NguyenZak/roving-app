import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  try {
    const destination = await prisma.destination.findUnique({ where: { id } });
    if (!destination) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(destination);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Method override to support HTML forms
  const { id } = await context.params;
  const form = await req.formData();
  const method = String(form.get("_method") || "POST").toUpperCase();
  if (method === "PATCH") {
    const region = form.get("region") as string | null;
    const regionId = form.get("regionId") as string | null;
    const nameVi = form.get("nameVi") as string | null;
    const nameEn = form.get("nameEn") as string | null;
    const image = form.get("image") as string | null;
    const alt = form.get("alt") as string | null;
    const isFeatured = form.get("isFeatured") ? true : false;
    const orderRaw = form.get("order");
    const order = orderRaw !== null ? Number(orderRaw) : undefined;
    await prisma.destination.update({
      where: { id },
      data: {
        ...(region ? { region } : {}),
        ...(nameVi ? { nameVi } : {}),
        ...(nameEn ? { nameEn, slug: nameEn.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") } : {}),
        ...(image ? { image } : {}),
        ...(alt ? { alt } : {}),
        isFeatured,
        ...(order !== undefined && !Number.isNaN(order) ? { order } : {}),
        ...(regionId !== null ? { regionId: regionId || null } : {}),
      },
    });
    return NextResponse.redirect(new URL("/admin/destinations", req.url), 303);
  }
  if (method === "DELETE") {
    await prisma.destination.delete({ where: { id } });
    return NextResponse.redirect(new URL("/admin/destinations", req.url), 303);
  }
  return NextResponse.json({ ok: false, error: "Unsupported method" }, { status: 405 });
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const contentType = req.headers.get("content-type") || "";
  try {
    let data: Record<string, unknown> = {};
    if (contentType.includes("application/json")) {
      data = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      data = Object.fromEntries(form.entries());
    }
    const region = (data.region as string) ?? undefined;
    const regionId = (data.regionId as string) ?? undefined;
    const nameVi = (data.nameVi as string) ?? undefined;
    const nameEn = (data.nameEn as string) ?? undefined;
    const image = (data.image as string) ?? undefined;
    const alt = (data.alt as string) ?? undefined;
    const isFeatured = data.isFeatured !== undefined ? Boolean(data.isFeatured === "on" || data.isFeatured === true || data.isFeatured === "true") : undefined;
    const order = data.order !== undefined ? Number(data.order) : undefined;

    const updated = await prisma.destination.update({
      where: { id },
      data: {
        ...(region ? { region } : {}),
        ...(nameVi ? { nameVi } : {}),
        ...(nameEn ? { nameEn, slug: nameEn.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") } : {}),
        ...(image ? { image } : {}),
        ...(alt ? { alt } : {}),
        ...(isFeatured !== undefined ? { isFeatured } : {}),
        ...(order !== undefined && !Number.isNaN(order) ? { order } : {}),
        ...(regionId !== undefined ? { regionId: regionId || null } : {}),
      },
    });
    return NextResponse.json({ ok: true, id: updated.id });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  try {
    await prisma.destination.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}


