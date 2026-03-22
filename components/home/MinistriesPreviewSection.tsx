"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, Heart, Music, BookOpen, HandHelping, Baby, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const FEATURED_MINISTRIES = [
  {
    icon: Baby,
    name: "Children's Ministry",
    tagline: "Nurturing young hearts in God's word",
    href: "/ministries/children",
    image: "/img/pictures/2/010.jpg",
  },
  {
    icon: Users,
    name: "Youth Ministry",
    tagline: "Empowering the next generation",
    href: "/ministries/youth",
    image: "/img/pictures/2/020.jpg",
  },
  {
    icon: Heart,
    name: "Women's Ministry",
    tagline: "Growing together in grace and purpose",
    href: "/ministries/women",
    image: "/img/pictures/2/030.jpg",
  },
  {
    icon: BookOpen,
    name: "Men's Ministry",
    tagline: "Iron sharpens iron in fellowship",
    href: "/ministries/men",
    image: "/img/pictures/2/040.jpg",
  },
  {
    icon: Music,
    name: "Worship Ministry",
    tagline: "Leading God's people in praise",
    href: "/ministries/worship",
    image: "/img/pictures/2/050.jpg",
  },
  {
    icon: HandHelping,
    name: "Outreach Ministry",
    tagline: "Serving our community with love",
    href: "/ministries/outreach",
    image: "/img/pictures/2/060.jpg",
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
            The Most Holy Trinity.
          </p>
        </div>

        {/* Ministry cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_MINISTRIES.map((ministry) => {
            const Icon = ministry.icon;
            return (
              <Link
                key={ministry.name}
                href={ministry.href}
                className={cn(
                  "ministry-card opacity-0",
                  "group relative overflow-hidden rounded-2xl",
                  "aspect-[4/3] sm:aspect-[3/2]",
                  "hover:-translate-y-2 hover:shadow-2xl",
                  "transition-all duration-300"
                )}
              >
                {/* Background Image */}
                <Image
                  src={ministry.image}
                  alt={ministry.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60 transition-colors duration-300" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  {/* Icon */}
                  <div className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-[var(--accent)] transition-colors duration-300">
                    <Icon size={22} />
                  </div>
                  
                  {/* Text */}
                  <div>
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white mb-2 group-hover:text-[var(--accent)] transition-colors">
                      {ministry.name}
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed mb-3">
                      {ministry.tagline}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Learn More
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
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
