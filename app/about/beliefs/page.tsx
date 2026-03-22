import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { BookOpen, Heart, Users, Shield, Cross, Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Beliefs",
  description:
    "The doctrinal foundation of The Most Holy Trinity Presbyterian Church — what we believe and why it matters.",
};

const BELIEFS = [
  {
    icon: BookOpen,
    title: "The Authority of Scripture",
    description:
      "We believe the Bible is the inspired, infallible Word of God — the supreme standard for faith and life. All Scripture is God-breathed and useful for teaching, correcting, and training in righteousness.",
    reference: "2 Timothy 3:16-17",
  },
  {
    icon: Cross,
    title: "The Trinity",
    description:
      "We believe in one God, eternally existing in three persons — Father, Son, and Holy Spirit — equal in power and glory, one in essence and purpose.",
    reference: "Matthew 28:19",
  },
  {
    icon: Heart,
    title: "Salvation by Grace",
    description:
      "We believe that salvation is a gift of God, received through faith in Jesus Christ alone. It is not earned by human effort but freely given by God\u2019s grace.",
    reference: "Ephesians 2:8-9",
  },
  {
    icon: Flame,
    title: "The Holy Spirit",
    description:
      "We believe in the active presence and power of the Holy Spirit, who convicts, regenerates, indwells, and empowers believers for godly living and service.",
    reference: "John 14:26",
  },
  {
    icon: Users,
    title: "The Church",
    description:
      "We believe the Church is the body of Christ, called to worship God, make disciples, and serve the world. Every believer is a vital member of this body.",
    reference: "1 Corinthians 12:27",
  },
  {
    icon: Shield,
    title: "The Return of Christ",
    description:
      "We believe in the personal, visible return of Jesus Christ in glory. This hope shapes how we live, serve, and love in the present.",
    reference: "Acts 1:11",
  },
];

export default function BeliefsPage() {
  return (
    <>
      <PageHero
        overline="About"
        title="What We Believe"
        subtitle="The doctrinal foundation we stand on — rooted in Scripture, expressed in love."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Intro */}
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-[var(--text-muted)] text-base sm:text-lg leading-relaxed">
              As a Presbyterian church, our beliefs are grounded in the Reformed
              tradition and summarised in the historic confessions of faith. These
              core convictions shape our worship, our community, and our mission.
            </p>
          </div>

          {/* Belief cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BELIEFS.map((belief) => {
              const Icon = belief.icon;
              return (
                <div
                  key={belief.title}
                  className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:shadow-lg transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                    {belief.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">
                    {belief.description}
                  </p>
                  <p className="text-xs font-semibold text-[var(--accent)]">
                    {belief.reference}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Confessional standards */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[var(--text)] text-center mb-4">
              Our Confessional Standards
            </h2>
            <div aria-hidden="true" className="mx-auto h-1 w-12 rounded-full bg-[var(--divider)] mb-6" />
            <p className="text-[var(--text-muted)] leading-relaxed text-center mb-8">
              In addition to the creeds of the early church, we hold to these
              Reformed confessional documents:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "The Apostles\u2019 Creed",
                "The Nicene Creed",
                "The Westminster Confession of Faith",
                "The Westminster Shorter & Larger Catechisms",
              ].map((doc) => (
                <div
                  key={doc}
                  className="flex items-center gap-3 p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]"
                >
                  <div className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0" />
                  <span className="text-sm font-medium text-[var(--text)]">
                    {doc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
