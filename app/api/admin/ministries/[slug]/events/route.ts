import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const ADMIN_ROLES = ["super_admin", "pastor", "ministry_leader"];

interface RouteContext {
  params: Promise<{ slug: string }>;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET: Fetch ministry events
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { slug } = await context.params;

    // Find the ministry group
    const group = await prisma.leadershipGroup.findFirst({
      where: { slug, type: "ministry" },
    });

    if (!group) {
      return NextResponse.json({ error: "Ministry not found" }, { status: 404 });
    }

    // Find events for this ministry (using category matching slug)
    const events = await prisma.event.findMany({
      where: {
        OR: [
          { category: slug },
          { slug: { startsWith: `${slug}-` } },
        ],
      },
      include: {
        _count: { select: { rsvps: true } },
      },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json({
      events,
      ministryName: group.name,
    });
  } catch (error) {
    console.error("Ministry events GET error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// POST: Create ministry event
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { slug: ministrySlug } = await context.params;
    const body = await req.json();

    const {
      title,
      description,
      location,
      imageUrl,
      startDate,
      endDate,
      startTime,
      endTime,
      capacity,
      isFeatured,
      published,
    } = body;

    if (!title || !startDate) {
      return NextResponse.json(
        { error: "Title and start date are required" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let eventSlug = `${ministrySlug}-${slugify(title)}`;
    const existing = await prisma.event.findUnique({ where: { slug: eventSlug } });
    if (existing) eventSlug = `${eventSlug}-${Date.now().toString(36)}`;

    const event = await prisma.event.create({
      data: {
        title,
        slug: eventSlug,
        description: description || null,
        location: location || null,
        category: ministrySlug,
        imageUrl: imageUrl || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        startTime: startTime || null,
        endTime: endTime || null,
        capacity: capacity ? parseInt(capacity) : null,
        isFeatured: isFeatured || false,
        published: published !== false,
      },
      include: {
        _count: { select: { rsvps: true } },
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Ministry events POST error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

// PUT: Update ministry event
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    // Convert dates
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    else if (data.endDate === "") data.endDate = null;

    // Convert capacity
    if (data.capacity) data.capacity = parseInt(data.capacity);
    else if (data.capacity === "") data.capacity = null;

    // Nullify empty strings
    for (const key of ["description", "location", "imageUrl", "startTime", "endTime"]) {
      if (data[key] === "") data[key] = null;
    }

    const event = await prisma.event.update({
      where: { id },
      data,
      include: {
        _count: { select: { rsvps: true } },
      },
    });

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Ministry events PUT error:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

// DELETE: Remove ministry event
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    await prisma.event.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ministry events DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
