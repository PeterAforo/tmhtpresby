import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [allDonations, uniqueDonors, monthlyRecurring] = await Promise.all([
      prisma.donation.findMany({
        where: { status: "completed" },
        include: {
          donor: { select: { firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.donor.count(),
      prisma.donation.count({
        where: { status: "completed", frequency: "monthly" },
      }),
    ]);

    const totalRevenue = allDonations.reduce((sum, d) => sum + d.amount, 0);

    // Revenue by fund
    const byFund: Record<string, number> = {};
    for (const d of allDonations) {
      byFund[d.fund] = (byFund[d.fund] || 0) + d.amount;
    }

    return NextResponse.json({
      totalRevenue,
      totalDonations: allDonations.length,
      uniqueDonors,
      monthlyRecurring,
      byFund,
      recentDonations: allDonations.slice(0, 10),
    });
  } catch (error) {
    console.error("Admin giving error:", error);
    return NextResponse.json(
      { error: "Failed to fetch financial data." },
      { status: 500 }
    );
  }
}
