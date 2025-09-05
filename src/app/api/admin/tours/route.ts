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
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || 20)));
    const search = searchParams.get("search") || "";
    const destinationRaw = searchParams.get("destination") || "";
    const destination = destinationRaw === "all" ? "" : destinationRaw;
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }
    
    if (destination) {
      where.destinationId = destination;
    }

    const [items, total] = await Promise.all([
      prisma.tour.findMany({ 
        where,
        include: {
          Destination: {
            include: {
              Region: true
            }
          }
        },
        orderBy: [{ createdAt: "desc" }], 
        skip, 
        take: pageSize 
      }),
      prisma.tour.count({ where }),
    ]);
    return NextResponse.json({ items, page, pageSize, total });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  const title = String(form.get("title"));
  const description = String(form.get("description"));
  const price = Number(form.get("price"));
  const location = String(form.get("location"));
  const image = String(form.get("image"));
  const destinationIdRaw = form.get("destinationId") as string | null;
  const destinationId = destinationIdRaw === "none" ? null : destinationIdRaw;
  const duration = form.get("duration") as string | null;
  const maxGroupSizeRaw = form.get("maxGroupSize");
  const maxGroupSize = maxGroupSizeRaw ? Number(maxGroupSizeRaw) : null;
  const difficultyRaw = form.get("difficulty") as string | null;
  const difficulty = difficultyRaw === "none" ? null : difficultyRaw;
  const categoryRaw = form.get("category") as string | null;
  const category = categoryRaw === "none" ? null : categoryRaw;
  const status = String(form.get("status") || "active");
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
  
  const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  
  try {
    const created = await prisma.tour.create({ 
      data: { 
        title, 
        description, 
        price, 
        location, 
        image, 
        slug,
        destinationId: destinationId || null,
        duration: duration || null,
        maxGroupSize: maxGroupSize || null,
        difficulty: difficulty || null,
        category: category || null,
        status,
        featured,
        
        // NEW FIELDS - Basic Info
        tourCode: tourCode || null,
        shortDescription: shortDescription || null,
        departurePoint: departurePoint || null,
        returnPoint: returnPoint || null,
        minGroupSize: minGroupSize || null,
        ageRestriction: ageRestriction || null,
        
        // NEW FIELDS - Detailed Info
        itinerary: itinerary || null,
        highlights: highlights,
        inclusions: inclusions,
        exclusions: exclusions,
        transportation: transportation || null,
        accommodation: accommodation || null,
        guide: guide || null,
        
        // NEW FIELDS - Additional Info
        whatToBring: whatToBring,
        physicalReq: physicalReq || null,
        cancellationPolicy: cancellationPolicy || null,
        weatherPolicy: weatherPolicy || null,
        
        // NEW FIELDS - SEO & Marketing
        metaDescription: metaDescription || null,
        keywords: keywords,
        tags: tags,
        
        // Gallery - keep old field for backward compatibility
        gallery: galleryData.map(item => item.imageUrl)
      } 
    });

    // Create TourGallery records if gallery data exists
    if (galleryData.length > 0) {
      try {
        await (prisma as any).tourGallery.createMany({
          data: galleryData.map((item, index) => ({
            tourId: created.id,
            imageUrl: item.imageUrl,
            alt: item.alt || null,
            caption: item.caption || null,
            order: item.order || index
          }))
        });
      } catch (galleryError) {
        console.error('Gallery creation error:', galleryError);
        // Don't fail the entire request if gallery creation fails
      }
    }

    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}



