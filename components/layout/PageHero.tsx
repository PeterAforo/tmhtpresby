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
  overlayColor = "rgba(12, 21, 41, 0.85)"
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
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className={cn(
        "relative pt-28 pb-16 lg:pt-36 lg:pb-20 overflow-hidden",
        !backgroundImage && "bg-gradient-to-br from-[#0C1529] via-[#152040] to-[#0C1529]"
      )}
    >
      {/* Background Image */}
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
            aria-hidden="true"
          />
          {/* Overlay for text readability */}
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: overlayColor }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Accent glow */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #317256 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="page-hero-content relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {overline && (
          <p className="text-[#3DA066] text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            {overline}
          </p>
        )}
        <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-white/65 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        <div
          aria-hidden="true"
          className="mx-auto mt-6 h-1 w-16 rounded-full bg-[#3DA066]"
        />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--bg)] to-transparent" />
    </section>
  );
}
