import { PageHero } from "@/components/layout/PageHero";
import { User, Mail, Phone } from "lucide-react";

export const metadata = {
  title: "The Catechist",
  description: "Meet the Catechist of The Most Holy Trinity Presbyterian Church.",
};

export default function CatechistPage() {
  return (
    <>
      <PageHero
        title="The Catechist"
        subtitle="Meet our catechist"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[var(--bg-card)] rounded-2xl overflow-hidden border border-[var(--border)]">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] p-8 flex items-center justify-center">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                </div>
                <div className="md:w-2/3 p-8">
                  <h2 className="text-2xl font-display font-bold text-[var(--text)] mb-2">
                    Catechist
                  </h2>
                  <p className="text-[var(--accent)] font-medium mb-4">
                    Church Catechist
                  </p>
                  <p className="text-[var(--text-muted)] mb-6">
                    Our catechist plays a vital role in the spiritual education and formation of our 
                    congregation. They lead catechism classes, prepare members for baptism and confirmation, 
                    and support the minister in various pastoral duties.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                      <Mail className="w-4 h-4" />
                      <span>catechist@tmhtpresby.org</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                      <Phone className="w-4 h-4" />
                      <span>Contact through church office</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-[var(--bg-card)] rounded-xl p-8 border border-[var(--border)]">
              <h3 className="text-xl font-semibold text-[var(--text)] mb-4">Role of the Catechist</h3>
              <ul className="space-y-3 text-[var(--text-muted)]">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                  <span>Teaching catechism classes for new members and youth</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                  <span>Preparing candidates for baptism and confirmation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                  <span>Assisting in worship services and pastoral care</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                  <span>Supporting the minister in church administration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
