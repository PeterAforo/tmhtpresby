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
    });

    if (!ministry) {
      return NextResponse.json(
        { error: "Ministry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ministry });
  } catch (error) {
    console.error("Admin ministry GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ministry." },
      { status: 500 }
    );
  }
}
