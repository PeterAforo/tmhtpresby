import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// This endpoint warms up the database connection
export async function GET() {
  try {
    // Simple query to wake up the database
    const count = await prisma.user.count();
    return NextResponse.json({ status: "ok", users: count });
  } catch (error) {
    console.error("Warmup error:", error);
    return NextResponse.json({ status: "error", message: String(error) }, { status: 500 });
  }
}
