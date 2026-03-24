import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== "tmht-debug-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@tmhtpresby.org" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        hashedPassword: true,
      },
    });

    if (!adminUser) {
      return NextResponse.json({
        exists: false,
        message: "Admin user does not exist",
      });
    }

    // Test password
    const testPassword = "Church2026!";
    const passwordMatch = adminUser.hashedPassword
      ? await bcrypt.compare(testPassword, adminUser.hashedPassword)
      : false;

    return NextResponse.json({
      exists: true,
      email: adminUser.email,
      name: `${adminUser.firstName} ${adminUser.lastName}`,
      role: adminUser.role,
      hasPassword: !!adminUser.hashedPassword,
      passwordMatch,
    });
  } catch (error) {
    console.error("Debug auth error:", error);
    return NextResponse.json(
      { error: "Database error", details: String(error) },
      { status: 500 }
    );
  }
}
