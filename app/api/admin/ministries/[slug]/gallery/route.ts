import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const ADMIN_ROLES = ["super_admin", "pastor", "ministry_leader"];

interface RouteContext {
  params: Promise<{ slug: string }>;
}

// GET: Fetch ministry gallery images
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { slug } = await context.params;

    // Find the ministry group
    const group = await prisma.leadershipGroup.findFirst({
      where: { slug, type: "ministry" },
    });

    if (!group) {
      return NextResponse.json({ error: "Ministry not found" }, { status: 404 });
    }

    // Find or create gallery album for this ministry
    let album = await prisma.galleryAlbum.findFirst({
      where: { slug: `ministry-${slug}` },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!album) {
      album = await prisma.galleryAlbum.create({
        data: {
          title: `${group.name} Gallery`,
          slug: `ministry-${slug}`,
          description: `Photo gallery for ${group.name}`,
          published: true,
        },
        include: {
          images: true,
        },
      });
    }

    return NextResponse.json({
      images: album.images,
      ministryName: group.name,
      albumId: album.id,
    });
  } catch (error) {
    console.error("Ministry gallery GET error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

// POST: Add images to ministry gallery (bulk upload)
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { slug } = await context.params;
    const { urls } = await req.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "Image URLs are required" }, { status: 400 });
    }

    // Find the ministry group
    const group = await prisma.leadershipGroup.findFirst({
      where: { slug, type: "ministry" },
    });

    if (!group) {
      return NextResponse.json({ error: "Ministry not found" }, { status: 404 });
    }

    // Find or create gallery album for this ministry
    let album = await prisma.galleryAlbum.findFirst({
      where: { slug: `ministry-${slug}` },
    });

    if (!album) {
      album = await prisma.galleryAlbum.create({
        data: {
          title: `${group.name} Gallery`,
          slug: `ministry-${slug}`,
          description: `Photo gallery for ${group.name}`,
          published: true,
        },
      });
    }

    // Get current max order
    const lastImage = await prisma.galleryImage.findFirst({
      where: { albumId: album.id },
      orderBy: { order: "desc" },
    });
    let currentOrder = lastImage ? lastImage.order + 1 : 0;

    // Create all images
    const images = await prisma.galleryImage.createMany({
      data: urls.map((url: string) => ({
        url,
        albumId: album.id,
        order: currentOrder++,
      })),
    });

    return NextResponse.json({ count: images.count }, { status: 201 });
  } catch (error) {
    console.error("Ministry gallery POST error:", error);
    return NextResponse.json({ error: "Failed to add images" }, { status: 500 });
  }
}

// PUT: Update image caption
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { imageId, caption } = await req.json();

    if (!imageId) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 });
    }

    const image = await prisma.galleryImage.update({
      where: { id: imageId },
      data: { caption: caption || null },
    });

    return NextResponse.json({ image });
  } catch (error) {
    console.error("Ministry gallery PUT error:", error);
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
  }
}

// DELETE: Remove image from gallery
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 });
    }

    await prisma.galleryImage.delete({ where: { id: imageId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ministry gallery DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
