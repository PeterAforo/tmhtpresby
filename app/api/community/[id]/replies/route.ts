import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// ── GET: list replies for a post ────────────────────────────────
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const replies = await prisma.discussionReply.findMany({
      where: { postId: id, isFlagged: false },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, image: true, role: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ replies });
  } catch (error) {
    console.error("Replies GET error:", error);
    return NextResponse.json({ error: "Failed to fetch replies." }, { status: 500 });
  }
}

// ── POST: create a reply ────────────────────────────────────────
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: "Reply content is required." }, { status: 400 });
    }

    // Verify post exists
    const post = await prisma.discussionPost.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const reply = await prisma.discussionReply.create({
      data: {
        content: content.trim(),
        postId: id,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, image: true, role: true },
        },
      },
    });

    return NextResponse.json({ reply }, { status: 201 });
  } catch (error) {
    console.error("Reply POST error:", error);
    return NextResponse.json({ error: "Failed to create reply." }, { status: 500 });
  }
}
