import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const ADMIN_ROLES = ["super_admin", "pastor", "ministry_leader"];

interface RouteContext {
  params: Promise<{ slug: string }>;
}

// GET: Fetch ministry members
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { slug } = await context.params;

    const group = await prisma.leadershipGroup.findFirst({
      where: { slug, type: "ministry" },
    });

    if (!group) {
      return NextResponse.json({ error: "Ministry not found" }, { status: 404 });
    }

    const members = await prisma.ministryMembership.findMany({
      where: { ministryId: group.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: [{ role: "asc" }, { joinedAt: "desc" }],
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Ministry members GET error:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

// POST: Add a member or moderator
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { slug } = await context.params;
    const body = await req.json();
    const { userId, firstName, lastName, role: memberRole } = body;

    const group = await prisma.leadershipGroup.findFirst({
      where: { slug, type: "ministry" },
    });

    if (!group) {
      return NextResponse.json({ error: "Ministry not found" }, { status: 404 });
    }

    let targetUserId = userId;

    // If firstName and lastName provided, find or create user
    if (!userId && firstName && lastName) {
      const user = await prisma.user.findFirst({
        where: {
          firstName: { equals: firstName, mode: "insensitive" },
          lastName: { equals: lastName, mode: "insensitive" },
        },
      });

      if (user) {
        targetUserId = user.id;
      } else {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }

    if (!targetUserId) {
      return NextResponse.json({ error: "User ID or name required" }, { status: 400 });
    }

    // Check if already a member
    const existing = await prisma.ministryMembership.findUnique({
      where: {
        ministryId_userId: {
          ministryId: group.id,
          userId: targetUserId,
        },
      },
    });

    if (existing) {
      // Update role if needed
      const updated = await prisma.ministryMembership.update({
        where: { id: existing.id },
        data: {
          role: memberRole || existing.role,
          status: "approved",
          canViewMembers: memberRole === "moderator" ? true : existing.canViewMembers,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              image: true,
            },
          },
        },
      });
      return NextResponse.json({ member: updated });
    }

    // Create new membership
    const member = await prisma.ministryMembership.create({
      data: {
        ministryId: group.id,
        userId: targetUserId,
        role: memberRole || "member",
        status: memberRole === "moderator" ? "approved" : "pending",
        canViewMembers: memberRole === "moderator",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error("Ministry members POST error:", error);
    return NextResponse.json({ error: "Failed to add member" }, { status: 500 });
  }
}

// PUT: Update member status, role, or permissions
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { memberId, status, role: memberRole, canViewMembers } = body;

    if (!memberId) {
      return NextResponse.json({ error: "Member ID required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) {
      updateData.status = status;
      if (status === "approved") {
        updateData.approvedBy = (session.user as { id?: string }).id;
        updateData.approvedAt = new Date();
      }
    }
    if (memberRole !== undefined) updateData.role = memberRole;
    if (canViewMembers !== undefined) updateData.canViewMembers = canViewMembers;

    const member = await prisma.ministryMembership.update({
      where: { id: memberId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ member });
  } catch (error) {
    console.error("Ministry members PUT error:", error);
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
  }
}

// DELETE: Remove member
export async function DELETE(req: NextRequest, context: RouteContext) {
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
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return NextResponse.json({ error: "Member ID required" }, { status: 400 });
    }

    await prisma.ministryMembership.delete({ where: { id: memberId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ministry members DELETE error:", error);
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
  }
}
