import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Radio, Clock, Calendar, Bell, Youtube, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Live Stream",
  description: "Watch our live services from The Most Holy Trinity Presbyterian Church.",
};

const SERVICE_SCHEDULE = [
  { day: "Sunday", time: "7:00 AM", service: "First Service" },
  { day: "Sunday", time: "9:30 AM", service: "Second Service" },
  { day: "Wednesday", time: "6:00 PM", service: "Midweek Bible Study" },
  { day: "Friday", time: "6:00 PM", service: "Prayer Meeting" },
];

export default function LivePage() {
  return (
    <>
      <PageHero
        overline="Watch Online"
        title="Live Stream"
        subtitle="Join us for worship from wherever you are."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Video embed area */}
          <div className="mb-12">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)]">
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/5">
                <div className="w-20 h-20 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-4">
                  <Wifi size={36} className="text-[var(--accent)]" />
                </div>
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--text)] mb-2">
                  No Live Stream Right Now
                </h3>
                <p className="text-sm text-[var(--text-muted)] text-center max-w-md px-4">
                  Our next service will be streamed live. Subscribe to get notified when we go live.
                </p>
              </div>

              {/* Live badge (hidden when offline, shown when live) */}
              <div className="absolute top-4 left-4 hidden">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-semibold">
                  <Radio size={12} className="animate-pulse" />
                  LIVE
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Service schedule */}
            <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
              <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text)] mb-5 flex items-center gap-2">
                <Calendar size={20} className="text-[var(--accent)]" />
                Service Schedule
              </h2>
              <div className="space-y-3">
                {SERVICE_SCHEDULE.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text)]">{s.service}</p>
                      <p className="text-xs text-[var(--text-muted)]">{s.day}</p>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
                      <Clock size={14} /> {s.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button className={cn(
                "w-full flex items-center gap-4 p-5 rounded-xl",
                "bg-[var(--bg-card)] border border-[var(--border)]",
                "hover:border-[var(--accent)]/40 hover:shadow-md transition-all duration-200"
              )}>
                <div className="shrink-0 w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Youtube size={24} className="text-red-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[var(--text)]">Watch on YouTube</p>
                  <p className="text-xs text-[var(--text-muted)]">Subscribe to our channel for past services</p>
                </div>
              </button>

              <button className={cn(
                "w-full flex items-center gap-4 p-5 rounded-xl",
                "bg-[var(--bg-card)] border border-[var(--border)]",
                "hover:border-[var(--accent)]/40 hover:shadow-md transition-all duration-200"
              )}>
                <div className="shrink-0 w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                  <Bell size={24} className="text-[var(--accent)]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[var(--text)]">Get Notified</p>
                  <p className="text-xs text-[var(--text-muted)]">Receive alerts when we go live</p>
                </div>
              </button>

              {/* Scripture */}
              <div className="p-5 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/20 text-center">
                <p className="font-[family-name:var(--font-heading)] text-sm italic text-[var(--text)] leading-relaxed">
                  &ldquo;For where two or three gather in my name, there am I with them.&rdquo;
                </p>
                <p className="mt-2 text-xs font-semibold text-[var(--accent)]">Matthew 18:20</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
