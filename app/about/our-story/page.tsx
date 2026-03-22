import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Learn about the history and journey of The Most Holy Trinity Presbyterian Church in Accra, Ghana.",
};

export default function OurStoryPage() {
  return (
    <>
      <PageHero
        overline="About"
        title="Our Story"
        subtitle="How we started and where we are going — a journey of faith rooted in Accra."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Intro */}
          <div className="prose-section">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4">
              A Heritage of Faith
            </h2>
            <div aria-hidden="true" className="h-1 w-12 rounded-full bg-[var(--divider)] mb-6" />
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              The Most Holy Trinity Presbyterian Church was established with a simple
              yet powerful vision: to create a community where individuals and families
              could experience the transforming love of God. From our humble beginnings,
              we have grown into a vibrant congregation that serves the spiritual needs
              of people across Greater Accra.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              Our founders believed that the church should be a beacon of hope — a place
              where anyone, regardless of background or circumstance, could find
              belonging. That same spirit drives everything we do today.
            </p>
          </div>

          {/* Timeline */}
          <div className="mt-12 space-y-10">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[var(--text)] mb-6">
              Key Milestones
            </h2>

            {[
              { year: "1985", title: "Founded", desc: "A small group of faithful believers began meeting for weekly worship and Bible study in a rented hall on Liberation Road." },
              { year: "1992", title: "First Permanent Building", desc: "Through the generous contributions of our members and divine provision, we dedicated our first church building." },
              { year: "2005", title: "Community Outreach Begins", desc: "We launched our first outreach programmes serving vulnerable communities across Accra — food drives, health camps, and education initiatives." },
              { year: "2015", title: "Youth & Children\u2019s Expansion", desc: "Recognising the importance of the next generation, we expanded our facilities and launched dedicated youth and children\u2019s ministry programmes." },
              { year: "2024", title: "Digital Mission", desc: "We embraced technology to reach more people — live streaming services, an online giving platform, and this very website you\u2019re reading." },
            ].map((milestone) => (
              <div key={milestone.year} className="flex gap-6">
                <div className="shrink-0 w-16 text-right">
                  <span className="text-lg font-bold text-[var(--accent)]">
                    {milestone.year}
                  </span>
                </div>
                <div className="relative pl-6 border-l-2 border-[var(--divider)] pb-2">
                  <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-[var(--accent)]" />
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-1">
                    {milestone.title}
                  </h3>
                  <p className="text-[var(--text-muted)] leading-relaxed text-sm">
                    {milestone.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Closing */}
          <div className="mt-16 p-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-center">
            <p className="font-[family-name:var(--font-heading)] text-xl italic text-[var(--text)] leading-relaxed">
              &ldquo;The Lord has done great things for us, and we are filled with joy.&rdquo;
            </p>
            <p className="mt-3 text-[var(--accent)] font-semibold text-sm">
              Psalm 126:3
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
