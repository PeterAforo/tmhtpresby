"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Plus, ExternalLink } from "lucide-react";
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

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
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
  const [selectedEvent, setSelectedEvent] = useState<MinistryEvent | null>(null);

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
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-[var(--border)] rounded w-1/3"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[var(--border)] rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-center">
        <Calendar size={32} className="mx-auto text-[var(--text-muted)] mb-3" />
        <p className="text-sm text-[var(--text-muted)]">
          No upcoming events scheduled for {ministryName}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)]">
        Ministry Calendar
      </h2>

      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Date badge */}
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold mb-2">
                  <Calendar size={12} />
                  {formatDate(event.startDate)}
                  {event.isRecurring && (
                    <span className="ml-1 text-[var(--text-muted)]">• Recurring</span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-[var(--text)] mb-1">
                  {event.title}
                </h3>

                {/* Time & Location */}
                <div className="flex flex-wrap gap-3 text-xs text-[var(--text-muted)]">
                  {event.startTime && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {event.startTime}
                      {event.endTime && ` - ${event.endTime}`}
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
                  <p className="mt-2 text-sm text-[var(--text-muted)] line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>

              {/* Add to calendar dropdown */}
              <div className="relative group">
                <button
                  className="p-2 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-colors"
                  title="Add to calendar"
                >
                  <Plus size={18} />
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-1 w-48 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <a
                    href={generateGoogleCalendarUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
                  >
                    <ExternalLink size={14} />
                    Google Calendar
                  </a>
                  <a
                    href={generateICalUrl(event)}
                    download={`${event.title.replace(/\s+/g, "-")}.ics`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
                  >
                    <Calendar size={14} />
                    Apple / Outlook (.ics)
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
