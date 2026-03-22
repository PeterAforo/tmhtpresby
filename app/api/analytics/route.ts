import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ── POST: track a page view ────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, referrer, userAgent, userId } = body;

    if (!path) {
      return NextResponse.json({ error: "Path is required." }, { status: 400 });
    }

    await prisma.pageView.create({
      data: {
        path,
        referrer: referrer || null,
        userAgent: userAgent || null,
        userId: userId || null,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Analytics POST error:", error);
    return NextResponse.json({ error: "Failed to track page view." }, { status: 500 });
  }
}
