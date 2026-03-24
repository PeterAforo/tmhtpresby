import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { BookOpen, Calendar, User, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

async function getDevotional(id: string) {
  try {
    return await prisma.devotional.findUnique({
      where: { id, published: true },
    });
  } catch (error) {
    console.error("Error fetching devotional:", error);
    return null;
  }
}

async function getAdjacentDevotionals(publishDate: Date) {
  try {
    const [prev, next] = await Promise.all([
      prisma.devotional.findFirst({
        where: { published: true, publishDate: { lt: publishDate } },
        orderBy: { publishDate: "desc" },
        select: { id: true, title: true },
      }),
      prisma.devotional.findFirst({
        where: { published: true, publishDate: { gt: publishDate } },
        orderBy: { publishDate: "asc" },
        select: { id: true, title: true },
      }),
    ]);
    return { prev, next };
  } catch (error) {
    console.error("Error fetching adjacent devotionals:", error);
    return { prev: null, next: null };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const devotional = await getDevotional(id);

  if (!devotional) {
    return { title: "Devotional Not Found" };
  }

  return {
    title: devotional.title,
    description: `${devotional.scripture} - Daily devotional from The Most Holy Trinity Presbyterian Church.`,
  };
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function DevotionalDetailPage({ params }: Props) {
  const { id } = await params;
  const devotional = await getDevotional(id);

  if (!devotional) {
    notFound();
  }

  const { prev, next } = await getAdjacentDevotionals(devotional.publishDate);

  return (
    <>
      <PageHeroWithBackground
        pageSlug={`devotionals-${devotional.id}`}
        overline="Daily Word"
        title={devotional.title}
        subtitle={devotional.scripture}
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/devotionals"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Devotionals
          </Link>

          {/* Main content */}
          <article className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-6 sm:p-8">
            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
              <Calendar size={14} className="text-[var(--accent)]" />
              {formatDate(devotional.publishDate)}
            </div>

            {/* Scripture */}
            <blockquote className="border-l-4 border-[var(--accent)] pl-4 mb-8">
              <p className="text-lg font-semibold text-[var(--accent)] italic">
                {devotional.scripture}
              </p>
            </blockquote>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none text-[var(--text)] leading-relaxed
                prose-headings:text-[var(--text)] prose-headings:font-[family-name:var(--font-heading)]
                prose-p:text-[var(--text-muted)]
                prose-strong:text-[var(--text)]
                prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: devotional.content || "" }}
            />

            {/* Author */}
            <div className="mt-8 pt-6 border-t border-[var(--border)]">
              <p className="text-sm text-[var(--text-muted)] flex items-center gap-2">
                <User size={14} className="text-[var(--accent)]" />
                Written by <span className="font-semibold text-[var(--text)]">{devotional.author}</span>
              </p>
            </div>
          </article>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between gap-4">
            {prev ? (
              <Link
                href={`/devotionals/${prev.id}`}
                className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors group"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Previous</span>
              </Link>
            ) : (
              <div />
            )}

            <Link
              href="/devotionals"
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            >
              <BookOpen size={14} />
              All Devotionals
            </Link>

            {next ? (
              <Link
                href={`/devotionals/${next.id}`}
                className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors group"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
