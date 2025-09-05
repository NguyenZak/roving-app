import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await prisma.region.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  const key = String(form.get("key") || "");
  if (!key) return NextResponse.json({ ok: false, error: "key is required" }, { status: 400 });
  const created = await prisma.region.create({
    data: {
      key,
      nameVi: String(form.get("nameVi") || ""),
      nameEn: String(form.get("nameEn") || ""),
      descriptionVi: (form.get("descriptionVi") as string) || null,
      descriptionEn: (form.get("descriptionEn") as string) || null,
      image: (form.get("image") as string) || null,
      order: Number(form.get("order") || 0),
    },
  });
  return NextResponse.json({ ok: true, id: created.id });
}


