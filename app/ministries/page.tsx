import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Users, Heart, Music, BookOpen, HandHelping, Baby, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Ministries",
  description: "Explore the ministries and groups at The Most Holy Trinity Presbyterian Church.",
};

const MINISTRIES = [
  {
    icon: Baby,
    name: "Children\u2019s Ministry",
    slug: "children",
    ageGroup: "Ages 0\u201312",
    tagline: "Nurturing young hearts in God\u2019s word",
    description: "Our children\u2019s ministry provides a safe, fun, and faith-filled environment for kids from infants through age 12. Through engaging Bible lessons, worship, and activities, we help children build a foundation of faith.",
    meetingTime: "Sundays during all services",
  },
  {
    icon: Users,
    name: "Youth Ministry",
    slug: "youth",
    ageGroup: "Ages 13\u201325",
    tagline: "Empowering the next generation",
    description: "Our youth ministry equips young people to navigate life with faith, purpose, and community. Weekly gatherings include worship, biblical teaching, mentorship, and social activities.",
    meetingTime: "Fridays, 5:00 PM",
  },
  {
    icon: Heart,
    name: "Women\u2019s Ministry",
    slug: "women",
    ageGroup: "All women",
    tagline: "Growing together in grace and purpose",
    description: "The women\u2019s ministry creates spaces for women to connect, grow spiritually, and support one another through Bible studies, prayer groups, retreats, and outreach.",
    meetingTime: "Saturdays, 9:00 AM (bi-weekly)",
  },
  {
    icon: BookOpen,
    name: "Men\u2019s Fellowship",
    slug: "men",
    ageGroup: "All men",
    tagline: "Iron sharpens iron in fellowship",
    description: "The men\u2019s fellowship is a brotherhood committed to spiritual growth, accountability, and service. Through Bible study, mentorship, and retreats, we build men of integrity and faith.",
    meetingTime: "Saturdays, 7:00 AM (bi-weekly)",
  },
  {
    icon: Music,
    name: "Worship Ministry",
    slug: "worship",
    ageGroup: "All ages",
    tagline: "Leading God\u2019s people in praise",
    description: "Our worship ministry includes the choir, praise team, instrumentalists, and sound technicians. We lead the congregation in heartfelt worship that glorifies God and stirs the soul.",
    meetingTime: "Thursdays, 6:00 PM (rehearsal)",
  },
  {
    icon: HandHelping,
    name: "Outreach & Missions",
    slug: "outreach",
    ageGroup: "All ages",
    tagline: "Serving our community with love",
    description: "We demonstrate God\u2019s love through practical service \u2014 feeding programmes, health outreaches, school support, and community development initiatives across Greater Accra.",
    meetingTime: "Monthly (dates vary)",
  },
];

export default function MinistriesPage() {
  return (
    <>
      <PageHero
        overline="Get Involved"
        title="Our Ministries"
        subtitle="There\u2019s a place for everyone at Most Holy Trinity. Find your community and serve with purpose."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MINISTRIES.map((ministry) => {
              const Icon = ministry.icon;
              return (
                <div
                  key={ministry.slug}
                  className="group rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:shadow-lg transition-all duration-200"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="shrink-0 w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors duration-200">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--text)]">
                          {ministry.name}
                        </h3>
                        <p className="text-xs text-[var(--accent)] font-medium">
                          {ministry.ageGroup} &middot; {ministry.meetingTime}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
                      {ministry.description}
                    </p>
                    <Link
                      href={`/ministries/${ministry.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:gap-2.5 transition-all duration-200"
                    >
                      Learn More <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
