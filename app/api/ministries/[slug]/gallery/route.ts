import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    // Fetch gallery albums that are tagged with this ministry
    // We look for albums where the slug contains the ministry slug or title matches
    const albums = await prisma.galleryAlbum.findMany({
      where: {
        published: true,
        OR: [
          { slug: { contains: slug } },
          { title: { contains: slug, mode: "insensitive" } },
        ],
      },
      include: {
        images: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            url: true,
            caption: true,
          },
        },
        _count: {
          select: { images: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Transform to match the expected format
    const formattedAlbums = albums.map((album) => ({
      id: album.id,
      title: album.title,
      slug: album.slug,
      description: album.description,
      coverImage: album.images[0]?.url || null,
      imageCount: album._count.images,
      images: album.images.map((img) => ({
        id: img.id,
        url: img.url,
        caption: img.caption,
        type: "image" as const,
        thumbnailUrl: img.url,
      })),
    }));

    return NextResponse.json({ albums: formattedAlbums });
  } catch (error) {
    console.error("Ministry gallery GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ministry gallery." },
      { status: 500 }
    );
  }
}
