"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Calendar, ChevronRight, History } from "lucide-react";
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
  const [pastLeaders, setPastLeaders] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const res = await fetch(`/api/ministries/${ministrySlug}/leaders`);
        if (res.ok) {
          const data = await res.json();
          setCurrentLeaders(data.current || []);
          setPastLeaders(data.past || []);
        }
      } catch (error) {
        console.error("Failed to fetch ministry leaders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaders();
  }, [ministrySlug]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-[var(--border)] rounded w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-[var(--border)] rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (currentLeaders.length === 0 && pastLeaders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Current Executives */}
      {currentLeaders.length > 0 && (
        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)] mb-4">
            Current Executives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentLeaders.map((leader) => (
              <div
                key={leader.id}
                className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-bold text-lg shrink-0">
                    {leader.imageUrl ? (
                      <img
                        src={leader.imageUrl}
                        alt={`${leader.firstName} ${leader.lastName}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      `${leader.firstName[0]}${leader.lastName[0]}`
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-0.5">
                      {leader.position.title}
                    </p>
                    <p className="text-sm font-semibold text-[var(--text)]">
                      {leader.title && `${leader.title} `}
                      {leader.firstName} {leader.lastName}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-1">
                      <Calendar size={12} />
                      {formatTenure(leader.startDate, leader.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Executives Toggle */}
      {pastLeaders.length > 0 && (
        <div>
          <button
            onClick={() => setShowPast(!showPast)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            <History size={16} />
            {showPast ? "Hide" : "View"} Past Executives ({pastLeaders.length})
            <ChevronRight
              size={16}
              className={cn("transition-transform", showPast && "rotate-90")}
            />
          </button>

          {showPast && (
            <div className="mt-4 space-y-3">
              <h3 className="text-lg font-semibold text-[var(--text)]">
                Past Executives
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pastLeaders.map((leader) => (
                  <div
                    key={leader.id}
                    className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--border)] flex items-center justify-center text-[var(--text-muted)] font-medium text-sm shrink-0">
                        {leader.firstName[0]}{leader.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text)]">
                          {leader.title && `${leader.title} `}
                          {leader.firstName} {leader.lastName}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {leader.position.title} • {formatTenure(leader.startDate, leader.endDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
