import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const ADMIN_ROLES = ["super_admin", "pastor"];

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

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        phone: true,
        role: true,
        ministryGroup: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
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
    const { id, firstName, lastName, email, phone, image, role: userRole, ministryGroup, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Prevent non-super_admin from changing super_admin roles
    const currentUser = (session.user as { role?: string });
    const targetUser = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    
    if (targetUser?.role === "super_admin" && currentUser.role !== "super_admin") {
      return NextResponse.json({ error: "Cannot modify super admin" }, { status: 403 });
    }

    if (userRole === "super_admin" && currentUser.role !== "super_admin") {
      return NextResponse.json({ error: "Cannot assign super admin role" }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone || null;
    if (image !== undefined) updateData.image = image || null;
    if (userRole !== undefined) updateData.role = userRole;
    if (ministryGroup !== undefined) updateData.ministryGroup = ministryGroup || null;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "super_admin") {
      return NextResponse.json({ error: "Only super admins can delete users" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Prevent deleting yourself
    const currentUserId = (session.user as { id?: string }).id;
    if (id === currentUserId) {
      return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    // Prevent deleting other super admins
    const targetUser = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (targetUser?.role === "super_admin") {
      return NextResponse.json({ error: "Cannot delete super admin" }, { status: 403 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
