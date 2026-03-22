import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET all leadership groups
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const where = type ? { type } : {};

    const groups = await prisma.leadershipGroup.findMany({
      where,
      include: {
        positions: {
          include: {
            members: {
              where: { isCurrent: true },
              orderBy: { startDate: "desc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Error fetching leadership groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch leadership groups" },
      { status: 500 }
    );
  }
}

// POST create new leadership group
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["super_admin", "pastor"].includes(session.user.role || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, type, description, imageUrl, order } = body;

    if (!name || !slug || !type) {
      return NextResponse.json(
        { error: "Name, slug, and type are required" },
        { status: 400 }
      );
    }

    const group = await prisma.leadershipGroup.create({
      data: {
        name,
        slug,
        type,
        description,
        imageUrl,
        order: order || 0,
      },
    });

    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.error("Error creating leadership group:", error);
    return NextResponse.json(
      { error: "Failed to create leadership group" },
      { status: 500 }
    );
  }
}
