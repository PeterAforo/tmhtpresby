import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// TODO: Add auth middleware when auth system is built (Phase 5)

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── GET: list all blog posts (admin view) ───────────────────────
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Admin blog GET error:", error);
    return NextResponse.json({ error: "Failed to fetch posts." }, { status: 500 });
  }
}

// ── POST: create a new blog post ────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, excerpt, content, author, category, imageUrl, readTime, published, publishedAt } = body;

    if (!title || !content || !author) {
      return NextResponse.json({ error: "Title, content, and author are required." }, { status: 400 });
    }

    let slug = slugify(title);
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const post = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        slug,
        excerpt: excerpt?.trim() || null,
        content,
        author: author.trim(),
        category: category || "general",
        imageUrl: imageUrl?.trim() || null,
        readTime: readTime ? Number(readTime) : null,
        published: published !== false,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Admin blog POST error:", error);
    return NextResponse.json({ error: "Failed to create post." }, { status: 500 });
  }
}

// ── PUT: update a blog post ─────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, excerpt, content, author, category, imageUrl, readTime, published, publishedAt } = body;

    if (!id) {
      return NextResponse.json({ error: "Post ID is required." }, { status: 400 });
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(excerpt !== undefined && { excerpt: excerpt?.trim() || null }),
        ...(content !== undefined && { content }),
        ...(author && { author: author.trim() }),
        ...(category && { category }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl?.trim() || null }),
        ...(readTime !== undefined && { readTime: readTime ? Number(readTime) : null }),
        ...(published !== undefined && { published: Boolean(published) }),
        ...(publishedAt && { publishedAt: new Date(publishedAt) }),
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Admin blog PUT error:", error);
    return NextResponse.json({ error: "Failed to update post." }, { status: 500 });
  }
}

// ── DELETE: remove a blog post ──────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Post ID is required." }, { status: 400 });
    }

    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin blog DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete post." }, { status: 500 });
  }
}
