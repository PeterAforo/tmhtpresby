import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// POST create new member
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["super_admin", "pastor", "ministry_leader"].includes(session.user.role || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
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
        { error: "firstName, lastName, positionId, and startDate are required" },
        { status: 400 }
      );
    }

    const member = await prisma.leadershipMember.create({
      data: {
        firstName,
        lastName,
        title,
        email,
        phone,
        imageUrl,
        bio,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: isCurrent ?? true,
        positionId,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 }
    );
  }
}
