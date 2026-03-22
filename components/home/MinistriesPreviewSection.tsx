"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, Heart, Music, BookOpen, HandHelping, Baby } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const FEATURED_MINISTRIES = [
  {
    icon: Baby,
    name: "Children",
    tagline: "Nurturing young hearts in God's word",
    href: "/ministries/children",
  },
  {
    icon: Users,
    name: "Youth",
    tagline: "Empowering the next generation",
    href: "/ministries/youth",
  },
  {
    icon: Heart,
    name: "Women",
    tagline: "Growing together in grace and purpose",
    href: "/ministries/women",
  },
  {
    icon: BookOpen,
    name: "Men",
    tagline: "Iron sharpens iron in fellowship",
    href: "/ministries/men",
  },
  {
    icon: Music,
    name: "Worship",
    tagline: "Leading God's people in praise",
    href: "/ministries/worship",
  },
  {
    icon: HandHelping,
    name: "Outreach",
    tagline: "Serving our community with love",
    href: "/ministries/outreach",
  },
];

export function MinistriesPreviewSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ministry-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-[var(--bg)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text)] tracking-tight">
            Find Your Place
          </h2>
          <div
            aria-hidden="true"
            className="mx-auto mt-3 h-1 w-16 rounded-full bg-[var(--divider)]"
          />
          <p className="mt-4 text-[var(--text-muted)] text-base sm:text-lg max-w-2xl mx-auto">
            From children to seniors, there&apos;s a ministry for everyone at
            Most Holy Trinity.
          </p>
        </div>

        {/* Ministry cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED_MINISTRIES.map((ministry) => {
            const Icon = ministry.icon;
            return (
              <Link
                key={ministry.name}
                href={ministry.href}
                className={cn(
                  "ministry-card opacity-0",
                  "group flex items-start gap-4 p-6 rounded-xl",
                  "bg-[var(--bg-card)] border border-[var(--border)]",
                  "hover:border-[var(--accent)]/40 hover:shadow-md hover:-translate-y-1",
                  "transition-all duration-200"
                )}
              >
                <div className="shrink-0 p-3 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors duration-200">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {ministry.name}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    {ministry.tagline}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link
            href="/ministries"
            className={cn(
              "inline-flex items-center px-6 py-3 rounded-md text-sm font-semibold",
              "border border-[var(--primary)] text-[var(--primary)]",
              "hover:bg-[var(--primary)] hover:text-white",
              "transition-all duration-200"
            )}
          >
            View All Ministries
          </Link>
        </div>
      </div>
    </section>
  );
}
