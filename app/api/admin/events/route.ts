import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// TODO: Add auth middleware when auth system is built (Phase 5)

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── GET: list all events (admin view, including unpublished) ─────
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: { _count: { select: { rsvps: true } } },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Admin events GET error:", error);
    return NextResponse.json({ error: "Failed to fetch events." }, { status: 500 });
  }
}

// ── POST: create a new event ────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, location, category, imageUrl, startDate, endDate, startTime, endTime, capacity, isFeatured, published } = body;

    if (!title || !startDate) {
      return NextResponse.json({ error: "Title and start date are required." }, { status: 400 });
    }

    let slug = slugify(title);
    const existing = await prisma.event.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        slug,
        description: description?.trim() || null,
        location: location?.trim() || null,
        category: category || "special",
        imageUrl: imageUrl?.trim() || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        startTime: startTime?.trim() || null,
        endTime: endTime?.trim() || null,
        capacity: capacity ? Number(capacity) : null,
        isFeatured: Boolean(isFeatured),
        published: published !== false,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Admin events POST error:", error);
    return NextResponse.json({ error: "Failed to create event." }, { status: 500 });
  }
}

// ── PUT: update an event ────────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, description, location, category, imageUrl, startDate, endDate, startTime, endTime, capacity, isFeatured, published } = body;

    if (!id) {
      return NextResponse.json({ error: "Event ID is required." }, { status: 400 });
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(location !== undefined && { location: location?.trim() || null }),
        ...(category && { category }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl?.trim() || null }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(startTime !== undefined && { startTime: startTime?.trim() || null }),
        ...(endTime !== undefined && { endTime: endTime?.trim() || null }),
        ...(capacity !== undefined && { capacity: capacity ? Number(capacity) : null }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(published !== undefined && { published: Boolean(published) }),
      },
    });

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Admin events PUT error:", error);
    return NextResponse.json({ error: "Failed to update event." }, { status: 500 });
  }
}

// ── DELETE: remove an event ─────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Event ID is required." }, { status: 400 });
    }

    await prisma.event.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin events DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete event." }, { status: 500 });
  }
}
