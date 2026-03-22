import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHero } from "@/components/layout/PageHero";
import { RsvpForm } from "@/components/events/RsvpForm";
import { Calendar, MapPin, Clock, Users, ArrowLeft, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) return { title: "Event Not Found" };
  return {
    title: event.title,
    description: event.description || `Join us for ${event.title} at Most Holy Trinity Presbyterian Church.`,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug, published: true },
    include: { _count: { select: { rsvps: true } } },
  });

  if (!event) notFound();

  const isPast = event.startDate < new Date();
  const spotsLeft = event.capacity ? event.capacity - event._count.rsvps : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  return (
    <>
      <PageHero
        overline={event.category.charAt(0).toUpperCase() + event.category.slice(1)}
        title={event.title}
        subtitle={event.description || undefined}
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Events
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Details card */}
              <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold",
                      categoryColors[event.category] || "bg-gray-100 text-gray-600"
                    )}
                  >
                    {event.category}
                  </span>
                  {event.isFeatured && (
                    <span className="text-xs text-[var(--accent)] font-semibold uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                  {isPast && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">
                      Past Event
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-[var(--text)]">
                    <Calendar size={18} className="text-[var(--accent)] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">{formatDate(event.startDate)}</p>
                      {event.endDate && event.endDate.toDateString() !== event.startDate.toDateString() && (
                        <p className="text-sm text-[var(--text-muted)]">to {formatDate(event.endDate)}</p>
                      )}
                    </div>
                  </div>

                  {(event.startTime || event.endTime) && (
                    <div className="flex items-center gap-3 text-[var(--text)]">
                      <Clock size={18} className="text-[var(--accent)] shrink-0" />
                      <p className="font-medium">
                        {event.startTime}
                        {event.endTime ? ` – ${event.endTime}` : ""}
                      </p>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-center gap-3 text-[var(--text)]">
                      <MapPin size={18} className="text-[var(--accent)] shrink-0" />
                      <p className="font-medium">{event.location}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-[var(--text)]">
                    <Users size={18} className="text-[var(--accent)] shrink-0" />
                    <p className="font-medium">
                      {event._count.rsvps} registered
                      {event.capacity && (
                        <span className="text-sm text-[var(--text-muted)]"> / {event.capacity} spots</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <div className="prose prose-sm max-w-none text-[var(--text-muted)] leading-relaxed">
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text)] mb-3">
                    About This Event
                  </h3>
                  <p className="whitespace-pre-line">{event.description}</p>
                </div>
              )}
            </div>

            {/* Sidebar: RSVP */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {!isPast ? (
                  <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-6">
                    <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text)] mb-1">
                      Register
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mb-5">
                      {isFull
                        ? "This event is currently full."
                        : spotsLeft
                          ? `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} remaining`
                          : "Secure your spot today."}
                    </p>
                    {!isFull && <RsvpForm eventId={event.id} />}
                  </div>
                ) : (
                  <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-6 text-center">
                    <p className="text-sm text-[var(--text-muted)]">This event has already taken place.</p>
                    <Link
                      href="/events"
                      className="inline-block mt-4 text-sm font-semibold text-[var(--accent)] hover:underline"
                    >
                      Browse upcoming events →
                    </Link>
                  </div>
                )}

                {/* Share */}
                <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
                    <Share2 size={16} className="text-[var(--accent)]" />
                    Share this event
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Invite friends and family to join you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
