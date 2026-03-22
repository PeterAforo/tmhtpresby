"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Target, Heart, ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  goalAmount: number | null;
  raisedAmount: number;
  status: string;
  category: string;
}

export function ProjectsPreviewSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects?featured=true&limit=3");
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects || []);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    if (loading || projects.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".project-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
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
  }, [loading, projects]);

  const getProgressPercentage = (raised: number, goal: number | null) => {
    if (!goal || goal === 0) return 0;
    return Math.min(Math.round((raised / goal) * 100), 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      building: "bg-blue-500",
      education: "bg-purple-500",
      mission: "bg-orange-500",
      community: "bg-green-500",
      general: "bg-gray-500",
    };
    return colors[category] || colors.general;
  };

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-gradient-to-b from-[var(--bg)] to-[var(--bg-card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-semibold mb-4">
            <Target size={16} />
            <span>ONGOING PROJECTS</span>
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text)] mb-4">
            Support Our Mission
          </h2>
          <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-2xl mx-auto">
            Join us in making a difference. Your generous contributions help us serve our community and spread God&apos;s love.
          </p>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-[var(--bg-card)] h-[420px]" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="text-center text-[var(--text-muted)]">No projects available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {projects.map((project) => {
              const progress = getProgressPercentage(project.raisedAmount, project.goalAmount);
              
              return (
                <div
                  key={project.id}
                  className={cn(
                    "project-card opacity-0",
                    "group rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)]",
                    "hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  )}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={project.imageUrl || "/img/pictures/2/001.jpg"}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Category badge */}
                    <div className={cn(
                      "absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-semibold uppercase tracking-wider",
                      getCategoryColor(project.category)
                    )}>
                      {project.category}
                    </div>

                    {/* Status badge */}
                    {project.status === "completed" && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold">
                        Completed
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text)] mb-2 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Progress bar */}
                    {project.goalAmount && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-[var(--text-muted)]">Raised</span>
                          <span className="font-semibold text-[var(--accent)]">{progress}%</span>
                        </div>
                        <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs mt-2 text-[var(--text-muted)]">
                          <span>{formatCurrency(project.raisedAmount)}</span>
                          <span>Goal: {formatCurrency(project.goalAmount)}</span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg text-sm font-semibold border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                      >
                        Read More
                        <ArrowRight size={14} />
                      </Link>
                      <Link
                        href={`/giving?project=${project.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
                      >
                        <Heart size={14} />
                        Donate
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/projects"
            className={cn(
              "inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold",
              "bg-[var(--primary)] text-white hover:opacity-90 transition-opacity"
            )}
          >
            <TrendingUp size={18} />
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
