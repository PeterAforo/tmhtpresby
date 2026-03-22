"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const news = [
  {
    title: "Annual Church Conference 2024",
    excerpt: "Join us for our annual conference featuring guest speakers and workshops.",
    date: "December 15, 2024",
    image: "/img/pictures/2/025.jpg",
    href: "/news/annual-conference-2024",
  },
  {
    title: "Community Outreach Program",
    excerpt: "Our outreach team visited local communities to share God's love.",
    date: "November 28, 2024",
    image: "/img/pictures/2/035.jpg",
    href: "/news/community-outreach",
  },
  {
    title: "Youth Camp Registration Open",
    excerpt: "Register your children for our exciting summer youth camp program.",
    date: "November 20, 2024",
    image: "/img/pictures/2/045.jpg",
    href: "/news/youth-camp",
  },
];

export function WhatsNewSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".whatsnew-header",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
      gsap.fromTo(
        ".whatsnew-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".whatsnew-grid",
            start: "top 80%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="whatsnew-header text-center mb-12">
          <span className="text-[#E31B23] text-sm font-semibold uppercase tracking-wider">
            Latest Updates
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-white mt-2">
            What&apos;s New
          </h2>
        </div>

        {/* News Grid */}
        <div className="whatsnew-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.div
              key={index}
              className="whatsnew-card"
              whileHover={{ y: -5 }}
            >
            <Link
              href={item.href}
              className="group bg-[#1E293B] rounded-lg overflow-hidden hover:bg-[#2D3B4F] transition-colors block"
            >
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                  <Calendar size={16} />
                  <span>{item.date}</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-[#E31B23] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {item.excerpt}
                </p>
              </div>
            </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            href="/news"
            className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded hover:bg-white hover:text-[#0F172A] transition-colors"
          >
            View All News
          </Link>
        </div>
      </div>
    </section>
  );
}
