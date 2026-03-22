import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { LeadershipDisplay } from "@/components/leadership";

export const metadata = {
  title: "The Session",
  description: "Meet the Session members of The Most Holy Trinity Presbyterian Church.",
};

export default function SessionPage() {
  return (
    <>
      <PageHeroWithBackground
        pageSlug="about-session"
        title="The Session"
        subtitle="The governing body of our congregation"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-[var(--text-muted)]">
                The Session is the governing body of our congregation, consisting of the minister 
                and ruling elders. They are responsible for the spiritual oversight of the church, 
                including worship, discipline, and the general welfare of the congregation.
              </p>
            </div>

            <LeadershipDisplay
              type="session"
              showPastLeadership={true}
              title="Current Session Members"
            />

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
