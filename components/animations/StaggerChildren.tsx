"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  duration?: number;
  distance?: number;
  direction?: "up" | "left" | "right";
}

export function StaggerChildren({
  children,
  className = "",
  stagger = 0.1,
  duration = 0.6,
  distance = 30,
  direction = "up",
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const children = ref.current.children;
    if (!children.length) return;

    const dirMap = {
      up: { y: distance, x: 0 },
      left: { x: distance, y: 0 },
      right: { x: -distance, y: 0 },
    };

    const from = dirMap[direction];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        children,
        { opacity: 0, ...from },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [stagger, duration, distance, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
