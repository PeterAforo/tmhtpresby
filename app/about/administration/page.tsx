import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { LeadershipDisplay } from "@/components/leadership";

export const metadata = {
  title: "Administration",
  description: "Meet the administrative team of The Most Holy Trinity Presbyterian Church.",
};

export default function AdministrationPage() {
  return (
    <>
      <PageHeroWithBackground
        pageSlug="about-administration"
        title="Administration"
        subtitle="Our administrative team"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-[var(--text-muted)]">
                Our administrative team ensures the smooth operation of church activities 
                and maintains proper records and finances. They work diligently behind the 
                scenes to support the ministry of the church.
              </p>
            </div>

            <LeadershipDisplay
              type="administration"
              showPastLeadership={true}
              title="Administrative Team"
            />
          </div>
        </div>
      </section>
    </>
  );
}
