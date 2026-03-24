"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { Church, LayoutGrid, Calendar } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const quickLinks = [
  {
    icon: Church,
    title: "Our Church",
    description: "Discover our rich history, beliefs, and the vibrant community that makes up The Most Holy Trinity Presbyterian Church.",
    href: "/about",
    variant: "white" as const,
  },
  {
    icon: LayoutGrid,
    title: "Ministries",
    description: "Find your place to serve and grow. From youth to seniors, there's a ministry for everyone in our church family.",
    href: "/ministries",
    variant: "red" as const,
  },
  {
    icon: Calendar,
    title: "Events",
    description: "Stay connected with upcoming services, fellowship gatherings, outreach programs, and special celebrations.",
    href: "/events",
    variant: "white" as const,
  },
];

export function QuickLinksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".quick-link-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="quick-links" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.title}
              className="quick-link-card"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={link.href}
                className={`block p-8 text-center transition-all duration-300 ${
                  link.variant === "red" 
                    ? "bg-[#E31B23] text-white" 
                    : "bg-white text-gray-900 hover:bg-gray-50"
                } ${index === 0 ? "border border-gray-200 border-r-0" : ""} ${index === 2 ? "border border-gray-200 border-l-0" : ""}`}
              >
                {/* Icon */}
                <motion.div 
                  className="flex justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center ${
                    link.variant === "red"
                      ? "border-white/30"
                      : "border-[#E31B23]/20"
                  }`}>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      link.variant === "red"
                        ? "bg-white/10"
                        : "bg-[#E31B23]/5"
                    }`}>
                      <link.icon 
                        size={28} 
                        className={link.variant === "red" ? "text-white" : "text-[#E31B23]"} 
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Title */}
                <h3 className={`font-semibold text-xl mb-3 ${
                  link.variant === "red" ? "text-white" : "text-[#0F172A]"
                }`}>
                  {link.title}
                </h3>

                {/* Description */}
                <p className={`text-sm leading-relaxed ${
                  link.variant === "red" ? "text-white/80" : "text-gray-500"
                }`}>
                  {link.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
