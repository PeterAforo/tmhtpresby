import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { name, email, content } = await req.json();

    if (!name || !email || !content) {
      return NextResponse.json(
        { error: "Name, email, and content are required" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Create comment (pending moderation)
    const comment = await prisma.newsComment.create({
      data: {
        postId: post.id,
        authorName: name,
        authorEmail: email,
        content,
        isApproved: false, // Requires moderation
      },
    });

    return NextResponse.json({
      success: true,
      message: "Comment submitted for moderation",
      id: comment.id,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to submit comment" },
      { status: 500 }
    );
  }
}
