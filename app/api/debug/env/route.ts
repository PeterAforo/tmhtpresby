import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== "tmht-debug-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    AUTH_URL: process.env.AUTH_URL || "not set",
    VERCEL_URL: process.env.VERCEL_URL || "not set",
    NODE_ENV: process.env.NODE_ENV || "not set",
    hasAuthSecret: !!process.env.AUTH_SECRET,
    hasDbUrl: !!process.env.DATABASE_URL,
  });
}
