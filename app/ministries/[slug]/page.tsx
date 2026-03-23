import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { MinistryExecutives } from "@/components/ministry/MinistryExecutives";
import { MinistryCalendar } from "@/components/ministry/MinistryCalendar";
import { MinistryGallery } from "@/components/ministry/MinistryGallery";
import { Users, Heart, Music, BookOpen, HandHelping, Baby, Clock, MapPin, ArrowLeft, MessageSquare } from "lucide-react";

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
  aged: {
    name: "The Aged Ministry",
    tagline: "Honouring our elders in faith",
    description: "The Aged Ministry provides spiritual care, fellowship, and support for our senior members. We honour the wisdom and experience of our elders while ensuring they remain active participants in the life of the church. Through regular meetings, visitations, and special programmes, we celebrate and care for those who have faithfully served.",
    ageGroup: "60 years and above",
    meetingTime: "First Saturday of each month, 10:00 AM",
    location: "Fellowship Hall",
    image: "/img/pictures/2/001.jpg",
    leader: "Elder Kofi Asante",
    activities: [
      "Monthly fellowship meetings",
      "Home visitation programme",
      "Health and wellness seminars",
      "Annual thanksgiving service",
      "Prayer and intercession",
      "Mentorship of younger members",
    ],
    icon: Heart,
  },
  men: {
    name: "Men's Fellowship (PMF)",
    tagline: "Except the Lord",
    description: "The Presby Men's Fellowship (PMF) is a generational group for men from the age of 40 years and beyond in the Presbyterian Church of Ghana. A brotherhood committed to spiritual growth, accountability, and service. We believe that strong men build strong families, and strong families build strong communities.",
    ageGroup: "Ages 40+",
    meetingTime: "Saturdays, 7:00 AM (bi-weekly)",
    location: "Conference Room",
    image: "/img/pictures/2/020.jpg",
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
  women: {
    name: "Women's Fellowship (PWF)",
    tagline: "Growing together in grace and purpose",
    description: "The Presbyterian Women's Fellowship (PWF) is a generational group for women from the age of 40 years and beyond in the Presbyterian Church of Ghana. We create spaces for women to connect, grow spiritually, and support one another through Bible studies, prayer groups, retreats, and outreach.",
    ageGroup: "Ages 40+",
    meetingTime: "Saturdays, 9:00 AM (bi-weekly)",
    location: "Fellowship Hall",
    image: "/img/pictures/2/010.jpg",
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
  "young-adults": {
    name: "Young Adult Ministry",
    tagline: "Faith for the journey ahead",
    description: "Our Young Adult Ministry serves members aged 18-35 who are navigating career, relationships, and life decisions. We provide a community where young professionals and students can grow in faith while facing real-world challenges together.",
    ageGroup: "Ages 18–35",
    meetingTime: "Sundays, 1:00 PM",
    location: "Youth Hall",
    image: "/img/pictures/2/045.jpg",
    leader: "Pastor Emmanuel Darko",
    activities: [
      "Sunday afternoon fellowship",
      "Career and life coaching",
      "Relationship seminars",
      "Community service projects",
      "Annual retreat",
      "Networking events",
    ],
    icon: Users,
  },
  ypg: {
    name: "Young People's Guild (Y.P.G.)",
    tagline: "To know His will and to do it",
    description: "The Young People's Guild (Y.P.G.) is a generational group for persons between the ages of 18-30 years in the Presbyterian Church of Ghana. We focus on spiritual growth, leadership development, and community service. Our motto reminds us to seek God's will in all we do.",
    ageGroup: "Ages 18–30",
    meetingTime: "Sundays, 3:00 PM",
    location: "Youth Hall, First Floor",
    image: "/img/pictures/2/050.jpg",
    leader: "Pastor Kwame Boateng",
    activities: [
      "Sunday fellowship meetings",
      "Bible study groups",
      "Youth camps and retreats",
      "Community service projects",
      "Leadership development",
      "Career mentorship programme",
    ],
    icon: Users,
  },
  "junior-youth": {
    name: "Junior Youth (J.Y.)",
    tagline: "Growing young disciples",
    description: "The Junior Youth (J.Y.) is a generational group for teenagers between the ages of 12-18 years in the Presbyterian Church of Ghana. We equip young people with biblical foundations, leadership skills, and a strong sense of community through engaging programmes and mentorship.",
    ageGroup: "Ages 12–18",
    meetingTime: "Sundays, 2:00 PM",
    location: "Youth Hall, First Floor",
    image: "/img/pictures/2/050.jpg",
    leader: "Minister Grace Asante",
    activities: [
      "Sunday youth fellowship",
      "Bible study sessions",
      "Youth camps and retreats",
      "Sports and recreation",
      "Talent development",
      "Community service",
    ],
    icon: Users,
  },
  yaf: {
    name: "Young Adults Fellowship (YAF)",
    tagline: "Christ in you, the hope of glory",
    description: "The Young Adults Fellowship (YAF) is a generational group for persons between the ages of 30-40 years in the Presbyterian Church of Ghana. We provide a space for young professionals and families to grow in faith, build meaningful relationships, and serve together.",
    ageGroup: "Ages 30–40",
    meetingTime: "Sundays, 4:00 PM",
    location: "Fellowship Hall",
    image: "/img/pictures/2/045.jpg",
    leader: "Elder Daniel Mensah",
    activities: [
      "Sunday fellowship meetings",
      "Bible study groups",
      "Marriage enrichment seminars",
      "Career and life coaching",
      "Family programmes",
      "Community outreach",
    ],
    icon: Users,
  },
  youth: {
    name: "Youth Ministry",
    tagline: "Empowering the next generation",
    description: "Our youth ministry equips young people to navigate life with faith, purpose, and community. We believe that teenagers and young adults are not just the future of the church — they are the church today. Through weekly gatherings, mentorship, and outreach, we help youth discover their identity in Christ.",
    ageGroup: "Ages 13–25",
    meetingTime: "Fridays, 5:00 PM",
    location: "Youth Hall, First Floor",
    image: "/img/pictures/2/050.jpg",
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
  junior: {
    name: "Junior Ministry",
    tagline: "Nurturing young hearts in God's word",
    description: "Our Junior Ministry provides a safe, fun, and faith-filled environment for children. Through engaging Bible lessons, worship, and activities, we help children build a foundation of faith that will last a lifetime. Our trained volunteers are passionate about making the Bible come alive for every child.",
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
  children: {
    name: "Children's Service (CM)",
    tagline: "Let the children come to me",
    description: "The Children's Ministry (CM) is a generational group for children between the ages of 2-12 years in the Presbyterian Church of Ghana. Through engaging Bible lessons, worship, and activities, we help children build a foundation of faith that will last a lifetime. Our trained volunteers are passionate about making the Bible come alive for every child.",
    ageGroup: "Ages 2–12",
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
  choir: {
    name: "Choir Ministry",
    tagline: "Singing praises to the Lord",
    description: "The Church Choir leads the congregation in worship through hymns and anthems. Our dedicated singers rehearse weekly to deliver spirit-filled performances that glorify God and uplift the congregation during services and special occasions.",
    ageGroup: "All ages (auditions required)",
    meetingTime: "Thursdays, 6:00 PM",
    location: "Main Sanctuary",
    image: "/img/pictures/2/030.jpg",
    leader: "Choirmaster Daniel Adjei",
    activities: [
      "Sunday worship leading",
      "Weekly rehearsals",
      "Special event performances",
      "Christmas cantata",
      "Easter celebrations",
      "Recording sessions",
    ],
    icon: Music,
  },
  "singing-band": {
    name: "Singing Band Ministry",
    tagline: "Joyful noise unto the Lord",
    description: "The Singing Band brings energy and joy to our worship services with contemporary gospel music. This group combines traditional Presbyterian hymns with modern worship songs to create a dynamic worship experience.",
    ageGroup: "All ages",
    meetingTime: "Wednesdays, 6:00 PM",
    location: "Fellowship Hall",
    image: "/img/pictures/2/030.jpg",
    leader: "Minister Grace Owusu",
    activities: [
      "Sunday worship support",
      "Weekly rehearsals",
      "Community outreach concerts",
      "Youth programmes",
      "Special celebrations",
    ],
    icon: Music,
  },
  "trinity-praise": {
    name: "Trinity Praise Ministry",
    tagline: "Leading God's people in praise",
    description: "Trinity Praise is our contemporary worship team that leads praise and worship during services. The team includes vocalists, instrumentalists, and sound technicians who work together to create an atmosphere of worship.",
    ageGroup: "All ages (auditions required)",
    meetingTime: "Saturdays, 4:00 PM",
    location: "Main Sanctuary",
    image: "/img/pictures/2/030.jpg",
    leader: "Minister Kofi Asante",
    activities: [
      "Sunday praise and worship",
      "Weekly rehearsals",
      "Worship workshops",
      "Special event performances",
      "Recording sessions",
    ],
    icon: Music,
  },
  music: {
    name: "Music Ministry",
    tagline: "Worship through song and instruments",
    description: "Our Music Ministry encompasses all musical groups in the church including the choir, singing band, and praise team. Together, we lead the congregation in heartfelt worship that glorifies God and stirs the soul.",
    ageGroup: "All ages (auditions required)",
    meetingTime: "Various days (see specific groups)",
    location: "Main Sanctuary",
    image: "/img/pictures/2/040.jpg",
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
  church: {
    name: "Church Ministry",
    tagline: "Supporting the mission of the church",
    description: "The Church Ministry oversees the overall operations and mission of the congregation. This includes coordinating various departments, supporting church programmes, and ensuring the smooth running of all church activities.",
    ageGroup: "All ages",
    meetingTime: "As scheduled",
    location: "Church Office",
    image: "/img/pictures/2/001.jpg",
    leader: "Church Administrator",
    activities: [
      "Programme coordination",
      "Administrative support",
      "Facility management",
      "Event planning",
      "Member care",
      "Communication",
    ],
    icon: Users,
  },
  help: {
    name: "Help Ministry",
    tagline: "Reaching out with compassion",
    description: "The Help Ministry reaches out to those in need with compassion and practical support. We coordinate welfare programmes, hospital visitations, and assistance for members and the community facing difficult circumstances.",
    ageGroup: "All ages",
    meetingTime: "As needed",
    location: "Various locations",
    image: "/img/pictures/2/060.jpg",
    leader: "Deaconess Grace Amponsah",
    activities: [
      "Hospital visitation",
      "Welfare support",
      "Bereavement assistance",
      "Emergency relief",
      "Counselling referrals",
      "Community outreach",
    ],
    icon: HandHelping,
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
      <PageHeroWithBackground
        pageSlug={`ministries-${slug}`}
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
              <div className="mb-10">
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

              {/* Ministry Calendar */}
              <div className="mb-10">
                <MinistryCalendar ministrySlug={slug} ministryName={ministry.name} />
              </div>

              {/* Community Hub - Mobile visible */}
              <div className="mt-10 p-6 rounded-xl bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 border border-[var(--primary)]/20 lg:hidden">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/20 flex items-center justify-center">
                    <MessageSquare size={24} className="text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text)]">
                      Community Hub
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">Connect & Discuss</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  Share testimonies, ask questions, and participate in discussions with fellow members.
                </p>
                <Link
                  href="/community"
                  className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Join Discussion
                </Link>
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

              {/* Community Hub - Desktop sidebar */}
              <div className="hidden lg:block p-6 rounded-xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 border border-[var(--primary)]/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/20 flex items-center justify-center">
                    <MessageSquare size={20} className="text-[var(--primary)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text)]">
                    Community Hub
                  </h3>
                </div>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  Connect with fellow members, share testimonies, ask questions, and participate in discussions.
                </p>
                <Link
                  href="/community"
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Join Discussion
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Executives - Full Width Section */}
      <section className="py-16 lg:py-20 bg-[var(--bg)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MinistryExecutives ministrySlug={slug} ministryName={ministry.name} />
        </div>
      </section>

      {/* Photos & Videos - Full Width Section */}
      <section className="py-16 lg:py-20 bg-[var(--bg-card)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MinistryGallery ministrySlug={slug} ministryName={ministry.name} />
        </div>
      </section>
    </>
  );
}
