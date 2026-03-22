import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [speakers, series] = await Promise.all([
      prisma.speaker.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, title: true },
      }),
      prisma.sermonSeries.findMany({
        orderBy: { title: "asc" },
        select: { id: true, title: true, slug: true },
      }),
    ]);

    return NextResponse.json({ speakers, series });
  } catch (error) {
    console.error("Admin meta error:", error);
    return NextResponse.json({ error: "Failed to fetch meta." }, { status: 500 });
  }
}
