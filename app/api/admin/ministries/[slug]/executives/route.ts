import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

// ── GET: list executives for a ministry ────────────────────────────
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    // Find the ministry group
    const group = await prisma.leadershipGroup.findFirst({
      where: { slug, type: "ministry" },
      include: {
        positions: {
          orderBy: { order: "asc" },
          include: {
            members: {
              orderBy: [{ isCurrent: "desc" }, { startDate: "desc" }],
              include: {
                position: {
                  select: { id: true, title: true, order: true },
                },
              },
            },
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Ministry not found." },
        { status: 404 }
      );
    }

    // Flatten members from all positions
    const executives = group.positions.flatMap((pos) => pos.members);
    const positions = group.positions.map((pos) => ({
      id: pos.id,
      title: pos.title,
      order: pos.order,
    }));

    return NextResponse.json({
      executives,
      positions,
      ministryName: group.name,
    });
  } catch (error) {
    console.error("Ministry executives GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch executives." },
      { status: 500 }
    );
  }
}

// ── POST: add a new executive ──────────────────────────────────────
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const body = await req.json();

    const {
      firstName,
      lastName,
      title,
      email,
      phone,
      imageUrl,
      bio,
      startDate,
      endDate,
      isCurrent,
      positionId,
    } = body;

    if (!firstName || !lastName || !positionId || !startDate) {
      return NextResponse.json(
        { error: "First name, last name, position, and start date are required." },
        { status: 400 }
      );
    }

    // Verify the position belongs to this ministry
    const position = await prisma.leadershipPosition.findFirst({
      where: {
        id: positionId,
        group: { slug, type: "ministry" },
      },
    });

    if (!position) {
      return NextResponse.json(
        { error: "Invalid position for this ministry." },
        { status: 400 }
      );
    }

    const executive = await prisma.leadershipMember.create({
      data: {
        firstName,
        lastName,
        title: title || null,
        email: email || null,
        phone: phone || null,
        imageUrl: imageUrl || null,
        bio: bio || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: isCurrent !== false,
        positionId,
      },
      include: {
        position: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ executive }, { status: 201 });
  } catch (error) {
    console.error("Ministry executives POST error:", error);
    return NextResponse.json(
      { error: "Failed to add executive." },
      { status: 500 }
    );
  }
}

// ── PUT: update an executive ───────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Executive ID is required." },
        { status: 400 }
      );
    }

    // Convert dates
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    else if (data.endDate === "") data.endDate = null;

    // Nullify empty strings
    for (const key of ["title", "email", "phone", "imageUrl", "bio"]) {
      if (data[key] === "") data[key] = null;
    }

    const executive = await prisma.leadershipMember.update({
      where: { id },
      data,
      include: {
        position: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ executive });
  } catch (error) {
    console.error("Ministry executives PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update executive." },
      { status: 500 }
    );
  }
}

// ── DELETE: remove an executive ────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Executive ID is required." },
        { status: 400 }
      );
    }

    await prisma.leadershipMember.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ministry executives DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to remove executive." },
      { status: 500 }
    );
  }
}
