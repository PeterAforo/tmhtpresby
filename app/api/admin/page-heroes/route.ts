import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET all page heroes
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || !["super_admin", "pastor"].includes(session.user.role || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const heroes = await prisma.pageHero.findMany({
      orderBy: { pageSlug: "asc" },
    });

    return NextResponse.json(heroes);
  } catch (error) {
    console.error("Error fetching page heroes:", error);
    return NextResponse.json([]);
  }
}

// POST create new page hero
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["super_admin", "pastor"].includes(session.user.role || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { pageSlug, title, subtitle, backgroundUrl, overlayColor } = body;

    if (!pageSlug) {
      return NextResponse.json({ error: "Page slug is required" }, { status: 400 });
    }

    const hero = await prisma.pageHero.create({
      data: {
        pageSlug,
        title,
        subtitle,
        backgroundUrl,
        overlayColor: overlayColor || "rgba(12, 21, 41, 0.85)",
      },
    });

    return NextResponse.json(hero, { status: 201 });
  } catch (error) {
    console.error("Error creating page hero:", error);
    return NextResponse.json({ error: "Failed to create page hero" }, { status: 500 });
  }
}
