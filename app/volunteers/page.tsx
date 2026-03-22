import { PageHero } from "@/components/layout/PageHero";
import Link from "next/link";
import { Heart, Users, Music, Baby, HandHelping, Mic } from "lucide-react";

export const metadata = {
  title: "Volunteers",
  description: "Join our team of volunteers and serve in various ministries at Most Holy Trinity Presbyterian Church.",
};

const VOLUNTEER_AREAS = [
  {
    title: "Ushering & Hospitality",
    description: "Welcome visitors, assist with seating, and help create a warm atmosphere for worship.",
    icon: Users,
    commitment: "Sunday services",
  },
  {
    title: "Children's Ministry",
    description: "Teach Sunday School, assist with children's church, and help nurture young hearts.",
    icon: Baby,
    commitment: "Sundays during services",
  },
  {
    title: "Worship Team",
    description: "Join the choir, praise team, or serve as an instrumentalist during services.",
    icon: Music,
    commitment: "Weekly rehearsals + Sundays",
  },
  {
    title: "Technical Team",
    description: "Operate sound, lighting, and media equipment during services and events.",
    icon: Mic,
    commitment: "Sundays + special events",
  },
  {
    title: "Outreach & Missions",
    description: "Participate in community service, evangelism, and mission activities.",
    icon: HandHelping,
    commitment: "Monthly outreach events",
  },
  {
    title: "Welfare & Visitation",
    description: "Visit the sick, support bereaved families, and care for members in need.",
    icon: Heart,
    commitment: "As needed",
  },
];

export default function VolunteersPage() {
  return (
    <>
      <PageHero
        overline="Get Involved"
        title="Volunteer With Us"
        subtitle="Use your gifts to serve God and others"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-lg text-[var(--text-muted)]">
                We believe everyone has gifts to share. Whether you have an hour a week or a few 
                hours a month, there's a place for you to serve and make a difference.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {VOLUNTEER_AREAS.map((area) => {
                const Icon = area.icon;
                return (
                  <div
                    key={area.title}
                    className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[var(--primary)]/10 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[var(--primary)]" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-[var(--text)] mb-1">
                          {area.title}
                        </h2>
                        <p className="text-sm text-[var(--text-muted)] mb-2">
                          {area.description}
                        </p>
                        <p className="text-xs text-[var(--primary)] font-medium">
                          Commitment: {area.commitment}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="bg-[var(--primary)]/5 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">
                Ready to Serve?
              </h2>
              <p className="text-[var(--text-muted)] mb-6">
                Contact us to learn more about volunteer opportunities and how you can get involved.
              </p>
              <Link
                href="/contact?subject=volunteering"
                className="inline-flex items-center justify-center px-6 py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Contact Us to Volunteer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
