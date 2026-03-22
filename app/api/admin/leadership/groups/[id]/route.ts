import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
};

// GET single leadership group
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    const group = await prisma.leadershipGroup.findUnique({
      where: { id },
      include: {
        positions: {
          include: {
            members: {
              orderBy: [{ isCurrent: "desc" }, { startDate: "desc" }],
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error("Error fetching leadership group:", error);
    return NextResponse.json(
      { error: "Failed to fetch leadership group" },
      { status: 500 }
    );
  }
}

// PUT update leadership group
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const session = await auth();
    if (!session?.user || !["super_admin", "pastor", "ministry_leader"].includes(session.user.role || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, imageUrl, order, isActive } = body;

    const group = await prisma.leadershipGroup.update({
      where: { id },
      data: {
        name,
        description,
        imageUrl,
        order,
        isActive,
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error("Error updating leadership group:", error);
    return NextResponse.json(
      { error: "Failed to update leadership group" },
      { status: 500 }
    );
  }
}

// DELETE leadership group
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const session = await auth();
    if (!session?.user || !["super_admin"].includes(session.user.role || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.leadershipGroup.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting leadership group:", error);
    return NextResponse.json(
      { error: "Failed to delete leadership group" },
      { status: 500 }
    );
  }
}
