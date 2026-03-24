import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    const ministry = await prisma.leadershipGroup.findFirst({
      where: {
        slug,
        type: "ministry",
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    if (!ministry) {
      return NextResponse.json(
        { error: "Ministry not found." },
        { status: 404 }
      );
    }

    // Fetch members
    const members = await prisma.ministryMembership.findMany({
      where: { ministryId: ministry.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: [{ role: "asc" }, { joinedAt: "desc" }],
    });

    // Fetch executives
    const executives = await prisma.leadershipMember.findMany({
      where: {
        position: {
          group: { slug, type: "ministry" },
        },
        isCurrent: true,
      },
      include: {
        position: {
          select: { title: true },
        },
      },
      orderBy: { position: { order: "asc" } },
    });

    return NextResponse.json({ ministry, members, executives });
  } catch (error) {
    console.error("Admin ministry GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ministry." },
      { status: 500 }
    );
  }
}
