"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function SplashScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Skip if already shown this session
    if (sessionStorage.getItem("splash-shown")) {
      setDismissed(true);
      return;
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      sessionStorage.setItem("splash-shown", "1");
      setDismissed(true);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("splash-shown", "1");
          setDismissed(true);
        },
      });

      // 0. Subtle background glow pulse
      tl.fromTo(
        ".splash-glow",
        { opacity: 0, scale: 0.8 },
        { opacity: 0.6, scale: 1.2, duration: 1.5, ease: "power1.inOut" },
        0
      );

      // 1. Draw the cross SVG paths with refined timing
      tl.fromTo(
        ".splash-cross-vertical",
        { strokeDashoffset: 200, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, duration: 1, ease: "power2.inOut" },
        0.3
      );

      tl.fromTo(
        ".splash-cross-horizontal",
        { strokeDashoffset: 200, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, duration: 0.8, ease: "power2.inOut" },
        0.8
      );

      // 1b. Gentle glow around cross after it draws
      tl.fromTo(
        ".splash-cross-glow",
        { opacity: 0 },
        { opacity: 0.5, duration: 0.6, ease: "power1.out" },
        1.2
      );

      // 2. Fade in church name with letter-spacing reveal
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 20, letterSpacing: "0.08em" },
        { opacity: 1, y: 0, letterSpacing: "0.02em", duration: 0.8, ease: "power3.out" },
        1.3
      );

      // 3. Subtitle slides up
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        1.7
      );

      // 4. Hold
      tl.to({}, { duration: 0.6 });

      // 5. Scale up + fade out for dramatic exit
      tl.to(containerRef.current, {
        opacity: 0,
        scale: 1.05,
        duration: 0.6,
        ease: "power2.in",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (dismissed) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--bg)]"
      aria-hidden="true"
    >
      {/* Background glow */}
      <div
        className="splash-glow absolute w-64 h-64 rounded-full opacity-0"
        style={{
          background: "radial-gradient(circle, rgba(49,114,86,0.15) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -55%)",
        }}
        aria-hidden="true"
      />

      {/* Cross SVG */}
      <svg
        width="80"
        height="100"
        viewBox="0 0 80 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-6 relative z-10"
      >
        {/* Cross glow filter */}
        <defs>
          <filter id="crossGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Glow layer */}
        <g className="splash-cross-glow" opacity="0">
          <path d="M40 5 L40 95" stroke="#317256" strokeWidth="12" strokeLinecap="round" filter="url(#crossGlow)" opacity="0.3" />
          <path d="M15 30 L65 30" stroke="#317256" strokeWidth="12" strokeLinecap="round" filter="url(#crossGlow)" opacity="0.3" />
        </g>
        {/* Vertical beam */}
        <path
          className="splash-cross-vertical"
          d="M40 5 L40 95"
          stroke="#317256"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="200"
          strokeDashoffset="200"
        />
        {/* Horizontal beam */}
        <path
          className="splash-cross-horizontal"
          d="M15 30 L65 30"
          stroke="#317256"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="200"
          strokeDashoffset="200"
        />
      </svg>

      {/* Church name */}
      <div ref={textRef} className="opacity-0 text-center px-4 relative z-10">
        <p className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">
          The Most Holy Trinity
        </p>
      </div>
      <p
        ref={taglineRef}
        className="opacity-0 font-[family-name:var(--font-heading)] text-lg sm:text-xl text-[var(--text-muted)] mt-1.5 relative z-10"
      >
        Presbyterian Church
      </p>
    </div>
  );
}
