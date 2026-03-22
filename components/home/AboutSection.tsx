"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, ArrowRight, Mail } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-image",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
      gsap.fromTo(
        ".about-content",
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
      gsap.fromTo(
        ".about-badge",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white relative overflow-hidden">
      {/* Decorative blue shape on left */}
      <div className="absolute left-0 top-0 w-32 h-64 bg-[#3D4DB7] opacity-90 z-0" />
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Pastor image with stats badge */}
          <div className="about-image relative">
            {/* Circular image container */}
            <div className="relative">
              {/* Blue decorative circle behind */}
              <div className="absolute -left-8 -top-8 w-80 h-80 rounded-full border-[16px] border-[#3D4DB7]/20 z-0" />
              
              {/* Main circular image */}
              <motion.div 
                className="relative w-80 h-80 rounded-full overflow-hidden z-10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/img/pictures/2/020.jpg"
                  alt="Church Pastor"
                  fill
                  className="object-cover"
                />
              </motion.div>
              
              {/* Stats badge - positioned at bottom left of circle */}
              <motion.div 
                className="about-badge absolute bottom-4 -left-4 bg-[#0F172A] text-white rounded-full w-40 h-40 flex flex-col items-center justify-center z-20 shadow-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold">1500</span>
                  <span className="text-[#E31B23] text-3xl font-bold">+</span>
                </div>
                <span className="text-sm text-center mt-1">Join Our Church</span>
              </motion.div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="about-content">
            {/* Label */}
            <div className="flex items-center gap-2 text-[#E31B23] text-sm font-semibold mb-4">
              <Plus size={16} />
              <span>WE HAVE 25+ YEARS OF EXPERIENCE</span>
            </div>

            {/* Heading */}
            <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-tight">
              We Are A Church<br />That Believes In God.
            </h2>

            {/* Description with red cross */}
            <div className="flex items-start gap-4 mb-8">
              <Plus size={20} className="text-[#E31B23] shrink-0 mt-1" />
              <p className="text-gray-500 leading-relaxed">
                We are a church that belives in Jesus christ and the followers and We are a church that 
                belives in Jesus christ
              </p>
            </div>

            {/* Feature boxes */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Helping Hand */}
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" rx="4" fill="#FEE2E2"/>
                    <path d="M20 10L20 30M10 20L30 20" stroke="#E31B23" strokeWidth="2"/>
                    <path d="M14 14L14 26M26 14L26 26" stroke="#E31B23" strokeWidth="1.5"/>
                    <path d="M12 18L12 22M28 18L28 22" stroke="#E31B23" strokeWidth="1"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-[#0F172A] text-lg mb-1">Helping Hand</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Vestibulum ac diam sit amet quam vehicula elementum sed.
                  </p>
                </div>
              </div>

              {/* Open Hearts */}
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" rx="4" fill="#FEE2E2"/>
                    <path d="M20 10L20 30M10 20L30 20" stroke="#E31B23" strokeWidth="2"/>
                    <path d="M14 14L14 26M26 14L26 26" stroke="#E31B23" strokeWidth="1.5"/>
                    <path d="M12 18L12 22M28 18L28 22" stroke="#E31B23" strokeWidth="1"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-[#0F172A] text-lg mb-1">Open Hearts</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Vestibulum ac diam sit amet quam vehicula elementum sed.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <motion.div
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-[#0F172A] text-[#0F172A] font-semibold text-sm tracking-wide hover:bg-[#0F172A] hover:text-white transition-colors"
              >
                LEARN MORE
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom contact bar */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row">
            {/* Phone section - Red background */}
            <div className="bg-[#0F172A] py-6 px-8 flex items-center gap-6 md:w-1/2">
              <div className="text-white">
                <p className="text-sm text-gray-400 mb-1">Talk to Papa!</p>
                <p className="text-3xl font-bold tracking-wide">+233-683-9756</p>
              </div>
            </div>

            {/* "or" divider */}
            <div className="hidden md:flex items-center justify-center bg-white px-4 py-6">
              <span className="text-[#E31B23] font-semibold">or</span>
            </div>

            {/* Email signup section */}
            <div className="bg-white py-6 px-8 flex-1 border-t md:border-t-0 md:border-l border-gray-200">
              <p className="text-[#0F172A] text-sm font-semibold mb-3">Recieve Daily Devotions</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31B23]/20"
                />
                <button className="px-5 py-3 bg-[#E31B23] text-white hover:bg-[#c91720] transition-colors">
                  <Mail size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
