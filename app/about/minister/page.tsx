import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { LeadershipDisplay } from "@/components/leadership";

export const metadata = {
  title: "The Minister",
  description: "Meet the Minister of The Most Holy Trinity Presbyterian Church.",
};

export default function MinisterPage() {
  return (
    <>
      <PageHeroWithBackground
        pageSlug="about-minister"
        title="The Minister"
        subtitle="Meet our spiritual leader"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <LeadershipDisplay
              type="ministers"
              showPastLeadership={true}
              title="Our Ministers"
            />

            <div className="mt-12 prose prose-lg max-w-none">
              <h3 className="text-xl font-semibold text-[var(--text)]">A Message from the Minister</h3>
              <blockquote className="border-l-4 border-[var(--primary)] pl-6 italic text-[var(--text-muted)]">
                &ldquo;Welcome to The Most Holy Trinity Presbyterian Church. We are a community of believers 
                committed to growing in faith, serving one another, and sharing the love of Christ with our 
                neighbors. Whether you are a long-time member or visiting for the first time, we invite you 
                to join us in worship and fellowship. May God bless you abundantly.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
