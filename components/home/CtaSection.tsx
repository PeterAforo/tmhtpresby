"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-content",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
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

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-[var(--bg)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "relative rounded-2xl overflow-hidden",
            "px-6 py-14 sm:px-12 sm:py-20 text-center"
          )}
          style={{
            background: `
              radial-gradient(ellipse 70% 50% at 80% 20%, rgba(49,114,86,0.3) 0%, transparent 50%),
              radial-gradient(ellipse 60% 60% at 20% 80%, rgba(46,49,146,0.25) 0%, transparent 50%),
              linear-gradient(135deg, #0C1529 0%, #1a2a50 50%, #152040 100%)
            `,
          }}
        >
          {/* Decorative border glow */}
          <div
            className="absolute inset-0 rounded-2xl opacity-40"
            style={{
              background: "linear-gradient(135deg, rgba(49,114,86,0.3) 0%, transparent 30%, transparent 70%, rgba(46,49,146,0.2) 100%)",
            }}
            aria-hidden="true"
          />

          <div className="cta-content opacity-0 relative z-10">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
              You&apos;re Always Welcome Here
            </h2>
            <p className="text-white/65 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Whether you&apos;re exploring faith for the first time or looking
              for a church to call home, we&apos;d love to meet you this Sunday.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className={cn(
                  "inline-flex items-center px-8 py-4 rounded-lg text-base font-semibold",
                  "bg-[#317256] text-white shadow-lg shadow-[#317256]/25",
                  "hover:bg-[#28614a] hover:shadow-xl hover:shadow-[#317256]/30",
                  "transition-all duration-200 hover:-translate-y-0.5"
                )}
              >
                Plan Your Visit
              </Link>
              <Link
                href="/live"
                className={cn(
                  "inline-flex items-center px-8 py-4 rounded-lg text-base font-semibold",
                  "border-2 border-white/20 text-white",
                  "hover:bg-white/10 hover:border-white/35",
                  "transition-all duration-200"
                )}
              >
                Watch Live
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
