import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    // Fetch events for this ministry from the Event model
    // Filter by category matching the ministry slug or by a ministry-specific tag
    const events = await prisma.event.findMany({
      where: {
        published: true,
        // Match events that are tagged with this ministry
        OR: [
          { category: slug },
          { slug: { contains: slug } },
        ],
        // Only upcoming events
        startDate: { gte: new Date() },
      },
      orderBy: { startDate: "asc" },
      take: 10,
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        startTime: true,
        endTime: true,
        location: true,
        slug: true,
      },
    });

    // Transform to match the expected format
    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate?.toISOString() || null,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      isRecurring: false,
      recurrencePattern: null,
    }));

    return NextResponse.json({ events: formattedEvents });
  } catch (error) {
    console.error("Ministry events GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ministry events." },
      { status: 500 }
    );
  }
}
