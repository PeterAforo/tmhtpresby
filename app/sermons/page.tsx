import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { SermonSearch } from "@/components/media/SermonSearch";
import { Play, Clock, User, Video, Headphones, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Sermons",
  description:
    "Watch, listen, and read sermons from The Most Holy Trinity Presbyterian Church.",
};

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  return `${m} min`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getMediaIcon(mediaType: string) {
  switch (mediaType) {
    case "audio":
      return Headphones;
    case "text":
      return FileText;
    default:
      return Video;
  }
}

function getMediaLabel(mediaType: string) {
  switch (mediaType) {
    case "audio":
      return "Listen";
    case "text":
      return "Read";
    default:
      return "Watch";
  }
}

interface PageProps {
  searchParams: Promise<{ type?: string; series?: string; speaker?: string; q?: string }>;
}

export default async function SermonsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const mediaTypeFilter = params.type;
  
  const [sermons, series, speakers] = await Promise.all([
    prisma.sermon.findMany({
      where: { 
        published: true,
        ...(mediaTypeFilter && { mediaType: mediaTypeFilter }),
      },
      include: {
        speaker: { select: { id: true, name: true } },
        series: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { date: "desc" },
      take: 12,
    }),
    prisma.sermonSeries.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true, slug: true, _count: { select: { sermons: true } } },
    }),
    prisma.speaker.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, title: true },
    }),
  ]);

  return (
    <>
      <PageHeroWithBackground
        pageSlug="sermons"
        overline="Media"
        title="Sermons"
        subtitle="Watch, listen, and be transformed by the Word of God."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Client-side search & filter */}
          <SermonSearch
            series={series.map((s) => ({ slug: s.slug, title: s.title, count: s._count.sermons }))}
            speakers={speakers.map((s) => ({ id: s.id, name: s.name }))}
          />

          {/* Sermon grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon) => {
              const MediaIcon = getMediaIcon(sermon.mediaType);
              const mediaLabel = getMediaLabel(sermon.mediaType);
              
              return (
                <Link
                  key={sermon.id}
                  href={`/sermons/${sermon.slug}`}
                  className="group rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:shadow-lg transition-all duration-200"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-[var(--primary)]/15 to-[var(--accent)]/10 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <MediaIcon size={24} className="text-[var(--accent)]" />
                    </div>
                    {/* Media type badge */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[var(--accent)]/90 text-white text-xs font-medium">
                      {mediaLabel}
                    </span>
                    {sermon.duration && (
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs font-medium">
                        {formatDuration(sermon.duration)}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    {sermon.series && (
                      <p className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-1">
                        {sermon.series.title}
                      </p>
                    )}
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
              );
            })}
          </div>

          {sermons.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-[var(--text-muted)]">
                No sermons found. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
