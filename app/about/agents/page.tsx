import { PageHero } from "@/components/layout/PageHero";
import { LeadershipDisplay } from "@/components/leadership";

export const metadata = {
  title: "Our Agents",
  description: "Meet the Agents of The Most Holy Trinity Presbyterian Church.",
};

export default function AgentsPage() {
  return (
    <>
      <PageHero
        title="Our Agents"
        subtitle="Church agents serving our community"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-[var(--text-muted)]">
                Our church agents are dedicated members who serve as liaisons between the church 
                and the community. They help with pastoral care, visitation, and ensuring that 
                every member feels connected to our church family.
              </p>
            </div>

            <LeadershipDisplay
              type="agents"
              showPastLeadership={true}
              title="Current Agents"
            />
          </div>
        </div>
      </section>
    </>
  );
}
