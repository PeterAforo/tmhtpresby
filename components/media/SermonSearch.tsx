"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SermonSearchProps {
  series: { slug: string; title: string; count: number }[];
  speakers: { id: string; name: string }[];
}

export function SermonSearch({ series, speakers }: SermonSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(searchParams.get("series") || "");
  const [selectedSpeaker, setSelectedSpeaker] = useState(searchParams.get("speaker") || "");

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedSeries) params.set("series", selectedSeries);
    if (selectedSpeaker) params.set("speaker", selectedSpeaker);
    router.push(`/sermons${params.toString() ? `?${params}` : ""}`);
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedSeries("");
    setSelectedSpeaker("");
    router.push("/sermons");
  };

  const hasActiveFilters = query || selectedSeries || selectedSpeaker;

  return (
    <div className="mb-10">
      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyFilters();
          }}
          className="relative flex-1"
        >
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sermons by title, speaker, or scripture..."
            className={cn(
              "w-full pl-10 pr-4 py-3 rounded-lg text-sm",
              "bg-[var(--bg-card)] text-[var(--text)] border border-[var(--border)]",
              "placeholder:text-[var(--text-muted)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            )}
          />
        </form>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium",
            "bg-[var(--bg-card)] text-[var(--text)] border border-[var(--border)]",
            showFilters && "border-[var(--accent)] text-[var(--accent)]",
            "hover:border-[var(--accent)]/40 transition-colors"
          )}
        >
          <Filter size={16} />
          Filter
          <ChevronDown
            size={14}
            className={cn("transition-transform", showFilters && "rotate-180")}
          />
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mt-4 p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Series filter */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                Series
              </label>
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className={cn(
                  "w-full px-3 py-2.5 rounded-lg text-sm",
                  "bg-[var(--bg)] text-[var(--text)] border border-[var(--border)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                )}
              >
                <option value="">All Series</option>
                {series.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.title} ({s.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Speaker filter */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                Speaker
              </label>
              <select
                value={selectedSpeaker}
                onChange={(e) => setSelectedSpeaker(e.target.value)}
                className={cn(
                  "w-full px-3 py-2.5 rounded-lg text-sm",
                  "bg-[var(--bg)] text-[var(--text)] border border-[var(--border)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                )}
              >
                <option value="">All Speakers</option>
                {speakers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={applyFilters}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-semibold",
                "bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
              )}
            >
              Apply Filters
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                <X size={14} />
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
