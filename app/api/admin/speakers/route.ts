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

    const speakers = await prisma.speaker.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { sermons: true } },
      },
    });

    return NextResponse.json({ speakers });
  } catch (error) {
    console.error("Error fetching speakers:", error);
    return NextResponse.json({ error: "Failed to fetch speakers" }, { status: 500 });
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

    const { name, title, bio, imageUrl } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const speaker = await prisma.speaker.create({
      data: {
        name,
        title: title || null,
        bio: bio || null,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(speaker, { status: 201 });
  } catch (error) {
    console.error("Error creating speaker:", error);
    return NextResponse.json({ error: "Failed to create speaker" }, { status: 500 });
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

    const { id, name, title, bio, imageUrl } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const speaker = await prisma.speaker.update({
      where: { id },
      data: {
        name: name || undefined,
        title: title !== undefined ? title || null : undefined,
        bio: bio !== undefined ? bio || null : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl || null : undefined,
      },
    });

    return NextResponse.json(speaker);
  } catch (error) {
    console.error("Error updating speaker:", error);
    return NextResponse.json({ error: "Failed to update speaker" }, { status: 500 });
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
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.speaker.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting speaker:", error);
    return NextResponse.json({ error: "Failed to delete speaker" }, { status: 500 });
  }
}
