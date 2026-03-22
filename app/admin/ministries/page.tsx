"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Users,
  Calendar,
  Camera,
  Settings,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Ministry {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  _count: {
    positions: number;
  };
}

export default function AdminMinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMinistries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ministries");
      if (res.ok) {
        const data = await res.json();
        setMinistries(data.ministries || []);
      }
    } catch (err) {
      console.error("Failed to fetch ministries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMinistries();
  }, [fetchMinistries]);

  const toggleActive = async (ministry: Ministry) => {
    try {
      await fetch("/api/admin/ministries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ministry.id, isActive: !ministry.isActive }),
      });
      fetchMinistries();
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Ministry Management</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Manage ministry groups, executives, events, and galleries
          </p>
        </div>
        <Link
          href="/admin/ministries/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Add Ministry
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
        </div>
      ) : ministries.length === 0 ? (
        <div className="text-center py-16 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
          <Users size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
          <p className="text-[var(--text-muted)]">No ministries found.</p>
          <Link
            href="/admin/ministries/new"
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            <Plus size={14} />
            Create your first ministry
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {ministries.map((ministry) => (
            <div
              key={ministry.id}
              className={cn(
                "p-5 rounded-xl bg-[var(--bg-card)] border transition-colors",
                ministry.isActive
                  ? "border-[var(--border)]"
                  : "border-amber-500/30 bg-amber-500/5"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-[var(--text)]">
                      {ministry.name}
                    </h3>
                    {!ministry.isActive && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-600">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-muted)] mb-3">
                    {ministry.description || "No description"}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {ministry._count.positions} positions
                    </span>
                    <span className="capitalize">{ministry.type}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(ministry)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      ministry.isActive
                        ? "text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-amber-600"
                        : "text-amber-600 hover:bg-amber-500/10"
                    )}
                    title={ministry.isActive ? "Deactivate" : "Activate"}
                  >
                    {ministry.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <Link
                    href={`/admin/ministries/${ministry.slug}`}
                    className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--accent)] transition-colors"
                    title="Manage"
                  >
                    <Settings size={16} />
                  </Link>
                </div>
              </div>

              {/* Quick actions */}
              <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-wrap gap-3">
                <Link
                  href={`/admin/ministries/${ministry.slug}/executives`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  <Users size={12} />
                  Manage Executives
                  <ChevronRight size={12} />
                </Link>
                <Link
                  href={`/admin/ministries/${ministry.slug}/events`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  <Calendar size={12} />
                  Manage Events
                  <ChevronRight size={12} />
                </Link>
                <Link
                  href={`/admin/ministries/${ministry.slug}/gallery`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  <Camera size={12} />
                  Manage Gallery
                  <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
