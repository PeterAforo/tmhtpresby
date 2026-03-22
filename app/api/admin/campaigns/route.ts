import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ── GET: list campaigns ─────────────────────────────────────────
export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error("Campaigns GET error:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns." }, { status: 500 });
  }
}

// ── POST: create a campaign ─────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, subject, content, channel, audience, scheduledAt } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
    }

    const campaign = await prisma.campaign.create({
      data: {
        title: title.trim(),
        subject: subject?.trim() || null,
        content: content.trim(),
        channel: channel || "email",
        audience: audience || "all",
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: "draft",
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error("Campaigns POST error:", error);
    return NextResponse.json({ error: "Failed to create campaign." }, { status: 500 });
  }
}

// ── PATCH: send/update a campaign ───────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action } = body;

    if (!id) {
      return NextResponse.json({ error: "Campaign ID is required." }, { status: 400 });
    }

    if (action === "send") {
      const campaign = await prisma.campaign.findUnique({ where: { id } });
      if (!campaign) {
        return NextResponse.json({ error: "Campaign not found." }, { status: 404 });
      }

      // Determine audience count
      const audienceFilter = campaign.audience === "all"
        ? {}
        : campaign.audience === "members"
          ? { role: { in: ["member", "ministry_leader", "pastor", "super_admin"] } }
          : campaign.audience === "visitors"
            ? { role: "visitor" }
            : { ministryGroup: campaign.audience };

      const users = await prisma.user.findMany({
        where: { isActive: true, ...audienceFilter },
        select: { id: true, email: true, firstName: true },
      });

      // Create in-app notifications for all targeted users
      if (users.length > 0) {
        await prisma.notification.createMany({
          data: users.map((u) => ({
            userId: u.id,
            title: campaign.title,
            message: campaign.content.substring(0, 200),
            type: "campaign",
          })),
        });
      }

      // Mark campaign as sent
      await prisma.campaign.update({
        where: { id },
        data: { status: "sent", sentAt: new Date(), sentCount: users.length },
      });

      // TODO: integrate Resend for email, mNotify for SMS when API keys available

      return NextResponse.json({ success: true, sentCount: users.length });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("Campaigns PATCH error:", error);
    return NextResponse.json({ error: "Failed to process campaign." }, { status: 500 });
  }
}
