import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PageHero } from "@/components/layout/PageHero";
import { BookOpen, Calendar, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Daily Devotionals",
  description: "Daily devotional readings from The Most Holy Trinity Presbyterian Church.",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
}

async function getDevotionals() {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return await prisma.devotional.findMany({
      where: { published: true, publishDate: { lte: today } },
      orderBy: { publishDate: "desc" },
      take: 30,
    });
  } catch (error) {
    console.error("Error fetching devotionals:", error);
    return [];
  }
}

export default async function DevotionalsPage() {
  const devotionals = await getDevotionals();

  const todayDevo = devotionals.length > 0 ? devotionals[0] : null;
  const past = devotionals.slice(1);

  return (
    <>
      <PageHero
        overline="Daily Word"
        title="Devotionals"
        subtitle="Start each day with scripture, reflection, and prayer."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Today's devotional */}
          {todayDevo && (
            <div className="mb-14">
              <div className="flex items-center gap-2 text-xs text-[var(--accent)] font-semibold uppercase tracking-wider mb-4">
                <BookOpen size={14} />
                Latest Devotional
              </div>
              <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-6 sm:p-8">
                <p className="text-xs text-[var(--text-muted)] mb-2 flex items-center gap-2">
                  <Calendar size={12} /> {formatDate(todayDevo.publishDate)}
                </p>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)] mb-2">
                  {todayDevo.title}
                </h2>
                <p className="text-sm font-semibold text-[var(--accent)] mb-6 italic">
                  {todayDevo.scripture}
                </p>
                <div
                  className="prose prose-sm max-w-none text-[var(--text-muted)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: todayDevo.content }}
                />
                <p className="mt-6 text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <User size={12} /> {todayDevo.author}
                </p>
              </div>
            </div>
          )}

          {/* Past devotionals */}
          {past.length > 0 && (
            <>
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--text)] mb-6">
                Previous Devotionals
              </h2>
              <div className="space-y-4">
                {past.map((devo) => (
                  <details
                    key={devo.id}
                    className="group rounded-xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden"
                  >
                    <summary className="flex items-center gap-4 p-5 cursor-pointer hover:bg-[var(--accent)]/5 transition-colors">
                      <div className="shrink-0 w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex flex-col items-center justify-center text-center">
                        <span className="text-xs font-semibold text-[var(--accent)] uppercase">
                          {devo.publishDate.toLocaleDateString("en-GB", { month: "short" })}
                        </span>
                        <span className="text-lg font-bold text-[var(--text)] leading-none">
                          {devo.publishDate.getDate()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-[var(--text)]">{devo.title}</h3>
                        <p className="text-xs text-[var(--text-muted)] italic">{devo.scripture}</p>
                      </div>
                    </summary>
                    <div className="px-5 pb-5 pt-2 border-t border-[var(--border)]">
                      <div
                        className="prose prose-sm max-w-none text-[var(--text-muted)] leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: devo.content }}
                      />
                      <p className="mt-4 text-xs text-[var(--text-muted)] flex items-center gap-1">
                        <User size={12} /> {devo.author}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </>
          )}

          {devotionals.length === 0 && (
            <div className="text-center py-16">
              <BookOpen size={48} className="mx-auto text-[var(--text-muted)] opacity-30 mb-4" />
              <p className="text-lg text-[var(--text-muted)]">No devotionals yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
