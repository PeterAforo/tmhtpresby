import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatShortDate } from "@/lib/utils";
import { BookOpen, Calendar } from "lucide-react";

export const metadata = {
  title: "Daily Word",
  description: "Daily devotional messages to inspire and guide your spiritual journey.",
};

async function getDevotionals() {
  try {
    return await prisma.devotional.findMany({
      where: { published: true },
      orderBy: { publishDate: "desc" },
      take: 30,
    });
  } catch (error) {
    console.error("Error fetching devotionals:", error);
    return [];
  }
}

export default async function DailyWordPage() {
  const devotionals = await getDevotionals();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayDevotional = devotionals.find((d) => {
    const pubDate = new Date(d.publishDate);
    pubDate.setHours(0, 0, 0, 0);
    return pubDate.getTime() === today.getTime();
  });

  return (
    <>
      <PageHeroWithBackground
        pageSlug="daily-word"
        title="Daily Word"
        subtitle="Daily devotional messages to inspire and guide your spiritual journey"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {todayDevotional ? (
            <div className="max-w-3xl mx-auto mb-16">
              <div className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 rounded-2xl p-8 md:p-12">
                <div className="flex items-center gap-2 text-[var(--accent)] mb-4">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm font-medium">Today&apos;s Devotional</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-[var(--text)] mb-4">
                  {todayDevotional.title}
                </h2>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  {todayDevotional.scripture}
                </p>
                <div 
                  className="prose prose-lg text-[var(--text-muted)] mb-6"
                  dangerouslySetInnerHTML={{ __html: todayDevotional.content || "" }}
                />
                <p className="text-sm text-[var(--text-muted)]">
                  {formatShortDate(todayDevotional.publishDate)}
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <div className="bg-[var(--bg-card)] rounded-2xl p-8 md:p-12 border border-[var(--border)]">
                <BookOpen className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-[var(--text)] mb-2">
                  No Devotional Today
                </h2>
                <p className="text-[var(--text-muted)]">
                  Check back later for today&apos;s devotional message.
                </p>
              </div>
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-[var(--text)] mb-6">
              Recent Devotionals
            </h3>
            <div className="space-y-4">
              {devotionals.length > 0 ? (
                devotionals.map((devotional) => (
                  <Link
                    key={devotional.id}
                    href={`/devotionals/${devotional.id}`}
                    className="block bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-[var(--text)] mb-1">
                          {devotional.title}
                        </h4>
                        <p className="text-sm text-[var(--text-muted)]">
                          {devotional.scripture}
                        </p>
                      </div>
                      <span className="text-sm text-[var(--text-muted)] whitespace-nowrap">
                        {formatShortDate(devotional.publishDate)}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-[var(--text-muted)] py-8">
                  No devotionals available yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
