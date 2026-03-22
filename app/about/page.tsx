import type { Metadata } from "next";
import Link from "next/link";
import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { StaggerChildren } from "@/components/animations/StaggerChildren";
import { BookOpen, Users, Eye, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about The Most Holy Trinity Presbyterian Church \u2014 our story, beliefs, leadership, and vision.",
};

const ABOUT_LINKS = [
  {
    icon: BookOpen,
    title: "Our Story",
    description: "How Most Holy Trinity began and the journey that has shaped who we are today.",
    href: "/about/our-story",
  },
  {
    icon: Eye,
    title: "Our Beliefs",
    description: "The core doctrines and theological convictions that anchor our faith and practice.",
    href: "/about/beliefs",
  },
  {
    icon: Users,
    title: "Our Leadership",
    description: "Meet the pastors, elders, and leaders who guide our church family.",
    href: "/about/leadership",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description: "Where we\u2019re headed \u2014 the mission, vision, and values that drive everything we do.",
    href: "/about/vision",
  },
];

export default function AboutIndexPage() {
  return (
    <>
      <PageHeroWithBackground
        pageSlug="about"
        overline="Who We Are"
        title="About Us"
        subtitle="A Christ-centred, Bible-believing community rooted in the Reformed tradition and committed to God\u2019s glory."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-5" stagger={0.12}>
            {ABOUT_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex flex-col p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:shadow-lg transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 flex-1">
                    {link.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] group-hover:gap-2.5 transition-all duration-200">
                    Learn More <ArrowRight size={16} />
                  </span>
                </Link>
              );
            })}
          </StaggerChildren>
        </div>
      </section>
    </>
  );
}
