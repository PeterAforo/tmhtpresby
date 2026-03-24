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

    const devotionals = await prisma.devotional.findMany({
      orderBy: { publishDate: "desc" },
    });

    return NextResponse.json({ devotionals });
  } catch (error) {
    console.error("Error fetching devotionals:", error);
    return NextResponse.json({ error: "Failed to fetch devotionals" }, { status: 500 });
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

    const { title, coverImage, scripture, scriptureText, content, prayer, keyNote, author, publishDate, published } = await req.json();

    if (!title || !scripture || !author || !publishDate) {
      return NextResponse.json({ error: "Title, scripture, author, and publish date are required" }, { status: 400 });
    }

    const devotional = await prisma.devotional.create({
      data: {
        title,
        coverImage: coverImage || null,
        scripture,
        scriptureText: scriptureText || null,
        content: content || null,
        prayer: prayer || null,
        keyNote: keyNote || null,
        author,
        publishDate: new Date(publishDate),
        published: published !== false,
      },
    });

    return NextResponse.json(devotional, { status: 201 });
  } catch (error) {
    console.error("Error creating devotional:", error);
    return NextResponse.json({ error: "Failed to create devotional" }, { status: 500 });
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
    const { id, title, coverImage, scripture, scriptureText, content, prayer, keyNote, author, publishDate, published } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (coverImage !== undefined) updateData.coverImage = coverImage || null;
    if (scripture !== undefined) updateData.scripture = scripture;
    if (scriptureText !== undefined) updateData.scriptureText = scriptureText || null;
    if (content !== undefined) updateData.content = content || null;
    if (prayer !== undefined) updateData.prayer = prayer || null;
    if (keyNote !== undefined) updateData.keyNote = keyNote || null;
    if (author !== undefined) updateData.author = author;
    if (publishDate !== undefined) updateData.publishDate = new Date(publishDate);
    if (published !== undefined) updateData.published = published;

    const devotional = await prisma.devotional.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(devotional);
  } catch (error) {
    console.error("Error updating devotional:", error);
    return NextResponse.json({ error: "Failed to update devotional" }, { status: 500 });
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

    await prisma.devotional.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting devotional:", error);
    return NextResponse.json({ error: "Failed to delete devotional" }, { status: 500 });
  }
}
