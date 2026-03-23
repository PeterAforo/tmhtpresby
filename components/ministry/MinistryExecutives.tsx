"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, History, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadershipMember {
  id: string;
  firstName: string;
  lastName: string;
  title: string | null;
  email: string | null;
  imageUrl: string | null;
  bio: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  position: {
    id: string;
    title: string;
  };
}

interface MinistryExecutivesProps {
  ministrySlug: string;
  ministryName: string;
}

function formatTenure(startDate: string, endDate: string | null): string {
  const start = new Date(startDate);
  const startYear = start.getFullYear();
  
  if (!endDate) {
    return `${startYear} - Present`;
  }
  
  const end = new Date(endDate);
  const endYear = end.getFullYear();
  
  return `${startYear} - ${endYear}`;
}

export function MinistryExecutives({ ministrySlug, ministryName }: MinistryExecutivesProps) {
  const [currentLeaders, setCurrentLeaders] = useState<LeadershipMember[]>([]);
  const [pastLeadersCount, setPastLeadersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const res = await fetch(`/api/ministries/${ministrySlug}/leaders`);
        if (res.ok) {
          const data = await res.json();
          setCurrentLeaders(data.current || []);
          setPastLeadersCount(data.past?.length || 0);
        }
      } catch (error) {
        console.error("Failed to fetch ministry leaders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaders();
  }, [ministrySlug]);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 300;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-[var(--border)] rounded w-1/4 mb-6"></div>
        <div className="flex gap-6 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-56 shrink-0">
              <div className="aspect-[3/4] bg-[var(--border)] rounded-xl mb-3"></div>
              <div className="h-4 bg-[var(--border)] rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-[var(--border)] rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentLeaders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)]">
            Current Executives
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Meet the leadership team of {ministryName}
          </p>
        </div>
        
        {/* Navigation & Past Executives Link */}
        <div className="flex items-center gap-3">
          {pastLeadersCount > 0 && (
            <Link
              href={`/ministries/${ministrySlug}/past-executives`}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg)] border border-[var(--border)] transition-colors"
            >
              <History size={16} />
              Past Executives
            </Link>
          )}
          
          {currentLeaders.length > 3 && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="p-2 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent)]/40 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-2 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent)]/40 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={carouselRef}
        className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {currentLeaders.map((leader) => (
          <div
            key={leader.id}
            className="group w-52 sm:w-56 shrink-0 snap-start"
          >
            {/* Photo */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-[var(--bg-card)] border border-[var(--border)] group-hover:border-[var(--accent)]/40 transition-colors">
              {leader.imageUrl ? (
                <Image
                  src={leader.imageUrl}
                  alt={`${leader.firstName} ${leader.lastName}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[var(--accent)]/10 to-[var(--primary)]/10">
                  <Users size={48} className="text-[var(--accent)]/40 mb-2" />
                  <span className="text-3xl font-bold text-[var(--accent)]/60">
                    {leader.firstName[0]}{leader.lastName[0]}
                  </span>
                </div>
              )}
              
              {/* Gradient overlay */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            
            {/* Info */}
            <div className="text-center px-2">
              <h3 className="font-semibold text-[var(--text)] text-base mb-1 group-hover:text-[var(--accent)] transition-colors">
                {leader.title && `${leader.title} `}
                {leader.firstName} {leader.lastName}
              </h3>
              <p className="text-sm font-medium text-[var(--accent)] mb-1">
                {leader.position.title}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {formatTenure(leader.startDate, leader.endDate)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Past Executives Link */}
      {pastLeadersCount > 0 && (
        <div className="sm:hidden">
          <Link
            href={`/ministries/${ministrySlug}/past-executives`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            <History size={16} />
            View Past Executives ({pastLeadersCount})
            <ChevronRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
