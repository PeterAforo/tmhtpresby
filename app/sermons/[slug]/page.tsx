import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SermonPlayer } from "@/components/media/SermonPlayer";
import { Calendar, Clock, BookOpen, User, ChevronLeft, Share2, Eye, Video, Headphones, FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getSermon(slug: string) {
  const sermon = await prisma.sermon.findUnique({
    where: { slug, published: true },
    include: {
      speaker: true,
      series: { include: { sermons: { where: { published: true }, orderBy: { date: "desc" }, take: 6, include: { speaker: { select: { name: true } } } } } },
    },
  });
  return sermon;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sermon = await getSermon(slug);
  if (!sermon) return { title: "Sermon Not Found" };
  return {
    title: sermon.title,
    description: sermon.description || `Listen to "${sermon.title}" by ${sermon.speaker.name}`,
  };
}

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

export default async function SermonDetailPage({ params }: Props) {
  const { slug } = await params;
  const sermon = await getSermon(slug);

  if (!sermon) notFound();

  // Increment view count (fire-and-forget)
  prisma.sermon.update({ where: { id: sermon.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  const otherInSeries = sermon.series?.sermons.filter((s) => s.id !== sermon.id) || [];

  return (
    <>
      {/* Back nav */}
      <div className="bg-[var(--bg)] border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/sermons"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Sermons
          </Link>
        </div>
      </div>

      <section className="py-8 lg:py-12 bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Media type badge */}
              <div className="flex items-center gap-2 mb-4">
                {sermon.mediaType === "video" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold">
                    <Video size={14} /> Video Sermon
                  </span>
                )}
                {sermon.mediaType === "audio" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-xs font-semibold">
                    <Headphones size={14} /> Audio Sermon
                  </span>
                )}
                {sermon.mediaType === "text" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
                    <FileText size={14} /> Written Sermon
                  </span>
                )}
              </div>

              {/* Player - only show for video/audio */}
              {(sermon.mediaType === "video" || sermon.mediaType === "audio") && (
                <SermonPlayer
                  videoUrl={sermon.videoUrl}
                  audioUrl={sermon.audioUrl}
                  youtubeId={sermon.youtubeId}
                  title={sermon.title}
                  thumbnailUrl={sermon.thumbnailUrl}
                />
              )}

              {/* Title + Meta */}
              <div className={sermon.mediaType === "text" ? "" : "mt-6"}>
                {sermon.series && (
                  <Link
                    href={`/sermons/series/${sermon.series.slug}`}
                    className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider hover:underline"
                  >
                    {sermon.series.title}
                  </Link>
                )}
                <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[var(--text)] mt-1 mb-4">
                  {sermon.title}
                </h1>

                <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)] mb-6">
                  <span className="flex items-center gap-1.5">
                    <User size={14} className="text-[var(--accent)]" />
                    {sermon.speaker.name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-[var(--accent)]" />
                    {formatDate(sermon.date)}
                  </span>
                  {sermon.duration && (
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-[var(--accent)]" />
                      {formatDuration(sermon.duration)}
                    </span>
                  )}
                  {sermon.scripture && (
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={14} className="text-[var(--accent)]" />
                      {sermon.scripture}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Eye size={14} />
                    {sermon.viewCount.toLocaleString()} views
                  </span>
                </div>

                {sermon.description && (
                  <div className="prose prose-sm max-w-none text-[var(--text-muted)] leading-relaxed mb-6">
                    <p>{sermon.description}</p>
                  </div>
                )}

                {/* Document download link */}
                {sermon.documentUrl && (
                  <a
                    href={sermon.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity mb-6"
                  >
                    <Download size={16} />
                    Download Sermon PDF
                  </a>
                )}

                {/* Full sermon text content */}
                {sermon.content && (
                  <div className="mt-6 p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                    <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                      <FileText size={18} className="text-[var(--accent)]" />
                      {sermon.mediaType === "text" ? "Sermon Message" : "Sermon Transcript"}
                    </h2>
                    <div 
                      className="prose prose-sm max-w-none text-[var(--text-muted)] leading-relaxed
                        prose-headings:text-[var(--text)] prose-headings:font-[family-name:var(--font-heading)]
                        prose-p:text-[var(--text-muted)]
                        prose-strong:text-[var(--text)]
                        prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline
                        prose-blockquote:border-l-[var(--accent)] prose-blockquote:text-[var(--text-muted)] prose-blockquote:italic"
                      dangerouslySetInnerHTML={{ __html: sermon.content }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Speaker card */}
              <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Speaker</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-bold text-sm">
                    {sermon.speaker.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">{sermon.speaker.name}</p>
                    {sermon.speaker.title && (
                      <p className="text-xs text-[var(--text-muted)]">{sermon.speaker.title}</p>
                    )}
                  </div>
                </div>
                {sermon.speaker.bio && (
                  <p className="mt-3 text-xs text-[var(--text-muted)] leading-relaxed line-clamp-4">
                    {sermon.speaker.bio}
                  </p>
                )}
              </div>

              {/* More in series */}
              {otherInSeries.length > 0 && sermon.series && (
                <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-[var(--text)]">
                      More in &ldquo;{sermon.series.title}&rdquo;
                    </h3>
                    <Link
                      href={`/sermons/series/${sermon.series.slug}`}
                      className="text-xs text-[var(--accent)] font-semibold hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {otherInSeries.slice(0, 4).map((s) => (
                      <Link
                        key={s.id}
                        href={`/sermons/${s.slug}`}
                        className="block p-3 rounded-lg hover:bg-[var(--bg)] transition-colors"
                      >
                        <p className="text-sm font-medium text-[var(--text)] line-clamp-1">
                          {s.title}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          {s.speaker.name} &middot; {s.scripture}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
