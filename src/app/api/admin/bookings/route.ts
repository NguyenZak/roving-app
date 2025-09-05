import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * pageSize;

    const where: Prisma.BookingWhereInput = search
      ? {
          OR: [
            { bookingId: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { customerName: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { customerEmail: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { tourName: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true, email: true },
          },
          tour: {
            select: { title: true, location: true },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      bookings,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      tourId,
      tourDate,
      numberOfPeople,
      totalAmount,
      status,
      notes,
      userId,
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !tourId || !tourDate || !numberOfPeople) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get tour information
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
      select: { title: true, price: true },
    });

    if (!tour) {
      return NextResponse.json(
        { error: "Tour not found" },
        { status: 404 }
      );
    }

    // Generate booking ID
    const bookingId = `BK${Date.now().toString().slice(-6)}`;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingId,
        customerName,
        customerEmail,
        tourId,
        tourName: tour.title,
        tourDate: new Date(tourDate),
        numberOfPeople,
        totalAmount: totalAmount || tour.price * numberOfPeople,
        status: status || "pending",
        notes: notes || null,
        userId: userId || null,
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
        tour: {
          select: { title: true, location: true },
        },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
