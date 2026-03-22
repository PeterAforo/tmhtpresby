import { PageHero } from "@/components/layout/PageHero";
import { Users } from "lucide-react";

export const metadata = {
  title: "The Session",
  description: "Meet the Session members of The Most Holy Trinity Presbyterian Church.",
};

const sessionMembers = [
  { name: "Elder John Mensah", role: "Session Clerk" },
  { name: "Elder Mary Asante", role: "Session Member" },
  { name: "Elder Kwame Owusu", role: "Session Member" },
  { name: "Elder Grace Addo", role: "Session Member" },
  { name: "Elder Samuel Boateng", role: "Session Member" },
  { name: "Elder Abena Darko", role: "Session Member" },
];

export default function SessionPage() {
  return (
    <>
      <PageHero
        title="The Session"
        subtitle="The governing body of our congregation"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-[var(--text-muted)]">
                The Session is the governing body of our congregation, consisting of the minister 
                and ruling elders. They are responsible for the spiritual oversight of the church, 
                including worship, discipline, and the general welfare of the congregation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessionMembers.map((member) => (
                <div
                  key={member.name}
                  className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border)] text-center"
                >
                  <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-[var(--primary)]" />
                  </div>
                  <h3 className="font-semibold text-[var(--text)] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-[var(--text)] mb-4">
                Responsibilities of the Session
              </h3>
              <ul className="space-y-2 text-[var(--text-muted)]">
                <li>• Oversight of worship and the sacraments</li>
                <li>• Spiritual care and discipline of members</li>
                <li>• Receiving and dismissing members</li>
                <li>• Supervising church organizations</li>
                <li>• Managing church property and finances</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
