"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Bell, Check, CheckCheck, Calendar, BookOpen, MessageSquare, Megaphone, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  linkUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  general: <Bell size={16} />,
  event: <Calendar size={16} />,
  sermon: <BookOpen size={16} />,
  blog: <BookOpen size={16} />,
  community: <MessageSquare size={16} />,
  campaign: <Megaphone size={16} />,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      console.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    fetchNotifications();
  }

  async function markRead(id: string) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });
    fetchNotifications();
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="bg-gradient-to-b from-[var(--primary)]/10 to-transparent py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-1">Notifications</p>
              <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[var(--text)]">
                Your Notifications
              </h1>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
              >
                <CheckCheck size={16} /> Mark all read
              </button>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-[var(--text-muted)]">{unreadCount} unread</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-16 -mt-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={32} className="mx-auto text-[var(--text-muted)] mb-3" />
            <p className="text-lg text-[var(--text-muted)]">No notifications yet</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">You&apos;ll be notified about events, sermons, and community updates.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => {
              const content = (
                <div
                  className={cn(
                    "rounded-xl border p-4 flex items-start gap-4 transition-all duration-200",
                    notif.isRead
                      ? "bg-[var(--bg-card)] border-[var(--border)]"
                      : "bg-[var(--accent)]/5 border-[var(--accent)]/20"
                  )}
                >
                  <div className={cn("shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
                    notif.isRead ? "bg-[var(--text-muted)]/10 text-[var(--text-muted)]" : "bg-[var(--accent)]/10 text-[var(--accent)]"
                  )}>
                    {typeIcons[notif.type] || typeIcons.general}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-semibold", notif.isRead ? "text-[var(--text-muted)]" : "text-[var(--text)]")}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{notif.message}</p>
                    <p className="text-xs text-[var(--text-muted)]/70 mt-1">{timeAgo(notif.createdAt)}</p>
                  </div>
                  {!notif.isRead && (
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); markRead(notif.id); }}
                      className="shrink-0 p-1.5 rounded-lg text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              );

              return notif.linkUrl ? (
                <Link key={notif.id} href={notif.linkUrl} className="block hover:shadow-md">
                  {content}
                </Link>
              ) : (
                <div key={notif.id}>{content}</div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
