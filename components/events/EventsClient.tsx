"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Sparkles,
  Filter,
  ChevronDown,
  CalendarDays,
  Grid3X3,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string | null;
  category: string;
  imageUrl: string | null;
  startDate: Date;
  endDate: Date | null;
  startTime: string | null;
  endTime: string | null;
  capacity: number | null;
  isFeatured: boolean;
  _count: { rsvps: number };
}

interface EventsClientProps {
  featured: Event[];
  upcoming: Event[];
  pastEvents: Event[];
  categories: string[];
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  worship: { bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-500/30" },
  youth: { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", border: "border-orange-500/30" },
  women: { bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400", border: "border-pink-500/30" },
  men: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/30" },
  outreach: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/30" },
  family: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/30" },
  prayer: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30" },
  conference: { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-500/30" },
  special: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/30" },
};

const defaultCategory = { bg: "bg-gray-500/10", text: "text-gray-600 dark:text-gray-400", border: "border-gray-500/30" };

const fallbackImages = [
  "/img/pictures/2/001.jpg",
  "/img/pictures/2/010.jpg",
  "/img/pictures/2/020.jpg",
  "/img/pictures/2/030.jpg",
  "/img/pictures/2/040.jpg",
  "/img/pictures/2/050.jpg",
];

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date));
}

function formatShortDate(date: Date): { day: string; month: string; weekday: string } {
  const d = new Date(date);
  return {
    day: d.getDate().toString(),
    month: d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
    weekday: d.toLocaleDateString("en-GB", { weekday: "short" }),
  };
}

function getEventImage(event: Event, index: number): string {
  return event.imageUrl || fallbackImages[index % fallbackImages.length];
}

function getDaysUntil(date: Date): number {
  const now = new Date();
  const eventDate = new Date(date);
  const diffTime = eventDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function EventsClient({ featured, upcoming, pastEvents, categories }: EventsClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showPastEvents, setShowPastEvents] = useState(false);

  const allUpcoming = [...featured, ...upcoming];
  const filteredEvents = activeFilter === "all" 
    ? allUpcoming 
    : allUpcoming.filter((e) => e.category === activeFilter);

  return (
    <>
      {/* Featured Hero Event */}
      {featured.length > 0 && (
        <section className="bg-[var(--bg)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-[var(--accent)]" />
              <h2 className="text-lg font-semibold text-[var(--text)]">Featured Events</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featured.slice(0, 2).map((event, index) => {
                const dateInfo = formatShortDate(event.startDate);
                const daysUntil = getDaysUntil(event.startDate);
                const colors = categoryColors[event.category] || defaultCategory;
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={`/events/${event.slug}`}
                      className="group relative block rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-300 hover:shadow-xl"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={getEventImage(event, index)}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        
                        <div className="absolute top-4 left-4 bg-white dark:bg-gray-900 rounded-xl p-3 text-center shadow-lg">
                          <span className="block text-xs font-bold text-[var(--accent)]">{dateInfo.month}</span>
                          <span className="block text-2xl font-bold text-[var(--text)]">{dateInfo.day}</span>
                          <span className="block text-xs text-[var(--text-muted)]">{dateInfo.weekday}</span>
                        </div>
                        
                        {daysUntil > 0 && daysUntil <= 7 && (
                          <div className="absolute top-4 right-4 bg-[var(--accent)] text-white px-3 py-1.5 rounded-full text-xs font-bold">
                            {daysUntil === 1 ? "Tomorrow!" : `${daysUntil} days`}
                          </div>
                        )}
                        
                        <div className="absolute bottom-4 left-4 right-4">
                          <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2", colors.bg, colors.text)}>
                            {event.category}
                          </span>
                          <h3 className="text-xl font-bold text-white group-hover:text-[var(--accent)] transition-colors">
                            {event.title}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        {event.description && (
                          <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">{event.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
                          {event.startTime && (
                            <span className="flex items-center gap-1.5">
                              <Clock size={14} className="text-[var(--accent)]" />
                              {event.startTime}{event.endTime ? ` - ${event.endTime}` : ""}
                            </span>
                          )}
                          {event.location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin size={14} className="text-[var(--accent)]" />
                              {event.location}
                            </span>
                          )}
                          {event._count.rsvps > 0 && (
                            <span className="flex items-center gap-1.5">
                              <Users size={14} className="text-[var(--accent)]" />
                              {event._count.rsvps} attending
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                          <span className="text-sm font-medium text-[var(--accent)] group-hover:underline flex items-center gap-1">
                            View Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                          {event.capacity && (
                            <span className="text-xs text-[var(--text-muted)]">
                              {event.capacity - event._count.rsvps} spots left
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Filter & View Controls */}
      <section className="bg-[var(--bg)] border-y border-[var(--border)] sticky top-16 md:top-20 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              <Filter size={16} className="text-[var(--text-muted)] shrink-0" />
              <button
                onClick={() => setActiveFilter("all")}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  activeFilter === "all"
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]"
                )}
              >
                All Events
              </button>
              {categories.map((cat) => {
                const colors = categoryColors[cat] || defaultCategory;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all capitalize",
                      activeFilter === cat
                        ? "bg-[var(--accent)] text-white"
                        : cn("border", colors.bg, colors.text, colors.border, "hover:opacity-80")
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-[var(--text-muted)]">View:</span>
              <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "grid" ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-card)] text-[var(--text-muted)]"
                  )}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "list" ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-card)] text-[var(--text-muted)]"
                  )}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid/List */}
      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)]">
              {activeFilter === "all" ? "All Upcoming Events" : `${activeFilter} Events`}
            </h2>
            <span className="text-sm text-[var(--text-muted)]">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {filteredEvents.length > 0 ? (
              viewMode === "grid" ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredEvents.map((event, index) => {
                    const dateInfo = formatShortDate(event.startDate);
                    const colors = categoryColors[event.category] || defaultCategory;
                    
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={`/events/${event.slug}`}
                          className="group block rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-300 hover:shadow-lg h-full"
                        >
                          <div className="relative h-44 overflow-hidden">
                            <Image
                              src={getEventImage(event, index)}
                              alt={event.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            
                            <div className="absolute top-3 left-3 bg-white dark:bg-gray-900 rounded-lg px-2.5 py-1.5 text-center shadow-md">
                              <span className="block text-[10px] font-bold text-[var(--accent)]">{dateInfo.month}</span>
                              <span className="block text-lg font-bold text-[var(--text)] leading-none">{dateInfo.day}</span>
                            </div>
                            
                            <div className="absolute bottom-3 left-3">
                              <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", colors.bg, colors.text)}>
                                {event.category}
                              </span>
                            </div>
                            
                            {event.isFeatured && (
                              <div className="absolute top-3 right-3 bg-[var(--accent)] text-white px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                                <Sparkles size={10} /> Featured
                              </div>
                            )}
                          </div>
                          
                          <div className="p-4">
                            <h3 className="font-semibold text-[var(--text)] mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                              {event.title}
                            </h3>
                            
                            <div className="space-y-1.5 text-xs text-[var(--text-muted)]">
                              {event.startTime && (
                                <div className="flex items-center gap-1.5">
                                  <Clock size={12} className="text-[var(--accent)]" />
                                  {event.startTime}{event.endTime ? ` - ${event.endTime}` : ""}
                                </div>
                              )}
                              {event.location && (
                                <div className="flex items-center gap-1.5">
                                  <MapPin size={12} className="text-[var(--accent)]" />
                                  <span className="truncate">{event.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {filteredEvents.map((event, index) => {
                    const dateInfo = formatShortDate(event.startDate);
                    const colors = categoryColors[event.category] || defaultCategory;
                    
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={`/events/${event.slug}`}
                          className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-300 hover:shadow-md"
                        >
                          <div className="relative w-full sm:w-48 h-32 sm:h-28 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={getEventImage(event, index)}
                              alt={event.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          
                          <div className="hidden sm:flex flex-col items-center justify-center w-16 shrink-0">
                            <span className="text-xs font-bold text-[var(--accent)]">{dateInfo.month}</span>
                            <span className="text-2xl font-bold text-[var(--text)]">{dateInfo.day}</span>
                            <span className="text-xs text-[var(--text-muted)]">{dateInfo.weekday}</span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", colors.bg, colors.text)}>
                                {event.category}
                              </span>
                              {event.isFeatured && (
                                <span className="text-xs text-[var(--accent)] font-semibold flex items-center gap-1">
                                  <Sparkles size={10} /> Featured
                                </span>
                              )}
                            </div>
                            
                            <h3 className="font-semibold text-[var(--text)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                              {event.title}
                            </h3>
                            
                            {event.description && (
                              <p className="text-sm text-[var(--text-muted)] mb-2 line-clamp-1">{event.description}</p>
                            )}
                            
                            <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
                              <span className="sm:hidden flex items-center gap-1">
                                <Calendar size={12} /> {formatDate(event.startDate)}
                              </span>
                              {event.startTime && (
                                <span className="flex items-center gap-1">
                                  <Clock size={12} /> {event.startTime}{event.endTime ? ` - ${event.endTime}` : ""}
                                </span>
                              )}
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin size={12} /> {event.location}
                                </span>
                              )}
                              {event._count.rsvps > 0 && (
                                <span className="flex items-center gap-1">
                                  <Users size={12} /> {event._count.rsvps} attending
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="hidden sm:flex items-center">
                            <ArrowRight size={20} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <CalendarDays size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
                <p className="text-lg text-[var(--text-muted)]">
                  {activeFilter === "all" 
                    ? "No upcoming events. Check back soon!" 
                    : `No ${activeFilter} events scheduled. Try another category.`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Past Events Section */}
      {pastEvents.length > 0 && (
        <section className="py-12 lg:py-16 bg-[var(--bg-card)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setShowPastEvents(!showPastEvents)}
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors mb-6"
            >
              <ChevronDown
                size={20}
                className={cn("transition-transform", showPastEvents && "rotate-180")}
              />
              <span className="font-semibold">Past Events ({pastEvents.length})</span>
            </button>
            
            <AnimatePresence>
              {showPastEvents && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastEvents.map((event, index) => {
                      const dateInfo = formatShortDate(event.startDate);
                      const colors = categoryColors[event.category] || defaultCategory;
                      
                      return (
                        <Link
                          key={event.id}
                          href={`/events/${event.slug}`}
                          className="group block rounded-xl overflow-hidden bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-300 opacity-75 hover:opacity-100"
                        >
                          <div className="relative h-36 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                            <Image
                              src={getEventImage(event, index)}
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            
                            <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 rounded-lg px-2 py-1 text-center">
                              <span className="block text-[10px] font-bold text-[var(--text-muted)]">{dateInfo.month}</span>
                              <span className="block text-sm font-bold text-[var(--text)]">{dateInfo.day}</span>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <span className={cn("inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-2", colors.bg, colors.text)}>
                              {event.category}
                            </span>
                            <h3 className="font-semibold text-[var(--text)] text-sm group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                              {event.title}
                            </h3>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      )}
    </>
  );
}
