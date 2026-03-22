import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// ── GET: list discussion posts ──────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const posts = await prisma.discussionPost.findMany({
      where: {
        ...(category && category !== "all" ? { category } : {}),
        isFlagged: false,
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, image: true, role: true },
        },
        _count: { select: { replies: true } },
      },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: 50,
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Community GET error:", error);
    return NextResponse.json({ error: "Failed to fetch posts." }, { status: 500 });
  }
}

// ── POST: create a new discussion post ──────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, category } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
    }

    const post = await prisma.discussionPost.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: category || "general",
        authorId: session.user.id,
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, image: true, role: true },
        },
        _count: { select: { replies: true } },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Community POST error:", error);
    return NextResponse.json({ error: "Failed to create post." }, { status: 500 });
  }
}
