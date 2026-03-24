import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const ADMIN_ROLES = ["super_admin", "pastor", "ministry_leader"];

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get unique notifications (grouped by title, message, type)
    const notifications = await prisma.notification.findMany({
      distinct: ["title", "message", "type"],
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        title: true,
        message: true,
        type: true,
        linkUrl: true,
        createdAt: true,
      },
    });

    // Get count of users for each notification
    const notificationsWithCount = await Promise.all(
      notifications.map(async (notif) => {
        const count = await prisma.notification.count({
          where: {
            title: notif.title,
            message: notif.message,
            type: notif.type,
          },
        });
        return { ...notif, _count: { users: count } };
      })
    );

    return NextResponse.json({ notifications: notificationsWithCount });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, message, type, linkUrl, audience } = await req.json();

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
    }

    // Get users based on audience
    let whereClause: Record<string, unknown> = { isActive: true };
    if (audience === "members") {
      whereClause.role = { in: ["member", "ministry_leader", "pastor", "super_admin"] };
    } else if (audience === "youth") {
      whereClause.ministryGroup = "youth";
    } else if (audience === "adult") {
      whereClause.ministryGroup = "adult";
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: { id: true },
    });

    // Create notifications for all targeted users
    if (users.length > 0) {
      await prisma.notification.createMany({
        data: users.map((user) => ({
          userId: user.id,
          title,
          message,
          type: type || "general",
          linkUrl: linkUrl || null,
        })),
      });
    }

    return NextResponse.json({ success: true, sentTo: users.length });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Notification ID is required" }, { status: 400 });
    }

    // Get the notification to find matching ones
    const notif = await prisma.notification.findUnique({
      where: { id },
      select: { title: true, message: true, type: true },
    });

    if (notif) {
      // Delete all notifications with same title/message/type
      await prisma.notification.deleteMany({
        where: {
          title: notif.title,
          message: notif.message,
          type: notif.type,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
  }
}
