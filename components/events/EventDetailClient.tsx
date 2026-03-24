"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  Share2,
  CalendarPlus,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EventDetailClientProps {
  event: {
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
    likes: number;
  };
}

const fallbackImages = [
  "/img/pictures/2/001.jpg",
  "/img/pictures/2/010.jpg",
  "/img/pictures/2/020.jpg",
  "/img/pictures/2/030.jpg",
];

function formatDateForCalendar(date: Date, time?: string | null): string {
  const d = new Date(date);
  if (time) {
    const [hours, minutes] = time.split(":");
    d.setHours(parseInt(hours), parseInt(minutes));
  }
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function EventDetailClient({ event }: EventDetailClientProps) {
  const [likes, setLikes] = useState(event.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const eventImage = event.imageUrl || fallbackImages[0];
  const eventUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleLike = async () => {
    if (hasLiked || isLiking) return;
    
    setIsLiking(true);
    try {
      const res = await fetch(`/api/events/${event.slug}/like`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
        setHasLiked(true);
      }
    } catch (error) {
      console.error("Error liking event:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying link:", error);
    }
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`, "_blank");
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(event.title)}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`, "_blank");
  };

  const addToGoogleCalendar = () => {
    const startDate = formatDateForCalendar(new Date(event.startDate), event.startTime);
    const endDate = event.endDate 
      ? formatDateForCalendar(new Date(event.endDate), event.endTime)
      : formatDateForCalendar(new Date(event.startDate), event.endTime || event.startTime);
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description || "")}&location=${encodeURIComponent(event.location || "")}`;
    window.open(url, "_blank");
  };

  const downloadICS = () => {
    const startDate = formatDateForCalendar(new Date(event.startDate), event.startTime);
    const endDate = event.endDate 
      ? formatDateForCalendar(new Date(event.endDate), event.endTime)
      : formatDateForCalendar(new Date(event.startDate), event.endTime || event.startTime);
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TMHT Presbyterian Church//Events//EN
BEGIN:VEVENT
UID:${event.id}@tmhtpresby.org
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ""}
LOCATION:${event.location || ""}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.slug}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Event Image Hero */}
      <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden">
        <Image
          src={eventImage}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/90 text-[var(--accent)] capitalize">
            {event.category}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border)] sticky top-16 md:top-20 z-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={hasLiked || isLiking}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                hasLiked
                  ? "bg-rose-500/10 text-rose-500"
                  : "bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] hover:text-rose-500 hover:border-rose-500/30"
              )}
            >
              <Heart size={18} className={hasLiked ? "fill-current" : ""} />
              <span>{likes > 0 ? likes : "Like"}</span>
            </button>

            <div className="flex items-center gap-2">
              {/* Save the Date */}
              <div className="relative">
                <button
                  onClick={addToGoogleCalendar}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
                >
                  <CalendarPlus size={18} />
                  <span className="hidden sm:inline">Save the Date</span>
                </button>
              </div>

              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  <Share2 size={18} />
                  <span className="hidden sm:inline">Share</span>
                </button>

                {/* Share Menu */}
                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-2">
                      <button
                        onClick={shareOnFacebook}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
                      >
                        <Facebook size={18} className="text-blue-600" />
                        Share on Facebook
                      </button>
                      <button
                        onClick={shareOnTwitter}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
                      >
                        <Twitter size={18} className="text-sky-500" />
                        Share on Twitter
                      </button>
                      <button
                        onClick={shareOnLinkedIn}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
                      >
                        <Linkedin size={18} className="text-blue-700" />
                        Share on LinkedIn
                      </button>
                      <hr className="my-2 border-[var(--border)]" />
                      <button
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check size={18} className="text-green-500" />
                            Link Copied!
                          </>
                        ) : (
                          <>
                            <Link2 size={18} />
                            Copy Link
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Options Modal/Dropdown for Save the Date */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-[var(--text-muted)]">Add to calendar:</span>
          <button
            onClick={addToGoogleCalendar}
            className="text-[var(--accent)] hover:underline"
          >
            Google Calendar
          </button>
          <span className="text-[var(--text-muted)]">•</span>
          <button
            onClick={downloadICS}
            className="text-[var(--accent)] hover:underline"
          >
            Apple Calendar / Outlook (.ics)
          </button>
        </div>
      </div>

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </>
  );
}
