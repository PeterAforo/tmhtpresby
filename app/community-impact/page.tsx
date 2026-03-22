import { PageHero } from "@/components/layout/PageHero";
import { Heart, Users, Home, BookOpen } from "lucide-react";

export const metadata = {
  title: "Community Impact",
  description: "See how our church is making a difference in the community.",
};

const impactAreas = [
  {
    icon: Heart,
    title: "Outreach Programs",
    description: "We regularly organize outreach programs to support the less privileged in our community, providing food, clothing, and essential supplies.",
  },
  {
    icon: Users,
    title: "Youth Empowerment",
    description: "Our youth programs focus on education, mentorship, and skill development to prepare young people for a bright future.",
  },
  {
    icon: Home,
    title: "Community Support",
    description: "We provide support to families in need through counseling, financial assistance, and community resources.",
  },
  {
    icon: BookOpen,
    title: "Educational Initiatives",
    description: "We support education through scholarships, school supplies, and tutoring programs for children in our community.",
  },
];

export default function CommunityImpactPage() {
  return (
    <>
      <PageHero
        title="Community Impact"
        subtitle="Making a difference in our community through love and service"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-[var(--text)] mb-4">
              Our Mission in Action
            </h2>
            <p className="text-lg text-[var(--text-muted)]">
              At The Most Holy Trinity Presbyterian Church, we believe in putting our faith into action. 
              Through various community programs and initiatives, we strive to be a blessing to those around us.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {impactAreas.map((area) => (
              <div
                key={area.title}
                className="bg-[var(--bg-card)] rounded-xl p-8 border border-[var(--border)]"
              >
                <div className="w-14 h-14 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center mb-6">
                  <area.icon className="w-7 h-7 text-[var(--accent)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--text)] mb-3">
                  {area.title}
                </h3>
                <p className="text-[var(--text-muted)]">
                  {area.description}
                </p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-16 text-center">
            <div className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl font-display font-bold text-[var(--text)] mb-4">
                Get Involved
              </h3>
              <p className="text-[var(--text-muted)] mb-6">
                Want to make a difference? Join us in our community outreach programs and be part of the change.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-[var(--accent)] text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Contact Us to Volunteer
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
