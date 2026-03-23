"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Download,
  Bell,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  CalendarDays,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MinistryEvent {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  isRecurring: boolean;
}

interface MonthGroup {
  month: string;
  monthNum: number;
  year: number;
  events: MinistryEvent[];
}

function formatDayNumber(dateStr: string): string {
  return new Date(dateStr).getDate().toString().padStart(2, "0");
}

function formatDayName(dateStr: string): string {
  return new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(new Date(dateStr));
}

function formatFullDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

function groupEventsByMonth(events: MinistryEvent[]): MonthGroup[] {
  const groups = new Map<string, MinistryEvent[]>();
  
  events.forEach((event) => {
    const date = new Date(event.startDate);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(event);
  });

  return Array.from(groups.entries())
    .map(([key, events]) => {
      const [year, month] = key.split("-").map(Number);
      const monthName = new Intl.DateTimeFormat("en-GB", { month: "long" }).format(new Date(year, month));
      return {
        month: monthName,
        monthNum: month,
        year,
        events: events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
      };
    })
    .sort((a, b) => a.year - b.year || a.monthNum - b.monthNum);
}

function generateGoogleCalendarUrl(event: MinistryEvent): string {
  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate);
  
  let dates: string;
  if (event.startTime) {
    const [startHour, startMin] = event.startTime.split(":").map(Number);
    startDate.setHours(startHour, startMin, 0, 0);
    
    if (event.endTime) {
      const [endHour, endMin] = event.endTime.split(":").map(Number);
      endDate.setHours(endHour, endMin, 0, 0);
    } else {
      endDate.setHours(startHour + 1, startMin, 0, 0);
    }
    
    const formatDateTime = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    dates = `${formatDateTime(startDate)}/${formatDateTime(endDate)}`;
  } else {
    const formatDate = (d: Date) => d.toISOString().split("T")[0].replace(/-/g, "");
    dates = `${formatDate(startDate)}/${formatDate(endDate)}`;
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates,
    details: event.description || "",
    location: event.location || "",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function generateICalUrl(event: MinistryEvent): string {
  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate);
  
  if (event.startTime) {
    const [startHour, startMin] = event.startTime.split(":").map(Number);
    startDate.setHours(startHour, startMin, 0, 0);
    
    if (event.endTime) {
      const [endHour, endMin] = event.endTime.split(":").map(Number);
      endDate.setHours(endHour, endMin, 0, 0);
    } else {
      endDate.setHours(startHour + 1, startMin, 0, 0);
    }
  }

  const formatDateTime = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TMHT Presby//Ministry Calendar//EN",
    "BEGIN:VEVENT",
    `DTSTART:${formatDateTime(startDate)}`,
    `DTEND:${formatDateTime(endDate)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description || ""}`,
    `LOCATION:${event.location || ""}`,
    `UID:${event.id}@tmhtpresby.org`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
}

export default function MinistryProgramPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [ministryName, setMinistryName] = useState("");
  const [events, setEvents] = useState<MinistryEvent[]>([]);
  const [programArtwork, setProgramArtwork] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [reminderEmail, setReminderEmail] = useState("");
  const [reminderSubmitting, setReminderSubmitting] = useState(false);
  const [reminderSuccess, setReminderSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, ministryRes] = await Promise.all([
          fetch(`/api/ministries/${slug}/events?year=${new Date().getFullYear()}`),
          fetch(`/api/ministries/${slug}`),
        ]);
        
        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setEvents(data.events || []);
        }
        
        if (ministryRes.ok) {
          const data = await ministryRes.json();
          setMinistryName(data.ministry?.name || slug);
          setProgramArtwork(data.ministry?.programArtwork || null);
        }
      } catch (error) {
        console.error("Failed to fetch program data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    // Expand current month by default
    const currentMonth = `${new Date().getFullYear()}-${new Date().getMonth()}`;
    setExpandedMonths(new Set([currentMonth]));
  }, [slug]);

  const monthGroups = groupEventsByMonth(events);

  const toggleMonth = (key: string) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleReminderSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderEmail) return;

    setReminderSubmitting(true);
    try {
      // In a real app, this would call an API to save the subscription
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setReminderSuccess(true);
      setReminderEmail("");
    } catch (error) {
      console.error("Failed to signup for reminders:", error);
    } finally {
      setReminderSubmitting(false);
    }
  };

  const downloadAllAsIcs = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//TMHT Presby//Ministry Calendar//EN",
      `X-WR-CALNAME:${ministryName} Program ${new Date().getFullYear()}`,
      ...events.flatMap((event) => {
        const startDate = new Date(event.startDate);
        const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate);
        
        if (event.startTime) {
          const [startHour, startMin] = event.startTime.split(":").map(Number);
          startDate.setHours(startHour, startMin, 0, 0);
          if (event.endTime) {
            const [endHour, endMin] = event.endTime.split(":").map(Number);
            endDate.setHours(endHour, endMin, 0, 0);
          } else {
            endDate.setHours(startHour + 1, startMin, 0, 0);
          }
        }

        const formatDateTime = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        
        return [
          "BEGIN:VEVENT",
          `DTSTART:${formatDateTime(startDate)}`,
          `DTEND:${formatDateTime(endDate)}`,
          `SUMMARY:${event.title}`,
          `DESCRIPTION:${event.description || ""}`,
          `LOCATION:${event.location || ""}`,
          `UID:${event.id}@tmhtpresby.org`,
          "END:VEVENT",
        ];
      }),
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ministryName.replace(/\s+/g, "-")}-Program-${new Date().getFullYear()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-[var(--text)]">
                {new Date().getFullYear()} Program
              </h1>
              <p className="text-[var(--text-muted)] mt-2">
                Annual activities and events for {ministryName || "this ministry"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={downloadAllAsIcs}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]/40 transition-colors"
              >
                <Download size={16} />
                Download Program
              </button>
              <a
                href={`https://calendar.google.com/calendar/r?cid=webcal://tmhtpresby.org/api/ministries/${slug}/calendar.ics`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
              >
                <CalendarDays size={16} />
                Sync to Calendar
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-[var(--border)] rounded-lg mb-3"></div>
                    <div className="h-24 bg-[var(--border)] rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-16 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
                <CalendarDays size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
                <h3 className="text-lg font-semibold text-[var(--text)] mb-2">No Events Scheduled</h3>
                <p className="text-[var(--text-muted)]">
                  Check back soon for upcoming activities.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {monthGroups.map((group) => {
                  const key = `${group.year}-${group.monthNum}`;
                  const isExpanded = expandedMonths.has(key);
                  const isCurrentMonth = group.monthNum === new Date().getMonth() && group.year === new Date().getFullYear();

                  return (
                    <div key={key} className="rounded-xl border border-[var(--border)] overflow-hidden">
                      {/* Month Header */}
                      <button
                        onClick={() => toggleMonth(key)}
                        className={cn(
                          "w-full flex items-center justify-between p-4 text-left transition-colors",
                          isCurrentMonth ? "bg-[var(--accent)]/10" : "bg-[var(--bg-card)]",
                          "hover:bg-[var(--accent)]/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            isCurrentMonth ? "bg-[var(--accent)] text-white" : "bg-[var(--border)] text-[var(--text-muted)]"
                          )}>
                            <Calendar size={20} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-[var(--text)]">
                              {group.month} {group.year}
                            </h3>
                            <p className="text-xs text-[var(--text-muted)]">
                              {group.events.length} event{group.events.length !== 1 ? "s" : ""}
                              {isCurrentMonth && " • Current Month"}
                            </p>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>

                      {/* Events */}
                      {isExpanded && (
                        <div className="border-t border-[var(--border)] divide-y divide-[var(--border)]">
                          {group.events.map((event) => (
                            <div key={event.id} className="p-4 bg-[var(--bg)] hover:bg-[var(--bg-card)] transition-colors">
                              <div className="flex gap-4">
                                {/* Date */}
                                <div className="shrink-0 w-14 text-center">
                                  <div className="w-14 h-14 rounded-xl bg-[var(--accent)]/10 flex flex-col items-center justify-center">
                                    <span className="text-xl font-bold text-[var(--accent)] leading-none">
                                      {formatDayNumber(event.startDate)}
                                    </span>
                                    <span className="text-[10px] font-medium text-[var(--accent)] uppercase">
                                      {formatDayName(event.startDate)}
                                    </span>
                                  </div>
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-[var(--text)] mb-1">{event.title}</h4>
                                  <div className="flex flex-wrap gap-3 text-xs text-[var(--text-muted)]">
                                    {event.startTime && (
                                      <span className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {event.startTime}{event.endTime && ` - ${event.endTime}`}
                                      </span>
                                    )}
                                    {event.location && (
                                      <span className="flex items-center gap-1">
                                        <MapPin size={12} />
                                        {event.location}
                                      </span>
                                    )}
                                  </div>
                                  {event.description && (
                                    <p className="mt-2 text-sm text-[var(--text-muted)]">{event.description}</p>
                                  )}
                                </div>

                                {/* Actions */}
                                <div className="shrink-0 flex gap-2">
                                  <a
                                    href={generateGoogleCalendarUrl(event)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--accent)] transition-colors"
                                    title="Add to Google Calendar"
                                  >
                                    <ExternalLink size={16} />
                                  </a>
                                  <a
                                    href={generateICalUrl(event)}
                                    download={`${event.title.replace(/\s+/g, "-")}.ics`}
                                    className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--accent)] transition-colors"
                                    title="Download .ics file"
                                  >
                                    <Download size={16} />
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Program Artwork */}
            {programArtwork && (
              <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                <div className="relative aspect-[3/4]">
                  <Image src={programArtwork} alt="Program Artwork" fill className="object-cover" />
                </div>
                <div className="p-4 bg-[var(--bg-card)]">
                  <a
                    href={programArtwork}
                    download
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
                  >
                    <Download size={14} />
                    Download Artwork
                  </a>
                </div>
              </div>
            )}

            {/* Reminder Signup */}
            <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text)]">Get Reminders</h3>
                  <p className="text-xs text-[var(--text-muted)]">Never miss an event</p>
                </div>
              </div>

              {reminderSuccess ? (
                <div className="p-4 rounded-lg bg-green-500/10 text-green-600 text-sm">
                  You&apos;re signed up! We&apos;ll send you reminders before each event.
                </div>
              ) : (
                <form onSubmit={handleReminderSignup} className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={reminderEmail}
                    onChange={(e) => setReminderEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    required
                  />
                  <button
                    type="submit"
                    disabled={reminderSubmitting}
                    className="w-full px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {reminderSubmitting ? "Signing up..." : "Sign Up for Reminders"}
                  </button>
                </form>
              )}
            </div>

            {/* Share */}
            <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                  <Share2 size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text)]">Share Program</h3>
                  <p className="text-xs text-[var(--text-muted)]">Spread the word</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `${ministryName} Program ${new Date().getFullYear()}`,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    }
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--text)] hover:border-[var(--accent)]/40 transition-colors"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
