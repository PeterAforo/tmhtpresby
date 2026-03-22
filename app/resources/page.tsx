import { PageHero } from "@/components/layout/PageHero";
import { FileText, Download, BookOpen, Music, Video } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Resources",
  description: "Access church resources including bulletins, study materials, and more.",
};

const resourceCategories = [
  {
    icon: FileText,
    title: "Weekly Bulletins",
    description: "Download our weekly church bulletins with service information and announcements.",
    href: "/resources/bulletins",
  },
  {
    icon: BookOpen,
    title: "Bible Study Materials",
    description: "Access study guides and materials for personal and group Bible study.",
    href: "/resources/bible-study",
  },
  {
    icon: Music,
    title: "Hymns & Songs",
    description: "Find lyrics and music for our worship songs and hymns.",
    href: "/resources/hymns",
  },
  {
    icon: Video,
    title: "Video Archives",
    description: "Watch past sermons and special events from our video archive.",
    href: "/sermons",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        title="Resources"
        subtitle="Access church resources to support your spiritual growth"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {resourceCategories.map((resource) => (
              <Link
                key={resource.title}
                href={resource.href}
                className="group bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--primary)]/20 transition-colors">
                    <resource.icon className="w-6 h-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text)] mb-1 group-hover:text-[var(--primary)] transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      {resource.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-[var(--bg-card)] rounded-xl p-8 border border-[var(--border)]">
              <h3 className="text-xl font-semibold text-[var(--text)] mb-4">
                Need Something Specific?
              </h3>
              <p className="text-[var(--text-muted)] mb-6">
                If you&apos;re looking for a specific resource that isn&apos;t listed here, 
                please contact the church office and we&apos;ll be happy to help.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-[var(--primary)] font-medium hover:underline"
              >
                Contact Us
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
