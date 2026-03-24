import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { rating } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
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

    // Get IP address for unique rating per user
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0] || "unknown";

    // Upsert rating (one per IP per post)
    await prisma.newsRating.upsert({
      where: {
        postId_ipAddress: {
          postId: post.id,
          ipAddress,
        },
      },
      update: { rating },
      create: {
        postId: post.id,
        rating,
        ipAddress,
      },
    });

    // Get updated average
    const result = await prisma.newsRating.aggregate({
      where: { postId: post.id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return NextResponse.json({
      average: result._avg.rating || 0,
      count: result._count.rating,
    });
  } catch (error) {
    console.error("Error rating post:", error);
    return NextResponse.json(
      { error: "Failed to rate post" },
      { status: 500 }
    );
  }
}
