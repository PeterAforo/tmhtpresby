"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

type MinistryCategory = "all" | "music" | "generational" | "others";

interface Ministry {
  title: string;
  description: string;
  image: string;
  href: string;
  category: MinistryCategory[];
}

const ministries: Ministry[] = [
  {
    title: "Music Ministry",
    description: "Worship through song and instruments, leading the congregation in praise.",
    image: "/img/pictures/2/040.jpg",
    href: "/ministries/music",
    category: ["all", "music"],
  },
  {
    title: "Women's Ministry",
    description: "Empowering women to grow in faith, fellowship, and service.",
    image: "/img/pictures/2/010.jpg",
    href: "/ministries/women",
    category: ["all", "generational"],
  },
  {
    title: "Church Ministry",
    description: "Supporting the overall mission and operations of the church.",
    image: "/img/pictures/2/001.jpg",
    href: "/ministries/church",
    category: ["all", "others"],
  },
  {
    title: "Men's Ministry",
    description: "Building godly men through discipleship and brotherhood.",
    image: "/img/pictures/2/020.jpg",
    href: "/ministries/men",
    category: ["all", "generational"],
  },
  {
    title: "Youth Ministry",
    description: "Nurturing the next generation in faith and Christian values.",
    image: "/img/pictures/2/050.jpg",
    href: "/ministries/youth",
    category: ["all", "generational"],
  },
  {
    title: "Help Ministry",
    description: "Reaching out to those in need with compassion and support.",
    image: "/img/pictures/2/060.jpg",
    href: "/ministries/help",
    category: ["all", "others"],
  },
];

const categories = [
  { id: "all" as MinistryCategory, label: "All" },
  { id: "music" as MinistryCategory, label: "Music" },
  { id: "generational" as MinistryCategory, label: "Generational Groups" },
  { id: "others" as MinistryCategory, label: "Others" },
];

export function MinistriesSection() {
  const [activeCategory, setActiveCategory] = useState<MinistryCategory>("all");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ministry-header",
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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const filteredMinistries = ministries.filter((ministry) =>
    ministry.category.includes(activeCategory)
  );

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="ministry-header flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-[#E31B23] text-sm font-semibold mb-2">
              <Plus size={16} />
              <span>MINISTRIES</span>
            </div>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-[#0F172A]">
              Our Ministries
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "text-[#E31B23] border-b-2 border-[#E31B23]"
                    : "text-gray-600 hover:text-[#E31B23]"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ministries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMinistries.map((ministry, index) => (
            <motion.div
              key={ministry.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link
                href={ministry.href}
                className="group relative h-80 rounded-lg overflow-hidden block"
              >
                {/* Background Image */}
                <Image
                  src={ministry.image}
                  alt={ministry.title}
                  fill
                  className="object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-300"
                />
                
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-[#0F172A]" />
                
                {/* Plus Icon */}
                <div className="absolute top-4 left-4 w-10 h-10 bg-[#E31B23] rounded flex items-center justify-center">
                  <Plus size={20} className="text-white" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-semibold text-xl mb-3">
                    {ministry.title}
                  </h3>
                  <div className="flex items-start gap-2">
                    <Plus size={14} className="text-[#E31B23] shrink-0 mt-1" />
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {ministry.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
