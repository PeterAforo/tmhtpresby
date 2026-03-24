import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const ADMIN_ROLES = ["super_admin", "pastor", "ministry_leader"];

// POST: Add multiple images to album (bulk upload)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: albumId } = await params;
    const { urls } = await req.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "Image URLs are required" }, { status: 400 });
    }

    // Get current max order
    const lastImage = await prisma.galleryImage.findFirst({
      where: { albumId },
      orderBy: { order: "desc" },
    });
    let currentOrder = lastImage ? lastImage.order + 1 : 0;

    // Create all images
    const images = await prisma.galleryImage.createMany({
      data: urls.map((url: string) => ({
        url,
        albumId,
        order: currentOrder++,
      })),
    });

    return NextResponse.json({ count: images.count }, { status: 201 });
  } catch (error) {
    console.error("Error adding images:", error);
    return NextResponse.json({ error: "Failed to add images" }, { status: 500 });
  }
}

// PUT: Update image caption
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    console.error("Error updating image:", error);
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
  }
}

// DELETE: Remove image from album
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    console.error("Error deleting image:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
