import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const seriesSlug = searchParams.get("series") || "";
    const speakerId = searchParams.get("speaker") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { published: true };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { scripture: { contains: query, mode: "insensitive" } },
        { speaker: { name: { contains: query, mode: "insensitive" } } },
      ];
    }

    if (seriesSlug) {
      where.series = { slug: seriesSlug };
    }

    if (speakerId) {
      where.speakerId = speakerId;
    }

    const [sermons, total] = await Promise.all([
      prisma.sermon.findMany({
        where,
        include: {
          speaker: { select: { id: true, name: true, title: true } },
          series: { select: { id: true, title: true, slug: true } },
        },
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      prisma.sermon.count({ where }),
    ]);

    return NextResponse.json({
      sermons,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Sermons API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sermons." },
      { status: 500 }
    );
  }
}
