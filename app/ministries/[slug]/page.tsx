import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { Users, Heart, Music, BookOpen, HandHelping, Baby, Clock, MapPin, ArrowLeft } from "lucide-react";

const MINISTRIES_DATA: Record<string, {
  name: string;
  tagline: string;
  description: string;
  ageGroup: string;
  meetingTime: string;
  location: string;
  image: string;
  leader: string;
  activities: string[];
  icon: typeof Users;
}> = {
  children: {
    name: "Children's Ministry",
    tagline: "Nurturing young hearts in God's word",
    description: "Our children's ministry provides a safe, fun, and faith-filled environment for kids from infants through age 12. Through engaging Bible lessons, worship, and activities, we help children build a foundation of faith that will last a lifetime. Our trained volunteers are passionate about making the Bible come alive for every child.",
    ageGroup: "Ages 0–12",
    meetingTime: "Sundays during all services",
    location: "Children's Wing, Ground Floor",
    image: "/img/pictures/2/040.jpg",
    leader: "Mrs. Akosua Mensah",
    activities: [
      "Sunday School classes by age group",
      "Vacation Bible School (annual)",
      "Children's choir",
      "Holiday programmes",
      "Parent-child dedication services",
    ],
    icon: Baby,
  },
  youth: {
    name: "Youth Ministry",
    tagline: "Empowering the next generation",
    description: "Our youth ministry equips young people to navigate life with faith, purpose, and community. We believe that teenagers and young adults are not just the future of the church — they are the church today. Through weekly gatherings, mentorship, and outreach, we help youth discover their identity in Christ.",
    ageGroup: "Ages 13–25",
    meetingTime: "Fridays, 5:00 PM",
    location: "Youth Hall, First Floor",
    image: "/img/pictures/2/045.jpg",
    leader: "Pastor Kwame Boateng",
    activities: [
      "Friday night youth service",
      "Bible study groups",
      "Youth camps and retreats",
      "Community service projects",
      "Sports and recreation",
      "Career mentorship programme",
    ],
    icon: Users,
  },
  women: {
    name: "Women's Ministry",
    tagline: "Growing together in grace and purpose",
    description: "The women's ministry creates spaces for women of all ages to connect, grow spiritually, and support one another. Through Bible studies, prayer groups, retreats, and outreach, we encourage women to discover their God-given purpose and live it out boldly.",
    ageGroup: "All women",
    meetingTime: "Saturdays, 9:00 AM (bi-weekly)",
    location: "Fellowship Hall",
    image: "/img/pictures/2/050.jpg",
    leader: "Rev. Mrs. Abena Mensah",
    activities: [
      "Women's Bible study",
      "Prayer breakfast meetings",
      "Annual women's retreat",
      "Mentorship circles",
      "Community outreach",
      "Marriage enrichment seminars",
    ],
    icon: Heart,
  },
  men: {
    name: "Men's Fellowship",
    tagline: "Iron sharpens iron in fellowship",
    description: "The men's fellowship is a brotherhood committed to spiritual growth, accountability, and service. We believe that strong men build strong families, and strong families build strong communities. Through Bible study, mentorship, and retreats, we build men of integrity and faith.",
    ageGroup: "All men",
    meetingTime: "Saturdays, 7:00 AM (bi-weekly)",
    location: "Conference Room",
    image: "/img/pictures/2/055.jpg",
    leader: "Elder James Owusu",
    activities: [
      "Men's Bible study",
      "Prayer and accountability groups",
      "Annual men's retreat",
      "Father-son events",
      "Community service projects",
      "Leadership development",
    ],
    icon: BookOpen,
  },
  worship: {
    name: "Worship Ministry",
    tagline: "Leading God's people in praise",
    description: "Our worship ministry includes the choir, praise team, instrumentalists, and sound technicians. Together, we lead the congregation in heartfelt worship that glorifies God and stirs the soul. We believe worship is more than music — it's a lifestyle of surrender and praise.",
    ageGroup: "All ages (auditions required)",
    meetingTime: "Thursdays, 6:00 PM (rehearsal)",
    location: "Main Sanctuary",
    image: "/img/pictures/2/030.jpg",
    leader: "Minister Kofi Asante",
    activities: [
      "Sunday worship leading",
      "Choir rehearsals",
      "Praise team practice",
      "Special event performances",
      "Worship workshops",
      "Recording sessions",
    ],
    icon: Music,
  },
  outreach: {
    name: "Outreach & Missions",
    tagline: "Serving our community with love",
    description: "We demonstrate God's love through practical service. Our outreach ministry coordinates feeding programmes, health outreaches, school support, and community development initiatives across Greater Accra. We believe the Gospel is both proclaimed and demonstrated.",
    ageGroup: "All ages",
    meetingTime: "Monthly (dates vary)",
    location: "Various community locations",
    image: "/img/pictures/2/060.jpg",
    leader: "Deaconess Grace Amponsah",
    activities: [
      "Monthly feeding programmes",
      "Health screening outreaches",
      "School supplies distribution",
      "Prison ministry visits",
      "Hospital visitation",
      "Disaster relief efforts",
    ],
    icon: HandHelping,
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ministry = MINISTRIES_DATA[slug];
  
  if (!ministry) {
    return { title: "Ministry Not Found" };
  }

  return {
    title: ministry.name,
    description: ministry.description.slice(0, 160),
  };
}

export async function generateStaticParams() {
  return Object.keys(MINISTRIES_DATA).map((slug) => ({ slug }));
}

export default async function MinistryDetailPage({ params }: Props) {
  const { slug } = await params;
  const ministry = MINISTRIES_DATA[slug];

  if (!ministry) {
    notFound();
  }

  const Icon = ministry.icon;

  return (
    <>
      <PageHero
        overline="Ministries"
        title={ministry.name}
        subtitle={ministry.tagline}
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/ministries"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline mb-8"
          >
            <ArrowLeft size={16} />
            Back to All Ministries
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Hero image */}
              <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
                <Image
                  src={ministry.image}
                  alt={ministry.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Description */}
              <div className="prose-section mb-10">
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)] mb-4">
                  About This Ministry
                </h2>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  {ministry.description}
                </p>
              </div>

              {/* Activities */}
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)] mb-4">
                  What We Do
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ministry.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]"
                    >
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0" />
                      <span className="text-sm text-[var(--text)]">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick info card */}
              <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                <div className="w-14 h-14 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] mb-4">
                  <Icon size={28} />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text)] mb-4">
                  Ministry Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Users size={18} className="text-[var(--accent)] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Age Group</p>
                      <p className="text-sm font-medium text-[var(--text)]">{ministry.ageGroup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-[var(--accent)] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Meeting Time</p>
                      <p className="text-sm font-medium text-[var(--text)]">{ministry.meetingTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[var(--accent)] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Location</p>
                      <p className="text-sm font-medium text-[var(--text)]">{ministry.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leader card */}
              <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                <h3 className="text-lg font-semibold text-[var(--text)] mb-3">
                  Ministry Leader
                </h3>
                <p className="text-sm text-[var(--text-muted)]">{ministry.leader}</p>
              </div>

              {/* CTA */}
              <div className="p-6 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/20">
                <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                  Want to Join?
                </h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  We'd love to have you! Reach out to learn more about getting involved.
                </p>
                <Link
                  href="/contact?subject=volunteering"
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
