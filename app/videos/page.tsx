import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { Video, Play } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Videos",
  description: "Watch videos from The Most Holy Trinity Presbyterian Church.",
};

export default function VideosPage() {
  return (
    <>
      <PageHeroWithBackground
        pageSlug="videos"
        title="Video Gallery"
        subtitle="Watch sermons, events, and special moments from our church"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Link
                href="/sermons"
                className="group bg-[var(--bg-card)] rounded-xl overflow-hidden border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
              >
                <div className="aspect-video bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                    Sermon Videos
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    Watch our latest sermons and messages
                  </p>
                </div>
              </Link>

              <Link
                href="/live"
                className="group bg-[var(--bg-card)] rounded-xl overflow-hidden border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
              >
                <div className="aspect-video bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                    Live Stream
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    Watch our live services
                  </p>
                </div>
              </Link>
            </div>

            <div className="text-center py-12 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
              <Video className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[var(--text)] mb-2">
                More Videos Coming Soon
              </h3>
              <p className="text-[var(--text-muted)] mb-6">
                We&apos;re working on adding more video content. Check back soon!
              </p>
              <a
                href="https://youtube.com/@TMHTPresby"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Subscribe on YouTube
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
