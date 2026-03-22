"use client";

import { useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Search, Receipt, Calendar, Loader2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Donation {
  id: string;
  amount: number;
  currency: string;
  fund: string;
  frequency: string;
  status: string;
  createdAt: string;
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

export default function DonorPortalPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [totalGiven, setTotalGiven] = useState(0);
  const [donorName, setDonorName] = useState("");
  const [error, setError] = useState("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/giving/history?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setDonations(data.donations || []);
      setTotalGiven(data.totalGiven || 0);
      setDonorName(
        data.donor
          ? `${data.donor.firstName || ""} ${data.donor.lastName || ""}`.trim()
          : ""
      );
      setSearched(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero
        overline="Your Giving"
        title="Donor Portal"
        subtitle="View your donation history and download receipts."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Email lookup */}
          <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] mb-8">
            <h2 className="text-lg font-semibold text-[var(--text)] mb-4">
              Look Up Your Donations
            </h2>
            <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={cn(
                    "w-full pl-9 pr-4 py-3 rounded-lg text-sm",
                    "bg-[var(--bg)] text-[var(--text)] border border-[var(--border)]",
                    "placeholder:text-[var(--text-muted)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                  )}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-lg text-sm font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity disabled:opacity-60 shrink-0"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Look Up"
                )}
              </button>
            </form>
            {error && (
              <p className="text-sm text-red-500 mt-3">{error}</p>
            )}
          </div>

          {/* Results */}
          {searched && (
            <>
              {/* Summary */}
              {donations.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-center">
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      Total Given
                    </p>
                    <p className="text-2xl font-bold text-[var(--accent)]">
                      GHS {fromPesewas(totalGiven)}
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-center">
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      Donations
                    </p>
                    <p className="text-2xl font-bold text-[var(--text)]">
                      {donations.length}
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-center">
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      Donor
                    </p>
                    <p className="text-lg font-semibold text-[var(--text)]">
                      {donorName || "Anonymous"}
                    </p>
                  </div>
                </div>
              )}

              {/* Donation list */}
              {donations.length > 0 ? (
                <div className="space-y-3">
                  {donations.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                          <Heart size={18} className="text-[var(--accent)]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--text)]">
                            {d.currency} {fromPesewas(d.amount)}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {FUND_LABELS[d.fund] || d.fund} &middot;{" "}
                            {d.frequency === "monthly" ? "Monthly" : "One-time"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(d.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Receipt size={32} className="mx-auto text-[var(--text-muted)] mb-3" />
                  <p className="text-[var(--text-muted)]">
                    No donations found for this email address.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
