import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST create new position
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["super_admin", "pastor", "ministry_leader"].includes(session.user.role || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, order, groupId } = body;

    if (!title || !groupId) {
      return NextResponse.json(
        { error: "Title and groupId are required" },
        { status: 400 }
      );
    }

    const position = await prisma.leadershipPosition.create({
      data: {
        title,
        description,
        order: order || 0,
        groupId,
      },
    });

    return NextResponse.json(position, { status: 201 });
  } catch (error) {
    console.error("Error creating position:", error);
    return NextResponse.json(
      { error: "Failed to create position" },
      { status: 500 }
    );
  }
}
