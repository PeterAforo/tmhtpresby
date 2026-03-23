import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    // Find the leadership group for this ministry
    const group = await prisma.leadershipGroup.findFirst({
      where: {
        slug: slug,
        type: "ministry",
        isActive: true,
      },
      include: {
        positions: {
          orderBy: { order: "asc" },
          include: {
            members: {
              orderBy: [{ isCurrent: "desc" }, { startDate: "desc" }],
              select: {
                id: true,
                firstName: true,
                lastName: true,
                title: true,
                email: true,
                imageUrl: true,
                bio: true,
                startDate: true,
                endDate: true,
                isCurrent: true,
                position: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!group) {
      // Return empty arrays if no leadership group exists for this ministry
      return NextResponse.json({ current: [], past: [] });
    }

    // Flatten members from all positions
    const allMembers = group.positions.flatMap((pos) => pos.members);

    // Separate current and past leaders
    const current = allMembers.filter((m) => m.isCurrent);
    const past = allMembers.filter((m) => !m.isCurrent);

    return NextResponse.json({ current, past, ministryName: group.name });
  } catch (error) {
    console.error("Ministry leaders GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ministry leaders." },
      { status: 500 }
    );
  }
}
