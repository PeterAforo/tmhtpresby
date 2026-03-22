import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, firstName, lastName, email, phone, guests } = body;

    // Validate required fields
    if (!eventId || !firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Check event exists and is published
    const event = await prisma.event.findUnique({
      where: { id: eventId, published: true },
      include: { _count: { select: { rsvps: true } } },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found." },
        { status: 404 }
      );
    }

    // Check if event is in the past
    if (event.startDate < new Date()) {
      return NextResponse.json(
        { error: "Registration for this event has closed." },
        { status: 400 }
      );
    }

    // Check capacity
    const guestCount = Math.min(Math.max(Number(guests) || 0, 0), 10);
    if (event.capacity) {
      const totalAfter = event._count.rsvps + 1 + guestCount;
      if (totalAfter > event.capacity) {
        return NextResponse.json(
          { error: "Sorry, this event has reached capacity." },
          { status: 400 }
        );
      }
    }

    // Upsert RSVP (unique on eventId + email)
    const rsvp = await prisma.eventRsvp.upsert({
      where: {
        eventId_email: {
          eventId,
          email: email.toLowerCase().trim(),
        },
      },
      update: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone?.trim() || null,
        guests: guestCount,
      },
      create: {
        eventId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        guests: guestCount,
      },
    });

    return NextResponse.json(
      { success: true, rsvpId: rsvp.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("RSVP error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
