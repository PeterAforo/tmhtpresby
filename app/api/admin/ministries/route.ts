import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ── GET: list all ministries for admin ─────────────────────────────
export async function GET() {
  try {
    const ministries = await prisma.leadershipGroup.findMany({
      where: { type: "ministry" },
      include: {
        _count: {
          select: { positions: true },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ ministries });
  } catch (error) {
    console.error("Admin ministries GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ministries." },
      { status: 500 }
    );
  }
}

// ── POST: create a new ministry ────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, imageUrl } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Ministry name is required." },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check for existing slug
    const existing = await prisma.leadershipGroup.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A ministry with this name already exists." },
        { status: 400 }
      );
    }

    const ministry = await prisma.leadershipGroup.create({
      data: {
        name,
        slug,
        type: "ministry",
        description: description || null,
        imageUrl: imageUrl || null,
        isActive: true,
      },
    });

    return NextResponse.json({ ministry }, { status: 201 });
  } catch (error) {
    console.error("Admin ministries POST error:", error);
    return NextResponse.json(
      { error: "Failed to create ministry." },
      { status: 500 }
    );
  }
}

// ── PUT: update a ministry ─────────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Ministry ID is required." },
        { status: 400 }
      );
    }

    // Nullify empty strings
    for (const key of ["description", "imageUrl"]) {
      if (data[key] === "") data[key] = null;
    }

    const ministry = await prisma.leadershipGroup.update({
      where: { id },
      data,
    });

    return NextResponse.json({ ministry });
  } catch (error) {
    console.error("Admin ministries PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update ministry." },
      { status: 500 }
    );
  }
}

// ── DELETE: delete a ministry ──────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Ministry ID is required." },
        { status: 400 }
      );
    }

    await prisma.leadershipGroup.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin ministries DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete ministry." },
      { status: 500 }
    );
  }
}
