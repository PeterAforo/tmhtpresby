import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// TODO: Add auth middleware when auth system is built (Phase 5)

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── GET: list all sermons (admin view, including unpublished) ─────
export async function GET(req: NextRequest) {
  try {
    const sermons = await prisma.sermon.findMany({
      include: {
        speaker: { select: { id: true, name: true } },
        series: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ sermons });
  } catch (error) {
    console.error("Admin sermons GET error:", error);
    return NextResponse.json({ error: "Failed to fetch sermons." }, { status: 500 });
  }
}

// ── POST: create a new sermon ─────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      scripture,
      description,
      date,
      duration,
      videoUrl,
      audioUrl,
      youtubeId,
      speakerId,
      seriesId,
      published,
    } = body;

    if (!title || !speakerId || !date) {
      return NextResponse.json(
        { error: "Title, speaker, and date are required." },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = slugify(title);
    const existing = await prisma.sermon.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const sermon = await prisma.sermon.create({
      data: {
        title,
        slug,
        scripture: scripture || null,
        description: description || null,
        date: new Date(date),
        duration: duration ? parseInt(duration, 10) : null,
        videoUrl: videoUrl || null,
        audioUrl: audioUrl || null,
        youtubeId: youtubeId || null,
        speakerId,
        seriesId: seriesId || null,
        published: published !== false,
      },
      include: {
        speaker: { select: { id: true, name: true } },
        series: { select: { id: true, title: true, slug: true } },
      },
    });

    return NextResponse.json({ sermon }, { status: 201 });
  } catch (error) {
    console.error("Admin sermons POST error:", error);
    return NextResponse.json({ error: "Failed to create sermon." }, { status: 500 });
  }
}

// ── PUT: update a sermon ──────────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Sermon ID is required." }, { status: 400 });
    }

    // Convert date string to Date object if present
    if (data.date) data.date = new Date(data.date);
    if (data.duration) data.duration = parseInt(data.duration, 10);

    // Nullify empty strings
    for (const key of ["scripture", "description", "videoUrl", "audioUrl", "youtubeId", "seriesId"]) {
      if (data[key] === "") data[key] = null;
    }

    const sermon = await prisma.sermon.update({
      where: { id },
      data,
      include: {
        speaker: { select: { id: true, name: true } },
        series: { select: { id: true, title: true, slug: true } },
      },
    });

    return NextResponse.json({ sermon });
  } catch (error) {
    console.error("Admin sermons PUT error:", error);
    return NextResponse.json({ error: "Failed to update sermon." }, { status: 500 });
  }
}

// ── DELETE: delete a sermon ───────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Sermon ID is required." }, { status: 400 });
    }

    await prisma.sermon.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin sermons DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete sermon." }, { status: 500 });
  }
}
