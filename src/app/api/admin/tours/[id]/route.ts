import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const tour = await prisma.tour.findUnique({
      where: { id },
      include: {
        Destination: {
          include: {
            Region: true
          }
        },
        galleries: {
          orderBy: {
            order: 'asc'
          }
        }
      } as any
    });
    
    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }
    
    return NextResponse.json({ ok: true, tour });
  } catch (e) {
    console.error("GET tour error:", e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const form = await req.formData();
    const method = String(form.get("_method") || "POST").toUpperCase();
    if (method === "PATCH") {
    const title = form.get("title") as string | null;
    const description = form.get("description") as string | null;
    const priceRaw = form.get("price");
    const price = priceRaw !== null ? Number(priceRaw) : undefined;
    const location = form.get("location") as string | null;
    const image = form.get("image") as string | null;
    const destinationIdRaw = form.get("destinationId") as string | null;
    const destinationId = destinationIdRaw === "none" ? null : destinationIdRaw;
    const duration = form.get("duration") as string | null;
    const maxGroupSizeRaw = form.get("maxGroupSize");
    const maxGroupSize = maxGroupSizeRaw ? Number(maxGroupSizeRaw) : null;
    const difficultyRaw = form.get("difficulty") as string | null;
    const difficulty = difficultyRaw === "none" ? null : difficultyRaw;
    const categoryRaw = form.get("category") as string | null;
    const category = categoryRaw === "none" ? null : categoryRaw;
    const status = form.get("status") as string | null;
    const featured = form.get("featured") === "true";
    
    // NEW FIELDS - Basic Info
    const tourCode = form.get("tourCode") as string | null;
    const shortDescription = form.get("shortDescription") as string | null;
    const departurePoint = form.get("departurePoint") as string | null;
    const returnPoint = form.get("returnPoint") as string | null;
    const minGroupSizeRaw = form.get("minGroupSize");
    const minGroupSize = minGroupSizeRaw ? Number(minGroupSizeRaw) : null;
    const ageRestriction = form.get("ageRestriction") as string | null;
    
    // NEW FIELDS - Detailed Info
    const itinerary = form.get("itinerary") as string | null;
    const highlightsRaw = form.get("highlights") as string | null;
    const highlights = highlightsRaw ? highlightsRaw.split('\n').filter(h => h.trim()) : [];
    const inclusionsRaw = form.get("inclusions") as string | null;
    const inclusions = inclusionsRaw ? inclusionsRaw.split('\n').filter(i => i.trim()) : [];
    const exclusionsRaw = form.get("exclusions") as string | null;
    const exclusions = exclusionsRaw ? exclusionsRaw.split('\n').filter(e => e.trim()) : [];
    const transportation = form.get("transportation") as string | null;
    const accommodation = form.get("accommodation") as string | null;
    const guide = form.get("guide") as string | null;
    
    // NEW FIELDS - Additional Info
    const whatToBringRaw = form.get("whatToBring") as string | null;
    const whatToBring = whatToBringRaw ? whatToBringRaw.split('\n').filter(w => w.trim()) : [];
    const physicalReq = form.get("physicalReq") as string | null;
    const cancellationPolicy = form.get("cancellationPolicy") as string | null;
    const weatherPolicy = form.get("weatherPolicy") as string | null;
    
    // NEW FIELDS - SEO & Marketing
    const metaDescription = form.get("metaDescription") as string | null;
    const keywordsRaw = form.get("keywords") as string | null;
    const keywords = keywordsRaw ? keywordsRaw.split(',').map(k => k.trim()).filter(k => k) : [];
    const tagsRaw = form.get("tags") as string | null;
    const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(t => t) : [];
    
    // Gallery field - handle TourGallery data
    const galleryRaw = form.get("gallery") as string | null;
    let galleryData: Array<{imageUrl: string, alt?: string, caption?: string, order: number}> = [];
    if (galleryRaw) {
      try {
        galleryData = JSON.parse(galleryRaw);
      } catch (e) {
        console.error('Error parsing gallery:', e);
        galleryData = [];
      }
    }
    
    await prisma.tour.update({
      where: { id },
      data: {
        ...(title ? { title, slug: title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") } : {}),
        ...(description ? { description } : {}),
        ...(price !== undefined && !Number.isNaN(price) ? { price } : {}),
        ...(location ? { location } : {}),
        ...(image ? { image } : {}),
        ...(destinationId !== null ? { destinationId: destinationId || null } : {}),
        ...(duration !== null ? { duration: duration || null } : {}),
        ...(maxGroupSize !== null ? { maxGroupSize } : {}),
        ...(difficulty !== null ? { difficulty: difficulty || null } : {}),
        ...(category !== null ? { category: category || null } : {}),
        ...(status ? { status } : {}),
        ...(featured !== undefined ? { featured } : {}),
        
        // NEW FIELDS - Basic Info
        ...(tourCode !== null ? { tourCode: tourCode || null } : {}),
        ...(shortDescription !== null ? { shortDescription: shortDescription || null } : {}),
        ...(departurePoint !== null ? { departurePoint: departurePoint || null } : {}),
        ...(returnPoint !== null ? { returnPoint: returnPoint || null } : {}),
        ...(minGroupSize !== null ? { minGroupSize } : {}),
        ...(ageRestriction !== null ? { ageRestriction: ageRestriction || null } : {}),
        
        // NEW FIELDS - Detailed Info
        ...(itinerary !== null ? { itinerary: itinerary || null } : {}),
        ...(highlights !== null ? { highlights } : {}),
        ...(inclusions !== null ? { inclusions } : {}),
        ...(exclusions !== null ? { exclusions } : {}),
        ...(transportation !== null ? { transportation: transportation || null } : {}),
        ...(accommodation !== null ? { accommodation: accommodation || null } : {}),
        ...(guide !== null ? { guide: guide || null } : {}),
        
        // NEW FIELDS - Additional Info
        ...(whatToBring !== null ? { whatToBring } : {}),
        ...(physicalReq !== null ? { physicalReq: physicalReq || null } : {}),
        ...(cancellationPolicy !== null ? { cancellationPolicy: cancellationPolicy || null } : {}),
        ...(weatherPolicy !== null ? { weatherPolicy: weatherPolicy || null } : {}),
        
        // NEW FIELDS - SEO & Marketing
        ...(metaDescription !== null ? { metaDescription: metaDescription || null } : {}),
        ...(keywords !== null ? { keywords } : {}),
        ...(tags !== null ? { tags } : {}),
      },
    });

    // Handle gallery images separately
    if (galleryData !== null) {
      try {
        // Delete existing gallery images
        await (prisma as any).tourGallery.deleteMany({
          where: { tourId: id }
        });

        // Create new gallery images
        if (galleryData.length > 0) {
          await (prisma as any).tourGallery.createMany({
            data: galleryData.map((item, index) => ({
              tourId: id,
              imageUrl: item.imageUrl,
              alt: item.alt || null,
              caption: item.caption || null,
              order: item.order || index
            }))
          });
        }
      } catch (galleryError) {
        console.error('Gallery update error:', galleryError);
        // Don't fail the entire request if gallery update fails
      }
    }
    return NextResponse.json({ ok: true, message: "Tour updated successfully" });
  }
  if (method === "DELETE") {
    await prisma.tour.delete({ where: { id } });
    return NextResponse.redirect(new URL("/admin/tours", req.url), 303);
  }
  return NextResponse.json({ ok: false, error: "Unsupported method" }, { status: 405 });
  } catch (e) {
    console.error("POST tour error:", e);
    console.error("Error details:", {
      message: e instanceof Error ? e.message : 'Unknown error',
      stack: e instanceof Error ? e.stack : undefined,
      name: e instanceof Error ? e.name : undefined,
      fullError: e
    });
    
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    const errorDetails = e instanceof Error ? e.stack : String(e);
    
    return NextResponse.json(
      { 
        ok: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      }, 
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const contentType = req.headers.get("content-type") || "";
  try {
    let data: Record<string, unknown> = {};
    if (contentType.includes("application/json")) data = await req.json();
    else {
      const form = await req.formData();
      data = Object.fromEntries(form.entries());
    }
    const title = (data.title as string) ?? undefined;
    const description = (data.description as string) ?? undefined;
    const price = data.price !== undefined ? Number(data.price) : undefined;
    const location = (data.location as string) ?? undefined;
    const image = (data.image as string) ?? undefined;
    const updated = await prisma.tour.update({
      where: { id },
      data: {
        ...(title ? { title, slug: title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") } : {}),
        ...(description ? { description } : {}),
        ...(price !== undefined && !Number.isNaN(price) ? { price } : {}),
        ...(location ? { location } : {}),
        ...(image ? { image } : {}),
      },
    });
    return NextResponse.json({ ok: true, id: updated.id });
  } catch (e) {
    console.error("PATCH tour error:", e);
    console.error("Error details:", {
      message: e instanceof Error ? e.message : 'Unknown error',
      stack: e instanceof Error ? e.stack : undefined,
      name: e instanceof Error ? e.name : undefined,
      fullError: e
    });
    
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    const errorDetails = e instanceof Error ? e.stack : String(e);
    
    return NextResponse.json(
      { 
        ok: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      }, 
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    await prisma.tour.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE tour error:", e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }
}


