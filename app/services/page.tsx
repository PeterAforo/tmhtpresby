import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { Clock, MapPin, Calendar } from "lucide-react";
import { CHURCH_INFO } from "@/lib/constants";

export const metadata = {
  title: "Services",
  description: "Join us for worship services throughout the week at Most Holy Trinity Presbyterian Church.",
};

const SERVICES = [
  {
    name: "First Service",
    day: "Sunday",
    time: "7:00 AM - 8:30 AM",
    description: "A quiet, reflective service perfect for early risers seeking a peaceful start to their Sunday.",
    features: ["Traditional hymns", "Communion (first Sunday)", "Sermon"],
  },
  {
    name: "Second Service",
    day: "Sunday",
    time: "9:30 AM - 11:30 AM",
    description: "Our main worship service with full choir, praise team, and children's church running concurrently.",
    features: ["Full choir", "Children's church", "Youth participation", "Sermon"],
  },
  {
    name: "Third Service",
    day: "Sunday",
    time: "12:00 PM - 2:00 PM",
    description: "A vibrant afternoon service with contemporary worship and dynamic preaching.",
    features: ["Contemporary worship", "Praise team", "Sermon"],
  },
  {
    name: "Midweek Bible Study",
    day: "Wednesday",
    time: "6:30 PM - 8:00 PM",
    description: "Deepen your understanding of Scripture through interactive Bible study and discussion.",
    features: ["In-depth Bible study", "Group discussion", "Prayer time"],
  },
  {
    name: "Prayer Night",
    day: "Friday",
    time: "6:00 PM - 8:00 PM",
    description: "A powerful time of corporate prayer, intercession, and spiritual warfare.",
    features: ["Worship", "Intercessory prayer", "Testimonies"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeroWithBackground
        pageSlug="services"
        overline="Join Us"
        title="Worship Services"
        subtitle="Experience God's presence with us"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Location info */}
            <div className="bg-[var(--primary)]/5 rounded-xl p-6 mb-12 flex items-center gap-4">
              <MapPin className="w-6 h-6 text-[var(--primary)] flex-shrink-0" />
              <div>
                <p className="font-medium text-[var(--text)]">Our Location</p>
                <p className="text-[var(--text-muted)]">{CHURCH_INFO.address.formatted}</p>
              </div>
            </div>

            {/* Services list */}
            <div className="space-y-6">
              {SERVICES.map((service) => (
                <div
                  key={service.name}
                  className="bg-[var(--bg-card)] rounded-xl p-6 md:p-8 border border-[var(--border)]"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-shrink-0 flex items-center gap-3 md:w-48">
                      <Calendar className="w-5 h-5 text-[var(--primary)]" />
                      <span className="font-medium text-[var(--text)]">{service.day}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-sm text-[var(--text-muted)]">{service.time}</span>
                      </div>
                      <h2 className="text-xl font-semibold text-[var(--text)] mb-2">
                        {service.name}
                      </h2>
                      <p className="text-[var(--text-muted)] mb-4">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature) => (
                          <span
                            key={feature}
                            className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
