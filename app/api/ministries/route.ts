import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const ministries = await prisma.leadershipGroup.findMany({
      where: {
        type: "ministry",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        order: true,
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ ministries });
  } catch (error) {
    console.error("Ministries GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ministries." },
      { status: 500 }
    );
  }
}
