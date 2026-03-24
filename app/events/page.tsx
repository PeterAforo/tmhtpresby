import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { Calendar, MapPin, Clock, Users, ArrowRight, Sparkles, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { EventsClient } from "@/components/events/EventsClient";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events and activities at The Most Holy Trinity Presbyterian Church.",
};

async function getEvents() {
  try {
    const now = new Date();
    return await prisma.event.findMany({
      where: { published: true, startDate: { gte: now } },
      orderBy: { startDate: "asc" },
      include: { _count: { select: { rsvps: true } } },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

async function getPastEvents() {
  try {
    const now = new Date();
    return await prisma.event.findMany({
      where: { published: true, startDate: { lt: now } },
      orderBy: { startDate: "desc" },
      take: 6,
      include: { _count: { select: { rsvps: true } } },
    });
  } catch (error) {
    console.error("Error fetching past events:", error);
    return [];
  }
}

export default async function EventsPage() {
  const [events, pastEvents] = await Promise.all([getEvents(), getPastEvents()]);

  const featured = events.filter((e) => e.isFeatured);
  const upcoming = events.filter((e) => !e.isFeatured);

  // Get unique categories
  const categories = Array.from(new Set(events.map((e) => e.category)));

  return (
    <>
      <PageHeroWithBackground
        pageSlug="events"
        overline="What's Happening"
        title="Upcoming Events"
        subtitle="There's always something happening at The Most Holy Trinity. Come be a part of it."
      />

      <EventsClient
        featured={featured}
        upcoming={upcoming}
        pastEvents={pastEvents}
        categories={categories}
      />
    </>
  );
}
