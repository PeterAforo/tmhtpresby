import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHero } from "@/components/layout/PageHero";
import { BookOpen, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sermon Series",
  description: "Browse sermon series from The Most Holy Trinity Presbyterian Church.",
};

async function getSeries() {
  try {
    return await prisma.sermonSeries.findMany({
      include: {
        _count: { select: { sermons: true } },
        sermons: {
          where: { published: true },
          orderBy: { date: "desc" },
          take: 1,
          select: { date: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching sermon series:", error);
    return [];
  }
}

export default async function SermonSeriesListPage() {
  const allSeries = await getSeries();

  return (
    <>
      <PageHero
        overline="Media"
        title="Sermon Series"
        subtitle="Explore our teaching series for deeper study and growth."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allSeries.map((s) => (
              <Link
                key={s.id}
                href={`/sermons/series/${s.slug}`}
                className="group flex flex-col p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                    <BookOpen size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      {s._count.sermons} sermon{s._count.sermons !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                {s.description && (
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 flex-1 line-clamp-2">
                    {s.description}
                  </p>
                )}
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] group-hover:gap-2.5 transition-all duration-200">
                  View Series <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>

          {allSeries.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-[var(--text-muted)]">No series available yet.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
