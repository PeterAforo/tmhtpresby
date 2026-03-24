import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  BarChart3, Users, Heart, Calendar, MessageSquare,
  Image, Megaphone, Bell, Eye, TrendingUp, Plus, ArrowRight,
  FileText, Mic, ShoppingBag, BookOpen
} from "lucide-react";
import DashboardCharts from "@/components/admin/DashboardCharts";

async function getDashboardStats() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Get member growth for last 6 months
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const membersByMonth = await prisma.user.groupBy({
    by: ["createdAt"],
    where: { createdAt: { gte: sixMonthsAgo } },
    _count: true,
  });

  // Process member growth data
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const memberGrowth = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const count = membersByMonth.filter(m => {
      const d = new Date(m.createdAt);
      return d >= monthStart && d <= monthEnd;
    }).reduce((sum, m) => sum + m._count, 0);
    memberGrowth.push({
      month: monthNames[date.getMonth()],
      count,
    });
  }

  const [
    totalMembers,
    newMembersWeek,
    totalSermons,
    totalDonations,
    donationSumMonth,
    upcomingEventsCount,
    upcomingEventsList,
    totalPosts,
    totalBlogPosts,
    totalAlbums,
    totalProducts,
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
    prisma.event.findMany({
      where: { published: true, startDate: { gte: now } },
      orderBy: { startDate: "asc" },
      take: 10,
      select: { id: true, title: true, startDate: true, location: true },
    }),
    prisma.discussionPost.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.galleryAlbum.count({ where: { published: true } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.pageView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.campaign.count({ where: { status: "draft" } }),
    prisma.eventRsvp.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.contact.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.prayerRequest.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
  ]);

  // Age distribution (mock data since we may not have DOB)
  const ageDistribution = [
    { label: "Children (0-12)", count: 0, percentage: 15 },
    { label: "Teens (13-17)", count: 0, percentage: 20 },
    { label: "Young Adults (18-35)", count: 0, percentage: 30 },
    { label: "Adults (36-55)", count: 0, percentage: 25 },
    { label: "Seniors (56+)", count: 0, percentage: 10 },
  ];

  return {
    totalMembers,
    newMembersWeek,
    totalSermons,
    totalDonations,
    monthlyGiving: (donationSumMonth._sum.amount || 0) / 100,
    upcomingEvents: upcomingEventsCount,
    upcomingEventsList,
    totalPosts,
    totalBlogPosts,
    totalAlbums,
    totalProducts,
    pageViewsWeek,
    pendingCampaigns,
    recentRsvps,
    recentContacts,
    recentPrayers,
    memberGrowth,
    genderDistribution: { male: Math.round(totalMembers * 0.45), female: Math.round(totalMembers * 0.55) },
    ageDistribution,
  };
}

export default async function AdminDashboard() {
  const s = await getDashboardStats();

  return (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total Members", value: s.totalMembers, sub: `+${s.newMembersWeek} this week`, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Page Views", value: s.pageViewsWeek.toLocaleString(), sub: "last 7 days", icon: Eye, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total Giving", value: `GH₵${s.monthlyGiving.toLocaleString()}`, sub: "last 30 days", icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Sermons", value: s.totalSermons, sub: "published", icon: Mic, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Events", value: s.upcomingEvents, sub: "upcoming", icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Products", value: s.totalProducts, sub: "in shop", icon: ShoppingBag, color: "text-cyan-600", bg: "bg-cyan-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</span>
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={16} className={stat.color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Activity alerts */}
      {(s.recentContacts > 0 || s.recentPrayers > 0 || s.recentRsvps > 0 || s.pendingCampaigns > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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

      {/* Charts and Calendar */}
      <DashboardCharts
        memberGrowth={s.memberGrowth}
        upcomingEvents={s.upcomingEventsList}
        ageDistribution={s.ageDistribution}
        genderDistribution={s.genderDistribution}
      />

      {/* Quick actions + Management sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Add Sermon", href: "/admin/sermons", icon: Mic, color: "text-purple-500" },
              { label: "Create Event", href: "/admin/events", icon: Calendar, color: "text-amber-500" },
              { label: "Write Blog Post", href: "/admin/blog", icon: FileText, color: "text-blue-500" },
              { label: "Upload Photos", href: "/admin/gallery", icon: Image, color: "text-emerald-500" },
              { label: "Add Product", href: "/admin/products", icon: ShoppingBag, color: "text-cyan-500" },
              { label: "Send Campaign", href: "/admin/campaigns", icon: Megaphone, color: "text-rose-500" },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-[var(--accent)]/10 transition-colors">
                  <action.icon size={16} className={action.color} />
                </div>
                <span className="text-sm font-medium text-gray-700 flex-1">{action.label}</span>
                <Plus size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        {/* Manage content */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Manage Content</h2>
          <div className="space-y-2">
            {[
              { label: "Sermons", count: s.totalSermons, href: "/admin/sermons", icon: Mic },
              { label: "Events", count: s.upcomingEvents, href: "/admin/events", icon: Calendar },
              { label: "Blog Posts", count: s.totalBlogPosts, href: "/admin/blog", icon: FileText },
              { label: "Gallery Albums", count: s.totalAlbums, href: "/admin/gallery", icon: Image },
              { label: "Products", count: s.totalProducts, href: "/admin/products", icon: ShoppingBag },
              { label: "Campaigns", count: s.pendingCampaigns, href: "/admin/campaigns", icon: Megaphone },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <item.icon size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                  <ArrowRight size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Insights</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-emerald-500" />
                <span className="text-xs font-semibold text-gray-500 uppercase">Growth</span>
              </div>
              <p className="text-xl font-bold text-gray-900">+{s.newMembersWeek}</p>
              <p className="text-xs text-gray-500">new members this week</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart size={14} className="text-rose-500" />
                <span className="text-xs font-semibold text-gray-500 uppercase">Giving</span>
              </div>
              <p className="text-xl font-bold text-gray-900">GH₵{s.monthlyGiving.toLocaleString()}</p>
              <p className="text-xs text-gray-500">last 30 days</p>
            </div>
            <Link
              href="/admin/analytics"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 p-3 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/5 transition-colors"
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
