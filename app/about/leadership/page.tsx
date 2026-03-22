import type { Metadata } from "next";
import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { Mail } from "lucide-react";
import type { LeadershipMember } from "@/types";

export const metadata: Metadata = {
  title: "Leadership",
  description:
    "Meet the pastors, elders, and deacons who lead The Most Holy Trinity Presbyterian Church.",
};

const LEADERS: LeadershipMember[] = [
  {
    id: "1",
    name: "Rev. Dr. Emmanuel Adjei",
    role: "Senior Pastor",
    bio: "Rev. Adjei has shepherded our congregation for over 15 years with a passion for expository preaching and community transformation. He holds a Doctorate in Theology from Trinity Theological Seminary.",
    imageUrl: "",
    email: "pastor@gracepointchurch.gh",
    order: 1,
  },
  {
    id: "2",
    name: "Rev. Mrs. Abena Mensah",
    role: "Associate Pastor",
    bio: "Rev. Mensah oversees our women\u2019s ministry and pastoral care programmes. Her warmth and wisdom have been a cornerstone of our church\u2019s growth.",
    imageUrl: "",
    order: 2,
  },
  {
    id: "3",
    name: "Pastor Kwame Boateng",
    role: "Youth Pastor",
    bio: "Pastor Kwame leads our vibrant youth ministry with energy and creativity, equipping the next generation to live boldly for Christ.",
    imageUrl: "",
    order: 3,
  },
  {
    id: "4",
    name: "Elder James Owusu",
    role: "Elder",
    bio: "Elder Owusu serves on the Session and leads our men\u2019s fellowship. A businessman by profession, he brings strategic vision to church governance.",
    imageUrl: "",
    order: 4,
  },
  {
    id: "5",
    name: "Deaconess Grace Amponsah",
    role: "Deaconess",
    bio: "Deaconess Grace coordinates our outreach and benevolence ministry, ensuring that the love of Christ reaches those in need across our community.",
    imageUrl: "",
    order: 5,
  },
  {
    id: "6",
    name: "Elder Francis Tetteh",
    role: "Elder",
    bio: "Elder Tetteh oversees church administration and facilities. His dedication to service ensures our congregation has a welcoming and well-maintained home.",
    imageUrl: "",
    order: 6,
  },
];

export default function LeadershipPage() {
  return (
    <>
      <PageHeroWithBackground
        pageSlug="about-leadership"
        overline="About"
        title="Our Leadership"
        subtitle="Meet the pastors and elders who shepherd our church family with love and integrity."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Leader cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEADERS.map((leader) => (
              <div
                key={leader.id}
                className="group rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:shadow-lg transition-all duration-200"
              >
                {/* Photo placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-[var(--accent)]/10 to-[var(--primary)]/10 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[var(--accent)]">
                      {leader.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <p className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-1">
                    {leader.role}
                  </p>
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                    {leader.name}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
                    {leader.bio}
                  </p>
                  {leader.email && (
                    <a
                      href={`mailto:${leader.email}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] hover:underline"
                    >
                      <Mail size={14} />
                      {leader.email}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
