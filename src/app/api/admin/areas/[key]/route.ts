import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_req: NextRequest, context: { params: Promise<{ key: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { key } = await context.params;
  try {
    const area = await prisma.region.findUnique({ where: { key } });
    return NextResponse.json({ area });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ key: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { key } = await context.params;
  const form = await req.formData();
  try {
    const method = String(form.get("_method") || "POST").toUpperCase();
    if (method === "DELETE") {
      await prisma.region.delete({ where: { key } });
      return NextResponse.json({ ok: true });
    }
    const data = {
      key,
      nameVi: String(form.get("nameVi") || ""),
      nameEn: String(form.get("nameEn") || ""),
      descriptionVi: (form.get("descriptionVi") as string) || null,
      descriptionEn: (form.get("descriptionEn") as string) || null,
      image: (form.get("image") as string) || null,
      order: Number(form.get("order") || 0),
    };
    const saved = await prisma.region.upsert({
      where: { key },
      create: data,
      update: data,
    });
    return NextResponse.json({ ok: true, id: saved.id });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ key: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { key } = await context.params;
  try {
    const contentType = req.headers.get("content-type") || "";
    let payload: Record<string, unknown> = {};
    if (contentType.includes("application/json")) payload = await req.json();
    else {
      const form = await req.formData();
      payload = Object.fromEntries(form.entries());
    }
    const updated = await prisma.region.upsert({
      where: { key },
      create: {
        key,
        nameVi: String(payload.nameVi || ""),
        nameEn: String(payload.nameEn || ""),
        descriptionVi: (payload.descriptionVi as string) || null,
        descriptionEn: (payload.descriptionEn as string) || null,
        image: (payload.image as string) || null,
        order: payload.order !== undefined ? Number(payload.order) : 0,
      },
      update: {
        nameVi: payload.nameVi !== undefined ? String(payload.nameVi) : undefined,
        nameEn: payload.nameEn !== undefined ? String(payload.nameEn) : undefined,
        descriptionVi: (payload.descriptionVi as string) ?? undefined,
        descriptionEn: (payload.descriptionEn as string) ?? undefined,
        image: (payload.image as string) ?? undefined,
        order: payload.order !== undefined ? Number(payload.order) : undefined,
      },
    });
    return NextResponse.json({ ok: true, id: updated.id });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}


