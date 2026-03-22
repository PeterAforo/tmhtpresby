import { PageHero } from "@/components/layout/PageHero";
import { User } from "lucide-react";

export const metadata = {
  title: "Our Agents",
  description: "Meet the Agents of The Most Holy Trinity Presbyterian Church.",
};

const agents = [
  { name: "Agent Kofi Asare", district: "District 1" },
  { name: "Agent Ama Serwaa", district: "District 2" },
  { name: "Agent Yaw Mensah", district: "District 3" },
  { name: "Agent Akua Boateng", district: "District 4" },
];

export default function AgentsPage() {
  return (
    <>
      <PageHero
        title="Our Agents"
        subtitle="Church agents serving our community"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-[var(--text-muted)]">
                Our church agents are dedicated members who serve as liaisons between the church 
                and the community. They help with pastoral care, visitation, and ensuring that 
                every member feels connected to our church family.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {agents.map((agent) => (
                <div
                  key={agent.name}
                  className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border)] flex items-center gap-4"
                >
                  <div className="w-14 h-14 bg-[var(--accent)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-7 h-7 text-[var(--accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text)]">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      {agent.district}
                    </p>
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
