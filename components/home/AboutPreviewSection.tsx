"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function AboutPreviewSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-content",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".about-image",
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
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
    <section
      ref={sectionRef}
      className="py-16 lg:py-24 bg-[var(--bg-card)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div className="about-content opacity-0">
            <p className="text-sm font-semibold text-[var(--accent)] uppercase tracking-[0.15em] mb-3">
              About Us
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-[var(--text)] leading-tight mb-4">
              A Church Rooted in Faith,{" "}
              <span className="text-[var(--primary)]">Growing in Love</span>
            </h2>
            <div
              aria-hidden="true"
              className="h-1 w-12 rounded-full bg-[var(--divider)] mb-6"
            />
            <p className="text-[var(--text-muted)] leading-relaxed mb-4">
              The Most Holy Trinity Presbyterian Church has been a beacon of hope
              and faith in Accra for generations. We are a welcoming community
              where every person — regardless of background — can encounter God
              and find their purpose.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-8">
              Grounded in Reformed theology, we hold fast to the authority of
              Scripture while embracing the vibrancy of Ghanaian worship. From
              our children&apos;s ministry to our elder care, every programme is
              designed to nurture faith at every stage of life.
            </p>
            <Link
              href="/about/our-story"
              className={cn(
                "inline-flex items-center gap-2 text-[var(--accent)] font-semibold",
                "hover:gap-3 transition-all duration-200"
              )}
            >
              Discover Our Story
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Image placeholder */}
          <div className="about-image opacity-0">
            <div
              className={cn(
                "aspect-[4/3] rounded-2xl overflow-hidden",
                "bg-gradient-to-br from-[var(--accent)]/20 to-[var(--primary)]/20",
                "flex items-center justify-center border border-[var(--border)]"
              )}
            >
              <div className="text-center px-8">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 80 100"
                  fill="none"
                  className="mx-auto mb-3 opacity-30"
                >
                  <path
                    d="M40 5 L40 95"
                    stroke="var(--accent)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M15 30 L65 30"
                    stroke="var(--accent)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="text-sm text-[var(--text-muted)]">
                  Church congregation photo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
