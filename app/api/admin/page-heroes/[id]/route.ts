import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
};

// GET single page hero
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const session = await auth();
    if (!session?.user || !["super_admin", "pastor"].includes(session.user.role || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const hero = await prisma.pageHero.findUnique({
      where: { id },
    });

    if (!hero) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(hero);
  } catch (error) {
    console.error("Error fetching page hero:", error);
    return NextResponse.json({ error: "Failed to fetch page hero" }, { status: 500 });
  }
}

// PUT update page hero
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const session = await auth();
    if (!session?.user || !["super_admin", "pastor"].includes(session.user.role || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { pageSlug, title, subtitle, backgroundUrl, overlayColor, isActive } = body;

    const hero = await prisma.pageHero.update({
      where: { id },
      data: {
        ...(pageSlug !== undefined && { pageSlug }),
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(backgroundUrl !== undefined && { backgroundUrl }),
        ...(overlayColor !== undefined && { overlayColor }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(hero);
  } catch (error) {
    console.error("Error updating page hero:", error);
    return NextResponse.json({ error: "Failed to update page hero" }, { status: 500 });
  }
}

// DELETE page hero
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const session = await auth();
    if (!session?.user || !["super_admin", "pastor"].includes(session.user.role || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.pageHero.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting page hero:", error);
    return NextResponse.json({ error: "Failed to delete page hero" }, { status: 500 });
  }
}
