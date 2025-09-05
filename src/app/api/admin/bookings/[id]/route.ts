import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET - Get single booking
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true },
        },
        tour: {
          select: { title: true, location: true, price: true },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PUT - Update booking
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
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

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
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

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE - Delete booking
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Delete booking
    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Booking deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
