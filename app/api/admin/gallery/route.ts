import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// TODO: Add auth middleware when auth system is built (Phase 5)

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── GET: list all albums with image counts ──────────────────────
export async function GET() {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      include: {
        _count: { select: { images: true } },
        images: { orderBy: { order: "asc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ albums });
  } catch (error) {
    console.error("Admin gallery GET error:", error);
    return NextResponse.json({ error: "Failed to fetch albums." }, { status: 500 });
  }
}

// ── POST: create a new album ────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, coverUrl, published } = body;

    if (!title) {
      return NextResponse.json({ error: "Album title is required." }, { status: 400 });
    }

    let slug = slugify(title);
    const existing = await prisma.galleryAlbum.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const album = await prisma.galleryAlbum.create({
      data: {
        title: title.trim(),
        slug,
        description: description?.trim() || null,
        coverUrl: coverUrl?.trim() || null,
        published: published !== false,
      },
    });

    return NextResponse.json({ album }, { status: 201 });
  } catch (error) {
    console.error("Admin gallery POST error:", error);
    return NextResponse.json({ error: "Failed to create album." }, { status: 500 });
  }
}

// ── PUT: update an album ────────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, description, coverUrl, published } = body;

    if (!id) {
      return NextResponse.json({ error: "Album ID is required." }, { status: 400 });
    }

    const album = await prisma.galleryAlbum.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(coverUrl !== undefined && { coverUrl: coverUrl?.trim() || null }),
        ...(published !== undefined && { published: Boolean(published) }),
      },
    });

    return NextResponse.json({ album });
  } catch (error) {
    console.error("Admin gallery PUT error:", error);
    return NextResponse.json({ error: "Failed to update album." }, { status: 500 });
  }
}

// ── DELETE: remove an album (cascades to images) ────────────────
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Album ID is required." }, { status: 400 });
    }

    await prisma.galleryAlbum.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin gallery DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete album." }, { status: 500 });
  }
}
