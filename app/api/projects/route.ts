import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured") === "true";
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: Record<string, unknown> = {
      isPublished: true,
    };

    if (featured) {
      where.isFeatured = true;
    }

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [
        { isFeatured: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects." },
      { status: 500 }
    );
  }
}
