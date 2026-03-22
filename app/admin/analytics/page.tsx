import { prisma } from "@/lib/db";
import { BarChart3, Users, Eye, BookOpen, Heart, MessageSquare, Calendar, TrendingUp } from "lucide-react";

async function getStats() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    newUsersMonth,
    totalPageViews,
    pageViewsWeek,
    totalSermons,
    totalDonations,
    donationSum,
    totalEvents,
    totalPosts,
    totalBlogPosts,
    topPages,
    usersByRole,
    usersByGroup,
    recentDonations,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.pageView.count(),
    prisma.pageView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.sermon.count(),
    prisma.donation.count({ where: { status: "completed" } }),
    prisma.donation.aggregate({ where: { status: "completed" }, _sum: { amount: true } }),
    prisma.event.count({ where: { published: true } }),
    prisma.discussionPost.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.$queryRaw<{ path: string; count: bigint }[]>`
      SELECT path, COUNT(*)::bigint as count FROM page_views
      WHERE "createdAt" >= ${sevenDaysAgo}
      GROUP BY path ORDER BY count DESC LIMIT 10
    `.catch(() => []),
    prisma.user.groupBy({ by: ["role"], _count: true, orderBy: { _count: { role: "desc" } } }),
    prisma.user.groupBy({ by: ["ministryGroup"], _count: true, orderBy: { _count: { ministryGroup: "desc" } } }),
    prisma.donation.findMany({
      where: { status: "completed" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { amount: true, fund: true, createdAt: true, guestFirstName: true, guestLastName: true },
    }),
  ]);

  return {
    totalUsers,
    newUsersMonth,
    totalPageViews,
    pageViewsWeek,
    totalSermons,
    totalDonations,
    donationTotal: (donationSum._sum.amount || 0) / 100,
    totalEvents,
    totalPosts,
    totalBlogPosts,
    topPages,
    usersByRole,
    usersByGroup,
    recentDonations,
  };
}

const roleLabels: Record<string, string> = {
  super_admin: "Admins",
  pastor: "Pastors",
  ministry_leader: "Leaders",
  member: "Members",
  visitor: "Visitors",
};

const groupLabels: Record<string, string> = {
  children: "Children",
  youth: "Youth",
  young_adult: "Young Adults",
  adult: "Adults",
  senior: "Seniors",
};

export default async function AnalyticsDashboard() {
  const stats = await getStats();

  const statCards = [
    { label: "Total Members", value: stats.totalUsers, sub: `+${stats.newUsersMonth} this month`, icon: Users, color: "text-blue-500" },
    { label: "Page Views (7d)", value: stats.pageViewsWeek.toLocaleString(), sub: `${stats.totalPageViews.toLocaleString()} total`, icon: Eye, color: "text-emerald-500" },
    { label: "Total Donations", value: `GH₵${stats.donationTotal.toLocaleString()}`, sub: `${stats.totalDonations} transactions`, icon: Heart, color: "text-rose-500" },
    { label: "Sermons", value: stats.totalSermons, sub: "published", icon: BookOpen, color: "text-purple-500" },
    { label: "Events", value: stats.totalEvents, sub: "active", icon: Calendar, color: "text-amber-500" },
    { label: "Discussion Posts", value: stats.totalPosts, sub: `${stats.totalBlogPosts} blog posts`, icon: MessageSquare, color: "text-cyan-500" },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 size={24} className="text-[var(--accent)]" />
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)]">
          Analytics Dashboard
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{stat.label}</span>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className="text-2xl font-bold text-[var(--text)]">{stat.value}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top pages */}
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-6">
          <h2 className="flex items-center gap-2 font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text)] mb-4">
            <TrendingUp size={18} className="text-[var(--accent)]" />
            Top Pages (7 days)
          </h2>
          {stats.topPages.length > 0 ? (
            <div className="space-y-2">
              {stats.topPages.map((page, i) => (
                <div key={page.path} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[var(--text-muted)] w-5">{i + 1}</span>
                    <span className="text-sm text-[var(--text)] font-mono truncate max-w-[200px]">{page.path}</span>
                  </div>
                  <span className="text-sm font-semibold text-[var(--accent)]">{Number(page.count).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">No page view data yet.</p>
          )}
        </div>

        {/* Members breakdown */}
        <div className="space-y-6">
          <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-6">
            <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text)] mb-4">
              Members by Role
            </h2>
            <div className="space-y-2">
              {stats.usersByRole.map((entry) => (
                <div key={entry.role} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-[var(--text)]">{roleLabels[entry.role] || entry.role}</span>
                  <span className="text-sm font-semibold text-[var(--accent)]">{entry._count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-6">
            <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text)] mb-4">
              Members by Ministry Group
            </h2>
            <div className="space-y-2">
              {stats.usersByGroup.map((entry) => (
                <div key={entry.ministryGroup || "none"} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-[var(--text)]">
                    {entry.ministryGroup ? (groupLabels[entry.ministryGroup] || entry.ministryGroup) : "Unassigned"}
                  </span>
                  <span className="text-sm font-semibold text-[var(--accent)]">{entry._count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent donations */}
      <div className="mt-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-6">
        <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text)] mb-4">
          Recent Donations
        </h2>
        {stats.recentDonations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 text-[var(--text-muted)] font-medium">Donor</th>
                  <th className="text-left py-2 text-[var(--text-muted)] font-medium">Fund</th>
                  <th className="text-right py-2 text-[var(--text-muted)] font-medium">Amount</th>
                  <th className="text-right py-2 text-[var(--text-muted)] font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentDonations.map((d, i) => (
                  <tr key={i} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-2.5 text-[var(--text)]">
                      {d.guestFirstName && d.guestLastName
                        ? `${d.guestFirstName} ${d.guestLastName}`
                        : "Anonymous"}
                    </td>
                    <td className="py-2.5 text-[var(--text)] capitalize">{d.fund}</td>
                    <td className="py-2.5 text-right font-semibold text-[var(--accent)]">
                      GH₵{(d.amount / 100).toFixed(2)}
                    </td>
                    <td className="py-2.5 text-right text-[var(--text-muted)]">
                      {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(d.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">No donations recorded yet.</p>
        )}
      </div>
    </div>
  );
}
