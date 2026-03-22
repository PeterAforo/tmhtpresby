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
    name: "Children\u2019s Service",
    slug: "children",
    ageGroup: "Ages 2\u201312",
    tagline: "Let the children come to me",
    description: "The Children\u2019s Ministry (CM) is a generational group for children between the ages of 2-12 years in the Presbyterian Church. Through engaging Bible lessons, worship, and activities, we help children build a foundation of faith.",
    meetingTime: "Sundays during all services",
  },
  {
    icon: Users,
    name: "Junior Youth (J.Y.)",
    slug: "junior-youth",
    ageGroup: "Ages 12\u201318",
    tagline: "Growing young disciples",
    description: "The Junior Youth (J.Y.) is a generational group for teenagers between the ages of 12-18 years in the Presbyterian Church. We equip young people with biblical foundations, leadership skills, and a strong sense of community.",
    meetingTime: "Sundays, 2:00 PM",
  },
  {
    icon: Users,
    name: "Young People\u2019s Guild (Y.P.G.)",
    slug: "ypg",
    ageGroup: "Ages 18\u201330",
    tagline: "To know His will and to do it",
    description: "The Young People\u2019s Guild (Y.P.G.) is a generational group for persons between the ages of 18-30 years in the Presbyterian Church. We focus on spiritual growth, leadership development, and community service.",
    meetingTime: "Sundays, 3:00 PM",
  },
  {
    icon: Users,
    name: "Young Adults Fellowship (YAF)",
    slug: "yaf",
    ageGroup: "Ages 30\u201340",
    tagline: "Christ in you, the hope of glory",
    description: "The Young Adults Fellowship (YAF) is a generational group for persons between the ages of 30-40 years in the Presbyterian Church. We provide a space for young professionals and families to grow in faith and fellowship.",
    meetingTime: "Sundays, 4:00 PM",
  },
  {
    icon: Heart,
    name: "Women\u2019s Fellowship (PWF)",
    slug: "women",
    ageGroup: "Ages 40+",
    tagline: "Growing together in grace and purpose",
    description: "The Presbyterian Women\u2019s Fellowship (PWF) is a generational group for women from the age of 40 years and beyond in the Presbyterian Church. We create spaces for women to connect, grow spiritually, and support one another.",
    meetingTime: "Saturdays, 9:00 AM (bi-weekly)",
  },
  {
    icon: BookOpen,
    name: "Men\u2019s Fellowship (PMF)",
    slug: "men",
    ageGroup: "Ages 40+",
    tagline: "Except the Lord",
    description: "The Presby Men\u2019s Fellowship (PMF) is a generational group for men from the age of 40 years and beyond in the Presbyterian Church. A brotherhood committed to spiritual growth, accountability, and service.",
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
