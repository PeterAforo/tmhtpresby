import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = {
  params: Promise<{ slug: string }>;
};

// GET published page content by slug (public endpoint)
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;

    const page = await prisma.page.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        content: true,
        template: true,
        published: true,
        featuredImg: true,
        metaTitle: true,
        metaDesc: true,
      },
    });

    if (!page || !page.published) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 });
  }
}
