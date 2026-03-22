import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "News",
  description: "Latest news and updates from The Most Holy Trinity Presbyterian Church.",
};

export default function NewsPage() {
  return (
    <>
      <PageHeroWithBackground
        pageSlug="news"
        overline="Stay Updated"
        title="Church News"
        subtitle="Latest updates and happenings from our community"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6">
              {/* Redirect to announcements and blog */}
              <div className="bg-[var(--bg-card)] rounded-xl p-8 border border-[var(--border)] text-center">
                <h2 className="text-xl font-semibold text-[var(--text)] mb-4">
                  Looking for the latest updates?
                </h2>
                <p className="text-[var(--text-muted)] mb-6">
                  Check out our announcements and blog for the most recent news from our church community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/announcements"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Announcements
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--primary)] text-[var(--primary)] font-semibold rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors"
                  >
                    Blog
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
