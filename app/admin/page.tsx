import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  BarChart3, Users, BookOpen, Heart, Calendar, MessageSquare,
  Image, Megaphone, Bell, Eye, TrendingUp, Plus, ArrowRight,
  FileText, Mic
} from "lucide-react";

async function getDashboardStats() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalMembers,
    newMembersWeek,
    totalSermons,
    totalDonations,
    donationSumMonth,
    upcomingEvents,
    totalPosts,
    totalBlogPosts,
    totalAlbums,
    pageViewsWeek,
    pendingCampaigns,
    recentRsvps,
    recentContacts,
    recentPrayers,
  ] = await Promise.all([
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.sermon.count({ where: { published: true } }),
    prisma.donation.count({ where: { status: "completed" } }),
    prisma.donation.aggregate({
      where: { status: "completed", createdAt: { gte: thirtyDaysAgo } },
      _sum: { amount: true },
    }),
    prisma.event.count({ where: { published: true, startDate: { gte: now } } }),
    prisma.discussionPost.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.galleryAlbum.count({ where: { published: true } }),
    prisma.pageView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.campaign.count({ where: { status: "draft" } }),
    prisma.eventRsvp.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.contact.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.prayerRequest.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
  ]);

  return {
    totalMembers,
    newMembersWeek,
    totalSermons,
    totalDonations,
    monthlyGiving: (donationSumMonth._sum.amount || 0) / 100,
    upcomingEvents,
    totalPosts,
    totalBlogPosts,
    totalAlbums,
    pageViewsWeek,
    pendingCampaigns,
    recentRsvps,
    recentContacts,
    recentPrayers,
  };
}

export default async function AdminDashboard() {
  const s = await getDashboardStats();

  return (
    <div>
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[var(--text)]">
          Admin Dashboard
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Overview of The Most Holy Trinity Presbyterian Church platform
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: "Members", value: s.totalMembers, sub: `+${s.newMembersWeek} this week`, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Page Views", value: s.pageViewsWeek.toLocaleString(), sub: "last 7 days", icon: Eye, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Giving (30d)", value: `GH₵${s.monthlyGiving.toLocaleString()}`, sub: `${s.totalDonations} total`, icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
          { label: "Sermons", value: s.totalSermons, sub: "published", icon: Mic, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Events", value: s.upcomingEvents, sub: "upcoming", icon: Calendar, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Discussions", value: s.totalPosts, sub: "community posts", icon: MessageSquare, color: "text-cyan-500", bg: "bg-cyan-500/10" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-4">
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon size={16} className={stat.color} />
            </div>
            <p className="text-lg font-bold text-[var(--text)]">{stat.value}</p>
            <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">{stat.label}</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Activity alerts */}
      {(s.recentContacts > 0 || s.recentPrayers > 0 || s.recentRsvps > 0 || s.pendingCampaigns > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {s.recentContacts > 0 && (
            <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 flex items-center gap-3">
              <Bell size={16} className="text-blue-500 shrink-0" />
              <p className="text-xs text-blue-700"><strong>{s.recentContacts}</strong> new contact message{s.recentContacts !== 1 ? "s" : ""} this week</p>
            </div>
          )}
          {s.recentPrayers > 0 && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 flex items-center gap-3">
              <Heart size={16} className="text-emerald-500 shrink-0" />
              <p className="text-xs text-emerald-700"><strong>{s.recentPrayers}</strong> new prayer request{s.recentPrayers !== 1 ? "s" : ""} this week</p>
            </div>
          )}
          {s.recentRsvps > 0 && (
            <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 flex items-center gap-3">
              <Calendar size={16} className="text-amber-500 shrink-0" />
              <p className="text-xs text-amber-700"><strong>{s.recentRsvps}</strong> new RSVP{s.recentRsvps !== 1 ? "s" : ""} this week</p>
            </div>
          )}
          {s.pendingCampaigns > 0 && (
            <div className="rounded-lg bg-purple-50 border border-purple-100 p-3 flex items-center gap-3">
              <Megaphone size={16} className="text-purple-500 shrink-0" />
              <p className="text-xs text-purple-700"><strong>{s.pendingCampaigns}</strong> draft campaign{s.pendingCampaigns !== 1 ? "s" : ""} pending</p>
            </div>
          )}
        </div>
      )}

      {/* Quick actions + Management sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-6">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text)] mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            {[
              { label: "Add Sermon", href: "/admin/sermons", icon: Mic, color: "text-purple-500" },
              { label: "Create Event", href: "/admin/events", icon: Calendar, color: "text-amber-500" },
              { label: "Write Blog Post", href: "/admin/blog", icon: FileText, color: "text-blue-500" },
              { label: "Upload Photos", href: "/admin/gallery", icon: Image, color: "text-emerald-500" },
              { label: "Send Campaign", href: "/admin/campaigns", icon: Megaphone, color: "text-rose-500" },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 rounded-lg p-3 hover:bg-[var(--bg)] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--bg)] flex items-center justify-center group-hover:bg-[var(--accent)]/10 transition-colors">
                  <action.icon size={16} className={action.color} />
                </div>
                <span className="text-sm font-medium text-[var(--text)] flex-1">{action.label}</span>
                <Plus size={14} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        {/* Manage content */}
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-6">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text)] mb-4">
            Manage Content
          </h2>
          <div className="space-y-2">
            {[
              { label: "Sermons", count: s.totalSermons, href: "/admin/sermons", icon: BookOpen },
              { label: "Events", count: s.upcomingEvents, href: "/admin/events", icon: Calendar },
              { label: "Blog Posts", count: s.totalBlogPosts, href: "/admin/blog", icon: FileText },
              { label: "Gallery Albums", count: s.totalAlbums, href: "/admin/gallery", icon: Image },
              { label: "Campaigns", count: s.pendingCampaigns, href: "/admin/campaigns", icon: Megaphone },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between rounded-lg p-3 hover:bg-[var(--bg)] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <item.icon size={16} className="text-[var(--text-muted)]" />
                  <span className="text-sm text-[var(--text)]">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                  <ArrowRight size={14} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-6">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text)] mb-4">
            Insights
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-[var(--bg)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-emerald-500" />
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Growth</span>
              </div>
              <p className="text-xl font-bold text-[var(--text)]">+{s.newMembersWeek}</p>
              <p className="text-xs text-[var(--text-muted)]">new members this week</p>
            </div>
            <div className="rounded-lg bg-[var(--bg)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart size={14} className="text-rose-500" />
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Giving</span>
              </div>
              <p className="text-xl font-bold text-[var(--text)]">GH₵{s.monthlyGiving.toLocaleString()}</p>
              <p className="text-xs text-[var(--text-muted)]">last 30 days</p>
            </div>
            <Link
              href="/admin/analytics"
              className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] p-3 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/5 transition-colors"
            >
              <BarChart3 size={16} />
              View Full Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
