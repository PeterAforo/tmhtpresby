import { PageHero } from "@/components/layout/PageHero";
import { LeadershipDisplay } from "@/components/leadership";

export const metadata = {
  title: "Committees",
  description: "Learn about the various committees that serve our church community.",
};

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
          <div className="max-w-5xl mx-auto">
            <p className="text-lg text-[var(--text-muted)] mb-12 text-center">
              Our church committees work diligently behind the scenes to ensure the smooth 
              operation of all church activities and to serve our members effectively.
            </p>

            <LeadershipDisplay
              type="committee"
              showPastLeadership={true}
              title="Committee Leadership"
            />
          </div>
        </div>
      </section>
    </>
  );
}
