import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { Church, MapPin, Clock, Phone } from "lucide-react";
import { CHURCH_INFO } from "@/lib/constants";

export const metadata = {
  title: "About The Church",
  description: "Learn about The Most Holy Trinity Presbyterian Church - our history, mission, and community.",
};

export default function AboutChurchPage() {
  return (
    <>
      <PageHeroWithBackground
        pageSlug="about-church"
        title="About The Church"
        subtitle="Welcome to The Most Holy Trinity Presbyterian Church"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center">
                  <Church className="w-8 h-8 text-[var(--primary)]" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-[var(--text)] m-0">
                    Our Church
                  </h2>
                  <p className="text-[var(--text-muted)] m-0">
                    A Christ-centered community in Lashibi, Accra
                  </p>
                </div>
              </div>

              <p className="text-[var(--text-muted)]">
                The Most Holy Trinity Presbyterian Church is a vibrant, Christ-centered congregation 
                located in the heart of Lashibi, Accra, Ghana. As part of the Presbyterian Church of Ghana (PCG), 
                we are committed to spreading the Gospel, nurturing spiritual growth, and serving our community 
                with love and compassion.
              </p>

              <p className="text-[var(--text-muted)]">
                Our church is built on the foundation of Reformed theology, emphasizing the sovereignty of God, 
                the authority of Scripture, and salvation by grace through faith in Jesus Christ. We believe in 
                the power of worship, fellowship, and service to transform lives and communities.
              </p>

              <h3 className="text-xl font-semibold text-[var(--text)] mt-8 mb-4">Our Vision</h3>
              <p className="text-[var(--text-muted)]">
                To be a beacon of hope and a center of spiritual transformation, where every member is 
                equipped to live out their faith and make a positive impact in the world.
              </p>

              <h3 className="text-xl font-semibold text-[var(--text)] mt-8 mb-4">Our Mission</h3>
              <p className="text-[var(--text-muted)]">
                To worship God, make disciples of Jesus Christ, and serve our community through love, 
                compassion, and the proclamation of the Gospel.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border)]">
                <MapPin className="w-8 h-8 text-[var(--accent)] mb-4" />
                <h3 className="font-semibold text-[var(--text)] mb-2">Location</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  {CHURCH_INFO.address.street}<br />
                  {CHURCH_INFO.address.city}, {CHURCH_INFO.address.region}
                </p>
              </div>

              <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border)]">
                <Clock className="w-8 h-8 text-[var(--accent)] mb-4" />
                <h3 className="font-semibold text-[var(--text)] mb-2">Service Times</h3>
                <div className="text-sm text-[var(--text-muted)] space-y-1">
                  {CHURCH_INFO.serviceTimes.map((service) => (
                    <p key={service.label}>
                      <strong>{service.label}:</strong> {service.day} {service.time}
                    </p>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border)]">
                <Phone className="w-8 h-8 text-[var(--accent)] mb-4" />
                <h3 className="font-semibold text-[var(--text)] mb-2">Contact</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  {CHURCH_INFO.phone}<br />
                  {CHURCH_INFO.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
