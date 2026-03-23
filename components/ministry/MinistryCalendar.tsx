"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, Plus, ExternalLink, ChevronRight, CalendarDays } from "lucide-react";
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
  recurrencePattern: string | null;
}

interface MinistryCalendarProps {
  ministrySlug: string;
  ministryName: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

function formatDayNumber(dateStr: string): string {
  const date = new Date(dateStr);
  return date.getDate().toString().padStart(2, "0");
}

function formatDayName(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(date);
}

function formatMonthYear(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(date);
}

function getCurrentMonthName(): string {
  return new Intl.DateTimeFormat("en-GB", { month: "long" }).format(new Date());
}

function generateGoogleCalendarUrl(event: MinistryEvent): string {
  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate);
  
  // If there's a time, use it; otherwise, make it an all-day event
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
    // All-day event
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

export function MinistryCalendar({ ministrySlug, ministryName }: MinistryCalendarProps) {
  const [events, setEvents] = useState<MinistryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`/api/ministries/${ministrySlug}/events`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
        }
      } catch (error) {
        console.error("Failed to fetch ministry events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [ministrySlug]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-[var(--border)] rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[var(--border)] rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="p-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-center">
        <CalendarDays size={40} className="mx-auto text-[var(--text-muted)] mb-3" />
        <h3 className="text-lg font-semibold text-[var(--text)] mb-1">No Upcoming Events</h3>
        <p className="text-sm text-[var(--text-muted)]">
          Check back soon for {ministryName} activities and programs.
        </p>
      </div>
    );
  }

  // Show only first 4 events for the month preview
  const previewEvents = events.slice(0, 4);
  const hasMoreEvents = events.length > 4;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)]">
            {getCurrentMonthName()} Program
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Upcoming activities and events
          </p>
        </div>
        <Link
          href={`/ministries/${ministrySlug}/program`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
        >
          <CalendarDays size={16} />
          View Full Program
        </Link>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {previewEvents.map((event) => (
          <div
            key={event.id}
            className="group p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:shadow-md transition-all"
          >
            <div className="flex gap-4">
              {/* Date Column */}
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

              {/* Event Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[var(--text)] text-sm mb-1 line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                  {event.title}
                </h3>
                
                <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
                  {event.startTime && (
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {event.startTime}
                      {event.endTime && ` - ${event.endTime}`}
                    </span>
                  )}
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      <span className="truncate max-w-[120px]">{event.location}</span>
                    </span>
                  )}
                </div>

                {event.description && (
                  <p className="mt-1.5 text-xs text-[var(--text-muted)] line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>

              {/* Add to Calendar */}
              <div className="relative group/cal shrink-0">
                <button
                  className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--accent)] transition-colors"
                  title="Add to calendar"
                >
                  <Plus size={16} />
                </button>
                
                <div className="absolute right-0 top-full mt-1 w-44 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] shadow-lg opacity-0 invisible group-hover/cal:opacity-100 group-hover/cal:visible transition-all z-10">
                  <a
                    href={generateGoogleCalendarUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
                  >
                    <ExternalLink size={12} />
                    Google Calendar
                  </a>
                  <a
                    href={generateICalUrl(event)}
                    download={`${event.title.replace(/\s+/g, "-")}.ics`}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
                  >
                    <Calendar size={12} />
                    Apple / Outlook
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More Link */}
      {hasMoreEvents && (
        <div className="text-center">
          <Link
            href={`/ministries/${ministrySlug}/program`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            View all {events.length} events
            <ChevronRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
