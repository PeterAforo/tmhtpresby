"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScriptureSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".scripture-fade",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
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
    <section
      ref={sectionRef}
      className="py-16 lg:py-24 bg-[var(--bg-card)] border-y border-[var(--border)]"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="scripture-fade opacity-0">
          {/* Decorative cross */}
          <svg
            width="32"
            height="40"
            viewBox="0 0 28 34"
            fill="none"
            className="mx-auto mb-6 opacity-40"
          >
            <path
              d="M14 2 L14 32"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M5 10 L23 10"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          <blockquote>
            <p className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-medium italic text-[var(--text)] leading-relaxed">
              &ldquo;For where two or three gather in my name, there am I with
              them.&rdquo;
            </p>
            <footer className="mt-6">
              <cite className="not-italic text-[var(--accent)] font-semibold text-base sm:text-lg">
                Matthew 18:20
              </cite>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
