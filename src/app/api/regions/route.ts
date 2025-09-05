import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const items = await prisma.region.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { key: true, nameEn: true, nameVi: true, image: true }
    });
    return NextResponse.json({ items });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
