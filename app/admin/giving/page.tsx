"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DonationRow {
  id: string;
  amount: number;
  currency: string;
  fund: string;
  frequency: string;
  status: string;
  createdAt: string;
  donor: { firstName: string | null; lastName: string | null; email: string } | null;
  guestEmail: string | null;
  guestFirstName: string | null;
}

interface Stats {
  totalRevenue: number;
  totalDonations: number;
  uniqueDonors: number;
  monthlyRecurring: number;
  byFund: Record<string, number>;
  recentDonations: DonationRow[];
}

const FUND_LABELS: Record<string, string> = {
  general: "General Fund",
  building: "Building Fund",
  missions: "Missions",
  benevolence: "Benevolence",
  youth: "Youth Ministry",
  media: "Media Ministry",
};

function fromPesewas(pesewas: number): string {
  return (pesewas / 100).toFixed(2);
}

export default function AdminGivingPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/giving");
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-24 text-[var(--text-muted)]">
        Failed to load financial data.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)]">
            Financial Dashboard
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Donation overview and analytics
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] transition-colors"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`GHS ${fromPesewas(stats.totalRevenue)}`}
          color="text-green-500 bg-green-500/10"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Donations"
          value={stats.totalDonations.toString()}
          color="text-[var(--accent)] bg-[var(--accent)]/10"
        />
        <StatCard
          icon={Users}
          label="Unique Donors"
          value={stats.uniqueDonors.toString()}
          color="text-blue-500 bg-blue-500/10"
        />
        <StatCard
          icon={RefreshCw}
          label="Monthly Recurring"
          value={stats.monthlyRecurring.toString()}
          color="text-purple-500 bg-purple-500/10"
        />
      </div>

      {/* Fund breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
          <h2 className="text-sm font-semibold text-[var(--text)] mb-4">
            Revenue by Fund
          </h2>
          <div className="space-y-3">
            {Object.entries(stats.byFund).map(([fund, amount]) => {
              const pct =
                stats.totalRevenue > 0
                  ? (amount / stats.totalRevenue) * 100
                  : 0;
              return (
                <div key={fund}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-[var(--text)]">
                      {FUND_LABELS[fund] || fund}
                    </span>
                    <span className="font-semibold text-[var(--text)]">
                      GHS {fromPesewas(amount)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent donations */}
        <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
          <h2 className="text-sm font-semibold text-[var(--text)] mb-4">
            Recent Donations
          </h2>
          <div className="space-y-3">
            {stats.recentDonations.slice(0, 8).map((d) => {
              const name =
                d.donor?.firstName ||
                d.guestFirstName ||
                d.donor?.email ||
                d.guestEmail ||
                "Anonymous";
              return (
                <div
                  key={d.id}
                  className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">
                      {name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {FUND_LABELS[d.fund] || d.fund}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--text)]">
                      GHS {fromPesewas(d.amount)}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {new Date(d.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            {stats.recentDonations.length === 0 && (
              <p className="text-sm text-[var(--text-muted)] text-center py-4">
                No donations yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", color)}>
        <Icon size={20} />
      </div>
      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className="text-xl font-bold text-[var(--text)]">{value}</p>
    </div>
  );
}
