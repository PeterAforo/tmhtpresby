import { PageHero } from "@/components/layout/PageHero";
import { Users } from "lucide-react";

export const metadata = {
  title: "Committees",
  description: "Learn about the various committees that serve our church community.",
};

const COMMITTEES = [
  {
    name: "Finance Committee",
    description: "Oversees the financial stewardship of the church, including budgeting, accounting, and financial reporting.",
    members: ["Elder Kwame Asante (Chair)", "Deacon James Mensah", "Mrs. Abena Owusu"],
  },
  {
    name: "Building & Maintenance Committee",
    description: "Responsible for the upkeep, maintenance, and development of church facilities and properties.",
    members: ["Elder Kofi Boateng (Chair)", "Mr. Emmanuel Darko", "Mrs. Grace Amponsah"],
  },
  {
    name: "Welfare Committee",
    description: "Coordinates support for members in need, including hospital visits, bereavement support, and emergency assistance.",
    members: ["Deaconess Mary Adjei (Chair)", "Mrs. Comfort Mensah", "Mr. Daniel Owusu"],
  },
  {
    name: "Education Committee",
    description: "Oversees Sunday School, Bible study programmes, and educational initiatives for all age groups.",
    members: ["Elder Samuel Asare (Chair)", "Mrs. Akosua Mensah", "Mr. Kweku Darko"],
  },
  {
    name: "Evangelism Committee",
    description: "Plans and coordinates outreach activities, community evangelism, and mission programmes.",
    members: ["Pastor Emmanuel Boateng (Chair)", "Deacon Peter Owusu", "Mrs. Janet Asante"],
  },
  {
    name: "Protocol & Ushering Committee",
    description: "Ensures orderly conduct of services, welcomes visitors, and manages seating arrangements.",
    members: ["Mr. Francis Mensah (Chair)", "Mrs. Lydia Boateng", "Mr. Joseph Asare"],
  },
];

export default function CommitteesPage() {
  return (
    <>
      <PageHero
        overline="About Us"
        title="Church Committees"
        subtitle="Dedicated teams serving our congregation"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-[var(--text-muted)] mb-12 text-center">
              Our church committees work diligently behind the scenes to ensure the smooth 
              operation of all church activities and to serve our members effectively.
            </p>

            <div className="grid gap-6">
              {COMMITTEES.map((committee) => (
                <div
                  key={committee.name}
                  className="bg-[var(--bg-card)] rounded-xl p-6 md:p-8 border border-[var(--border)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--primary)]/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-[var(--text)] mb-2">
                        {committee.name}
                      </h2>
                      <p className="text-[var(--text-muted)] mb-4">
                        {committee.description}
                      </p>
                      <div>
                        <h3 className="text-sm font-medium text-[var(--text)] mb-2">Members:</h3>
                        <ul className="text-sm text-[var(--text-muted)] space-y-1">
                          {committee.members.map((member) => (
                            <li key={member}>• {member}</li>
                          ))}
                        </ul>
                      </div>
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
