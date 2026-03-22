import { PageHero } from "@/components/layout/PageHero";
import { Briefcase, User } from "lucide-react";

export const metadata = {
  title: "Administration",
  description: "Meet the administrative team of The Most Holy Trinity Presbyterian Church.",
};

const adminTeam = [
  { name: "Church Secretary", role: "Administrative Secretary", description: "Handles church correspondence and records" },
  { name: "Financial Secretary", role: "Finance", description: "Manages church finances and accounts" },
  { name: "Treasurer", role: "Treasury", description: "Oversees church funds and disbursements" },
  { name: "Auditor", role: "Audit", description: "Reviews and audits church financial records" },
];

export default function AdministrationPage() {
  return (
    <>
      <PageHero
        title="Administration"
        subtitle="Our administrative team"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-[var(--text-muted)]">
                Our administrative team ensures the smooth operation of church activities 
                and maintains proper records and finances. They work diligently behind the 
                scenes to support the ministry of the church.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {adminTeam.map((member) => (
                <div
                  key={member.role}
                  className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text)] mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm text-[var(--primary)] mb-2">
                        {member.role}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        {member.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
