import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Temporary secret key for one-time image update
const UPDATE_SECRET = "tmht-update-images-2026";

const images = [
  "/img/pictures/2/001.jpg",
  "/img/pictures/2/010.jpg",
  "/img/pictures/2/020.jpg",
  "/img/pictures/2/030.jpg",
  "/img/pictures/2/040.jpg",
  "/img/pictures/2/050.jpg",
  "/img/pictures/2/060.jpg",
  "/img/pictures/2/070.jpg",
  "/img/pictures/2/080.jpg",
  "/img/pictures/2/090.jpg",
];

export async function POST(req: NextRequest) {
  try {
    // Check for secret key
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");
    
    if (secret !== UPDATE_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const events = await prisma.event.findMany({
      select: { id: true, slug: true, title: true },
      orderBy: { startDate: "asc" },
    });

    const updated: string[] = [];

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const imageUrl = images[i % images.length];

      await prisma.event.update({
        where: { id: event.id },
        data: { imageUrl },
      });
      updated.push(`${event.title} -> ${imageUrl}`);
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updated.length} events with images`,
      updated,
    });
  } catch (error) {
    console.error("Error updating event images:", error);
    return NextResponse.json(
      { error: "Failed to update event images" },
      { status: 500 }
    );
  }
}
