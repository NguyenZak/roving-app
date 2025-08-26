import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.destination.findMany({
      where: { isFeatured: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take: 12,
    });
    return NextResponse.json({ items });
  } catch (err) {
    // Return empty list on error to avoid noisy logs in development/staging
    return NextResponse.json({ items: [], error: String(err) });
  }
}


