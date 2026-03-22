import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = {
  params: Promise<{ type: string }>;
};

// GET leadership by type (public endpoint)
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { type } = await params;
    const { searchParams } = new URL(request.url);
    const includePast = searchParams.get("includePast") === "true";

    const groups = await prisma.leadershipGroup.findMany({
      where: {
        type,
        isActive: true,
      },
      include: {
        positions: {
          include: {
            members: {
              where: includePast ? {} : { isCurrent: true },
              orderBy: [{ isCurrent: "desc" }, { startDate: "desc" }],
            },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Error fetching leadership:", error);
    // Return empty array if table doesn't exist or other DB error
    return NextResponse.json([]);
  }
}
