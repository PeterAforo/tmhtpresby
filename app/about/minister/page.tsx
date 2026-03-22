import { PageHero } from "@/components/layout/PageHero";
import { User, Mail, Phone } from "lucide-react";

export const metadata = {
  title: "The Minister",
  description: "Meet the Minister of The Most Holy Trinity Presbyterian Church.",
};

export default function MinisterPage() {
  return (
    <>
      <PageHero
        title="The Minister"
        subtitle="Meet our spiritual leader"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[var(--bg-card)] rounded-2xl overflow-hidden border border-[var(--border)]">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] p-8 flex items-center justify-center">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                </div>
                <div className="md:w-2/3 p-8">
                  <h2 className="text-2xl font-display font-bold text-[var(--text)] mb-2">
                    Rev. Minister
                  </h2>
                  <p className="text-[var(--primary)] font-medium mb-4">
                    Minister in Charge
                  </p>
                  <p className="text-[var(--text-muted)] mb-6">
                    Our minister leads our congregation with dedication and passion for the Gospel. 
                    With years of experience in ministry, they guide our church family in worship, 
                    discipleship, and community service.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                      <Mail className="w-4 h-4" />
                      <span>minister@tmhtpresby.org</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                      <Phone className="w-4 h-4" />
                      <span>Contact through church office</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
