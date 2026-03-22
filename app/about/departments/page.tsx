import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { LeadershipDisplay } from "@/components/leadership";

export const metadata = {
  title: "Departments",
  description: "Learn about the departments of The Most Holy Trinity Presbyterian Church.",
};

export default function DepartmentsPage() {
  return (
    <>
      <PageHeroWithBackground
        pageSlug="about-departments"
        title="Departments"
        subtitle="Our church departments"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-[var(--text-muted)]">
                Our church is organized into various departments, each responsible for 
                specific aspects of church life and ministry. These departments work 
                together to ensure the effective functioning of our congregation.
              </p>
            </div>

            <LeadershipDisplay
              type="department"
              showPastLeadership={true}
              title="Department Leadership"
            />
          </div>
        </div>
      </section>
    </>
  );
}
