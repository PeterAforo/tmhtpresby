"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const presbyters = [
  {
    name: "Kenne G. Patten",
    role: "Church Member",
    image: "/img/pictures/2/010.jpg",
  },
  {
    name: "Issac D. Thomas",
    role: "Church Member",
    image: "/img/pictures/2/015.jpg",
  },
];

export function PresbyterySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".presbytery-text",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
      gsap.fromTo(
        ".presbytery-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
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
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Text content */}
          <div className="presbytery-text">
            {/* Label */}
            <div className="flex items-center gap-2 text-[#E31B23] text-sm font-semibold mb-4">
              <Plus size={16} />
              <span>THIS WEEK&apos;S</span>
            </div>

            {/* Title */}
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-[#0F172A] mb-6">
              Presbytors on Duty
            </h2>

            {/* Description with cross bullet */}
            <div className="flex items-start gap-3 mb-6">
              <div className="w-px h-12 bg-[#E31B23] mt-1" />
              <p className="text-gray-600 leading-relaxed">
                We are a church that believes in Jesus Christ and the followers and We are a 
                church that believes in Jesus Christ.
              </p>
            </div>

            {/* Paragraph */}
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Nulla porttitor accumsan tincidunt. Vivamus suscipit tortor eget felis porttitor 
              volutpat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices 
              posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, 
              ullamcorper sit amet ligula.
            </p>

            {/* Decorative lines */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-1 bg-[#E31B23]" />
              <div className="w-8 h-1 bg-[#3D4DB7]" />
              <div className="w-4 h-1 bg-gray-300" />
            </div>
          </div>

          {/* Right side - Presbyter cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {presbyters.map((person, index) => (
              <motion.div
                key={index}
                className="presbytery-card bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ y: -5 }}
              >
                {/* Image */}
                <div className="relative h-64">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                  {/* Plus icon */}
                  <button className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
                    <Plus size={16} className="text-gray-600" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 text-center">
                  <p className="text-[#E31B23] text-xs font-semibold uppercase tracking-wider mb-1">
                    {person.role}
                  </p>
                  <h3 className="font-semibold text-[#0F172A] text-lg">
                    {person.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
