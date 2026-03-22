import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { prisma } from "@/lib/db";
import { formatShortDate } from "@/lib/utils";
import { Bell, Calendar } from "lucide-react";

export const metadata = {
  title: "Announcements",
  description: "Stay updated with the latest church announcements and news.",
};

async function getAnnouncements() {
  try {
    const announcements = await prisma.blogPost.findMany({
      where: { 
        published: true,
        category: "announcement",
      },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });
    return announcements;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <>
      <PageHeroWithBackground
        pageSlug="announcements"
        title="Announcements"
        subtitle="Stay updated with the latest church news and announcements"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {announcements.length > 0 ? (
              <div className="space-y-6">
                {announcements.map((announcement) => (
                  <article
                    key={announcement.id}
                    className="bg-[var(--bg-card)] rounded-xl p-6 md:p-8 border border-[var(--border)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[var(--primary)]/10 rounded-full flex items-center justify-center">
                        <Bell className="w-6 h-6 text-[var(--primary)]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-2">
                          <Calendar className="w-4 h-4" />
                          <time>{formatShortDate(announcement.publishedAt)}</time>
                        </div>
                        <h2 className="text-xl font-semibold text-[var(--text)] mb-3">
                          {announcement.title}
                        </h2>
                        <div 
                          className="prose prose-sm text-[var(--text-muted)]"
                          dangerouslySetInnerHTML={{ __html: announcement.content }}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Bell className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-[var(--text)] mb-2">
                  No Announcements
                </h2>
                <p className="text-[var(--text-muted)]">
                  Check back later for church announcements.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
