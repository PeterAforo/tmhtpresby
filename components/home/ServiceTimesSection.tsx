"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { CHURCH_INFO } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

export function ServiceTimesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".service-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split into Sunday services and weekday services
  const sundayServices = CHURCH_INFO.serviceTimes.filter(
    (s) => s.day === "Sunday"
  );
  const weekdayServices = CHURCH_INFO.serviceTimes.filter(
    (s) => s.day !== "Sunday"
  );

  return (
    <section
      ref={sectionRef}
      id="service-times"
      className="py-20 lg:py-28 bg-[var(--bg)]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-[var(--accent)] uppercase tracking-[0.15em] mb-3">
            Service Times
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text)] tracking-tight">
            Join Us This Week
          </h2>
          <div
            aria-hidden="true"
            className="mx-auto mt-4 h-1 w-16 rounded-full bg-[var(--divider)]"
          />
          <p className="mt-5 text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Everyone is welcome. Come as you are and experience the warmth of
            our church family.
          </p>
        </div>

        {/* Sunday services — 3 across */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {sundayServices.map((service, i) => (
            <div
              key={i}
              className={cn(
                "service-card opacity-0",
                "group relative rounded-xl p-6 text-center",
                "bg-[var(--bg-card)] border border-[var(--border)]",
                "hover:border-[var(--accent)]/40 hover:shadow-lg",
                "transition-all duration-200"
              )}
            >
              <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                <Clock size={20} />
              </div>
              <p className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-1">
                {service.day}
              </p>
              <p className="text-3xl font-bold text-[var(--text)]">
                {service.time}
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {service.label}
              </p>
            </div>
          ))}
        </div>

        {/* Weekday services — 2 across */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {weekdayServices.map((service, i) => (
            <div
              key={i}
              className={cn(
                "service-card opacity-0",
                "group relative rounded-xl p-6 text-center",
                "bg-[var(--bg-card)] border border-[var(--border)]",
                "hover:border-[var(--accent)]/40 hover:shadow-lg",
                "transition-all duration-200"
              )}
            >
              <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                <Clock size={20} />
              </div>
              <p className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-1">
                {service.day}
              </p>
              <p className="text-3xl font-bold text-[var(--text)]">
                {service.time}
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {service.label}
              </p>
            </div>
          ))}
        </div>

        {/* Location */}
        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-[var(--text-muted)]">
          <MapPin size={16} className="text-[var(--accent)]" />
          <span>{CHURCH_INFO.address.formatted}</span>
        </div>
      </div>
    </section>
  );
}
