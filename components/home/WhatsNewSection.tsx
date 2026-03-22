"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  category: string;
  publishedAt: string;
}

const categoryImages: Record<string, string> = {
  devotional: "/img/pictures/2/025.jpg",
  "bible-study": "/img/pictures/2/035.jpg",
  family: "/img/pictures/2/045.jpg",
  outreach: "/img/pictures/2/055.jpg",
  worship: "/img/pictures/2/020.jpg",
  culture: "/img/pictures/2/030.jpg",
  general: "/img/pictures/2/040.jpg",
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function WhatsNewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/blog?limit=3");
        if (res.ok) {
          const data = await res.json();
          setNews(data.posts || []);
        }
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  useEffect(() => {
    if (loading || news.length === 0) return;

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
  }, [loading, news]);

  return (
    <section ref={sectionRef} className="py-20 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="whatsnew-header text-center mb-12">
          <span className="text-[var(--accent)] text-sm font-semibold uppercase tracking-wider">
            Latest Updates
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-white mt-2">
            What&apos;s New
          </h2>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="whatsnew-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-[#1E293B] rounded-lg h-80" />
            ))}
          </div>
        ) : news.length === 0 ? (
          <p className="text-center text-gray-400">No news available at the moment.</p>
        ) : (
          <div className="whatsnew-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => (
              <motion.div
                key={item.id}
                className="whatsnew-card"
                whileHover={{ y: -5 }}
              >
                <Link
                  href={`/blog/${item.slug}`}
                  className="group bg-[#1E293B] rounded-xl overflow-hidden hover:bg-[#2D3B4F] transition-colors block"
                >
                  <div className="relative h-48">
                    <Image
                      src={categoryImages[item.category] || categoryImages.general}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-[var(--accent)] text-white text-xs font-semibold capitalize">
                      {item.category.replace("-", " ")}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <Calendar size={16} />
                      <span>{formatDate(item.publishedAt)}</span>
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {item.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#0F172A] transition-colors"
          >
            View All Articles
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
