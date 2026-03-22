import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { Play, Clock, User } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getSeries(slug: string) {
  return prisma.sermonSeries.findUnique({
    where: { slug },
    include: {
      sermons: {
        where: { published: true },
        include: { speaker: { select: { name: true } } },
        orderBy: { date: "desc" },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const series = await getSeries(slug);
  if (!series) return { title: "Series Not Found" };
  return {
    title: series.title,
    description: series.description || `Sermons from the "${series.title}" series.`,
  };
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  return `${Math.floor(seconds / 60)} min`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function SeriesDetailPage({ params }: Props) {
  const { slug } = await params;
  const series = await getSeries(slug);

  if (!series) notFound();

  return (
    <>
      <PageHeroWithBackground
        pageSlug={`sermons-series-${series.slug}`}
        overline="Sermon Series"
        title={series.title}
        subtitle={series.description || `${series.sermons.length} sermons in this series.`}
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.sermons.map((sermon) => (
              <Link
                key={sermon.id}
                href={`/sermons/${sermon.slug}`}
                className="group rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:shadow-lg transition-all duration-200"
              >
                <div className="relative aspect-video bg-gradient-to-br from-[var(--primary)]/15 to-[var(--accent)]/10 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Play size={24} className="text-[var(--accent)] ml-1" />
                  </div>
                  {sermon.duration && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs font-medium">
                      {formatDuration(sermon.duration)}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-[var(--text)] mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                    {sermon.title}
                  </h3>
                  {sermon.scripture && (
                    <p className="text-xs text-[var(--text-muted)] mb-3">
                      {sermon.scripture}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {sermon.speaker.name.split(" ").slice(-1)[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatDate(sermon.date)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
