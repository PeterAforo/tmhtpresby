import type { Metadata } from "next";
import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { Target, Eye, Compass, Gem } from "lucide-react";

export const metadata: Metadata = {
  title: "Vision & Mission",
  description:
    "The purpose that drives everything we do at The Most Holy Trinity Presbyterian Church.",
};

const VALUES = [
  {
    icon: Gem,
    title: "Worship",
    description: "We exalt God in spirit and truth through passionate, reverent worship that honours His presence.",
  },
  {
    icon: Compass,
    title: "Discipleship",
    description: "We nurture spiritual growth through Scripture study, mentorship, and lifelong learning.",
  },
  {
    icon: Target,
    title: "Service",
    description: "We serve our community sacrificially, meeting needs with compassion and the love of Christ.",
  },
  {
    icon: Eye,
    title: "Evangelism",
    description: "We share the gospel boldly, inviting all people to experience the hope found in Jesus.",
  },
];

export default function VisionPage() {
  return (
    <>
      <PageHeroWithBackground
        pageSlug="about-vision"
        overline="About"
        title="Vision & Mission"
        subtitle="The purpose that drives everything we do."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Vision */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold uppercase tracking-wider mb-4">
              <Eye size={14} />
              Our Vision
            </div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text)] leading-tight mb-4">
              To be a Christ-centred community that transforms lives, families,
              and neighbourhoods through the power of the Gospel.
            </h2>
            <div aria-hidden="true" className="mx-auto h-1 w-16 rounded-full bg-[var(--divider)]" />
          </div>

          {/* Mission */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-semibold uppercase tracking-wider mb-4">
              <Target size={14} />
              Our Mission
            </div>
            <p className="text-[var(--text-muted)] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              We exist to connect people to God and to each other. Through
              worship, discipleship, fellowship, and service, we equip every
              member to live out their God-given purpose and make an eternal
              impact in their sphere of influence.
            </p>
          </div>

          {/* Core Values */}
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[var(--text)] text-center mb-4">
              Our Core Values
            </h2>
            <div aria-hidden="true" className="mx-auto h-1 w-12 rounded-full bg-[var(--divider)] mb-10" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {VALUES.map((value) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="flex gap-4 p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="shrink-0 w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text)] mb-1">
                        {value.title}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scripture */}
          <div className="mt-16 p-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-center">
            <p className="font-[family-name:var(--font-heading)] text-xl italic text-[var(--text)] leading-relaxed">
              &ldquo;For I know the plans I have for you, declares the Lord,
              plans to prosper you and not to harm you, plans to give you hope
              and a future.&rdquo;
            </p>
            <p className="mt-3 text-[var(--accent)] font-semibold text-sm">
              Jeremiah 29:11
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
