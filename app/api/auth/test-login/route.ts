import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    console.log("Test login attempt for:", email);

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        hashedPassword: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" });
    }

    if (!user.hashedPassword) {
      return NextResponse.json({ success: false, error: "No password set" });
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      return NextResponse.json({ success: false, error: "Invalid password" });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Test login error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
