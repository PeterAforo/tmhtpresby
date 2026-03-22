import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHero } from "@/components/layout/PageHero";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events and activities at The Most Holy Trinity Presbyterian Church.",
};

const categoryColors: Record<string, string> = {
  worship: "bg-[var(--primary)]/10 text-[var(--primary)]",
  youth: "bg-[var(--accent)]/10 text-[var(--accent)]",
  women: "bg-pink-500/10 text-pink-600",
  men: "bg-blue-500/10 text-blue-600",
  outreach: "bg-amber-500/10 text-amber-600",
  family: "bg-purple-500/10 text-purple-600",
  prayer: "bg-emerald-500/10 text-emerald-600",
  conference: "bg-indigo-500/10 text-indigo-600",
  special: "bg-[var(--accent)]/10 text-[var(--accent)]",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

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

export default async function EventsPage() {
  const events = await getEvents();

  const featured = events.filter((e) => e.isFeatured);
  const upcoming = events.filter((e) => !e.isFeatured);

  return (
    <>
      <PageHero
        overline="What's Happening"
        title="Upcoming Events"
        subtitle="There's always something happening at Most Holy Trinity. Come be a part of it."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Featured events */}
          {featured.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {featured.map((event) => (
                <Link key={event.id} href={`/events/${event.slug}`}
                  className="relative rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:shadow-lg transition-all duration-200">
                  <div className="h-2 bg-gradient-to-r from-[var(--accent)] to-[var(--primary)]" />
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", categoryColors[event.category] || "bg-gray-100 text-gray-600")}>
                        {event.category}
                      </span>
                      <span className="text-xs text-[var(--accent)] font-semibold uppercase tracking-wider">Featured</span>
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--text)] mb-2">{event.title}</h3>
                    {event.description && (
                      <p className="text-sm text-[var(--text-muted)] mb-4 leading-relaxed line-clamp-2">{event.description}</p>
                    )}
                    <div className="space-y-1.5 text-sm text-[var(--text-muted)]">
                      <div className="flex items-center gap-2"><Calendar size={14} className="text-[var(--accent)]" /> {formatDate(event.startDate)}</div>
                      {event.startTime && <div className="flex items-center gap-2"><Clock size={14} className="text-[var(--accent)]" /> {event.startTime}{event.endTime ? ` – ${event.endTime}` : ""}</div>}
                      {event.location && <div className="flex items-center gap-2"><MapPin size={14} className="text-[var(--accent)]" /> {event.location}</div>}
                      {event._count.rsvps > 0 && <div className="flex items-center gap-2"><Users size={14} className="text-[var(--accent)]" /> {event._count.rsvps} registered</div>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Upcoming events */}
          {upcoming.length > 0 && (
            <>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)] mb-6">
                All Upcoming Events
              </h2>
              <div className="space-y-4">
                {upcoming.map((event) => (
                  <Link key={event.id} href={`/events/${event.slug}`}
                    className="flex flex-col sm:flex-row gap-4 p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:shadow-md transition-all duration-200">
                    <div className="shrink-0 w-16 h-16 rounded-lg bg-[var(--accent)]/10 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-semibold text-[var(--accent)] uppercase">
                        {event.startDate.toLocaleDateString("en-GB", { month: "short" })}
                      </span>
                      <span className="text-xl font-bold text-[var(--text)]">
                        {event.startDate.getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn("inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-1", categoryColors[event.category] || "bg-gray-100 text-gray-600")}>
                        {event.category}
                      </span>
                      <h3 className="text-base font-semibold text-[var(--text)] mb-1">{event.title}</h3>
                      {event.description && <p className="text-sm text-[var(--text-muted)] mb-2 line-clamp-1">{event.description}</p>}
                      <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
                        {event.startTime && <span className="flex items-center gap-1"><Clock size={12} /> {event.startTime}{event.endTime ? ` – ${event.endTime}` : ""}</span>}
                        {event.location && <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {events.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-[var(--text-muted)]">No upcoming events. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
