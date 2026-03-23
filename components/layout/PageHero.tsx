"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  /** Optional breadcrumb-style overline, e.g. "About" */
  overline?: string;
  /** Background image URL */
  backgroundImage?: string;
  /** Overlay color for text readability */
  overlayColor?: string;
}

export function PageHero({ 
  title, 
  subtitle, 
  overline,
  backgroundImage,
}: PageHeroProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".page-hero-content > *",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative pt-24 pb-8 sm:pt-28 sm:pb-10 overflow-hidden"
    >
      {/* Background with gradient overlay */}
      {backgroundImage ? (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
            aria-hidden="true"
          />
          {/* Gradient overlay for readability */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-[#0C1529]/95 via-[#0C1529]/80 to-[#0C1529]/60"
            aria-hidden="true"
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C1529] via-[#152040] to-[#0C1529]" />
      )}

      {/* Subtle accent line */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3DA066]/50 to-transparent"
        aria-hidden="true"
      />

      <div className="page-hero-content relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          {overline && (
            <>
              <span className="text-[#3DA066] text-xs font-semibold uppercase tracking-[0.15em]">
                {overline}
              </span>
              <span className="w-8 h-[1px] bg-[#3DA066]/50" aria-hidden="true" />
            </>
          )}
        </div>
        
        <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight">
          {title}
        </h1>
        
        {subtitle && (
          <p className="mt-2 text-white/70 text-sm sm:text-base max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
