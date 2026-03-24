import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const event = await prisma.event.update({
      where: { slug },
      data: { likes: { increment: 1 } },
      select: { likes: true },
    });

    return NextResponse.json({ likes: event.likes });
  } catch (error) {
    console.error("Error liking event:", error);
    return NextResponse.json(
      { error: "Failed to like event" },
      { status: 500 }
    );
  }
}
