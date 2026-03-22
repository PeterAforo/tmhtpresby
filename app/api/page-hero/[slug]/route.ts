import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = {
  params: Promise<{ slug: string }>;
};

// GET page hero settings by slug (public endpoint)
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    
    const hero = await prisma.pageHero.findUnique({
      where: { pageSlug: slug, isActive: true },
      select: {
        backgroundUrl: true,
        overlayColor: true,
        title: true,
        subtitle: true,
      },
    });

    if (!hero) {
      return NextResponse.json({});
    }

    return NextResponse.json(hero);
  } catch (error) {
    console.error("Error fetching page hero:", error);
    return NextResponse.json({});
  }
}
