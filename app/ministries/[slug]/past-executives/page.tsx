"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Users, Calendar } from "lucide-react";

interface LeadershipMember {
  id: string;
  firstName: string;
  lastName: string;
  title: string | null;
  imageUrl: string | null;
  startDate: string;
  endDate: string | null;
  position: {
    id: string;
    title: string;
  };
}

interface ExecutivePeriod {
  period: string;
  startYear: number;
  endYear: number;
  executives: LeadershipMember[];
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

function groupByPeriod(executives: LeadershipMember[]): ExecutivePeriod[] {
  const periodMap = new Map<string, LeadershipMember[]>();
  
  executives.forEach((exec) => {
    const startYear = new Date(exec.startDate).getFullYear();
    const endYear = exec.endDate ? new Date(exec.endDate).getFullYear() : new Date().getFullYear();
    const period = `${startYear} - ${endYear}`;
    
    if (!periodMap.has(period)) {
      periodMap.set(period, []);
    }
    periodMap.get(period)!.push(exec);
  });
  
  return Array.from(periodMap.entries())
    .map(([period, executives]) => ({
      period,
      startYear: parseInt(period.split(" - ")[0]),
      endYear: parseInt(period.split(" - ")[1]) || new Date().getFullYear(),
      executives,
    }))
    .sort((a, b) => b.startYear - a.startYear);
}

export default function PastExecutivesPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [ministryName, setMinistryName] = useState("");
  const [pastExecutives, setPastExecutives] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/ministries/${slug}/leaders`);
        if (res.ok) {
          const data = await res.json();
          setPastExecutives(data.past || []);
          setMinistryName(data.ministryName || slug);
        }
      } catch (error) {
        console.error("Failed to fetch past executives:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  const periods = groupByPeriod(pastExecutives);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[var(--primary)]/10 to-transparent py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href={`/ministries/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline mb-6"
          >
            <ArrowLeft size={16} />
            Back to {ministryName || "Ministry"}
          </Link>
          
          <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-[var(--text)]">
            Past Executives
          </h1>
          <p className="text-[var(--text-muted)] mt-2">
            Historical leadership of {ministryName || "this ministry"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-[var(--border)] rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j}>
                      <div className="aspect-[3/4] bg-[var(--border)] rounded-xl mb-3"></div>
                      <div className="h-4 bg-[var(--border)] rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-[var(--border)] rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : pastExecutives.length === 0 ? (
          <div className="text-center py-16">
            <Users size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
            <p className="text-[var(--text-muted)]">No past executives records found.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {periods.map((period) => (
              <div key={period.period}>
                {/* Period Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                    <Calendar size={18} />
                    <span className="font-semibold">{period.period}</span>
                  </div>
                  <div className="flex-1 h-px bg-[var(--border)]"></div>
                </div>

                {/* Executives Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {period.executives.map((exec) => (
                    <div key={exec.id} className="group">
                      {/* Photo */}
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-[var(--bg-card)] border border-[var(--border)] group-hover:border-[var(--accent)]/40 transition-colors">
                        {exec.imageUrl ? (
                          <Image
                            src={exec.imageUrl}
                            alt={`${exec.firstName} ${exec.lastName}`}
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[var(--border)] to-[var(--bg)]">
                            <span className="text-2xl font-bold text-[var(--text-muted)]">
                              {exec.firstName[0]}{exec.lastName[0]}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="text-center">
                        <h3 className="font-semibold text-[var(--text)] text-sm mb-0.5">
                          {exec.title && `${exec.title} `}
                          {exec.firstName} {exec.lastName}
                        </h3>
                        <p className="text-xs font-medium text-[var(--accent)]">
                          {exec.position.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
