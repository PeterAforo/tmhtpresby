import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import Link from "next/link";
import { Bell, Camera, Video, Calendar, BookOpen, Heart } from "lucide-react";

export const metadata = {
  title: "Media",
  description: "Explore our media resources including announcements, gallery, videos, and more.",
};

const MEDIA_SECTIONS = [
  {
    title: "Announcements",
    description: "Stay updated with the latest church news and announcements.",
    href: "/announcements",
    icon: Bell,
  },
  {
    title: "Photo Gallery",
    description: "Browse photos from our services, events, and community activities.",
    href: "/gallery",
    icon: Camera,
  },
  {
    title: "Videos",
    description: "Watch sermons, worship sessions, and special event recordings.",
    href: "/videos",
    icon: Video,
  },
  {
    title: "Events",
    description: "Discover upcoming events and activities at our church.",
    href: "/events",
    icon: Calendar,
  },
  {
    title: "Resources",
    description: "Access devotionals, study materials, and other spiritual resources.",
    href: "/resources",
    icon: BookOpen,
  },
  {
    title: "Community Impact",
    description: "See how we're making a difference in our community.",
    href: "/community-impact",
    icon: Heart,
  },
];

export default function MediaPage() {
  return (
    <>
      <PageHeroWithBackground
        pageSlug="media"
        overline="Explore"
        title="Media Center"
        subtitle="Access all our media resources in one place"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MEDIA_SECTIONS.map((section) => {
                const Icon = section.icon;
                return (
                  <Link
                    key={section.title}
                    href={section.href}
                    className="group bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border)] hover:border-[var(--primary)]/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[var(--primary)]/10 rounded-full flex items-center justify-center group-hover:bg-[var(--primary)] transition-colors">
                        <Icon className="w-6 h-6 text-[var(--primary)] group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-[var(--text)] mb-1 group-hover:text-[var(--primary)] transition-colors">
                          {section.title}
                        </h2>
                        <p className="text-sm text-[var(--text-muted)]">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
