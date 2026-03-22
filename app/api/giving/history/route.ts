import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const donor = await prisma.donor.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        donations: {
          where: { status: "completed" },
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!donor) {
      return NextResponse.json({ donations: [], totalGiven: 0 });
    }

    const totalGiven = donor.donations.reduce((sum, d) => sum + d.amount, 0);

    return NextResponse.json({
      donor: {
        firstName: donor.firstName,
        lastName: donor.lastName,
        email: donor.email,
      },
      donations: donor.donations,
      totalGiven,
    });
  } catch (error) {
    console.error("Donation history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch donation history." },
      { status: 500 }
    );
  }
}
