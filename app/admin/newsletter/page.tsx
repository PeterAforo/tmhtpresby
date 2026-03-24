"use client";

import { useState, useEffect, useCallback } from "react";
import { Mail, Trash2, Loader2, Download, CheckCircle, XCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Subscriber {
  id: string;
  email: string;
  confirmedAt: string | null;
  unsubscribed: boolean;
  createdAt: string;
}

export default function NewsletterAdminPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "confirmed" | "unconfirmed" | "unsubscribed">("all");

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/newsletter");
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.subscribers || []);
      }
    } catch (err) {
      console.error("Failed to fetch subscribers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    try {
      await fetch(`/api/admin/newsletter?id=${id}`, { method: "DELETE" });
      fetchSubscribers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const exportCSV = () => {
    const activeSubscribers = subscribers.filter(s => s.confirmedAt && !s.unsubscribed);
    const csv = "Email,Subscribed Date\n" + activeSubscribers.map(s => 
      `${s.email},${new Date(s.createdAt).toISOString().split("T")[0]}`
    ).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredSubscribers = subscribers.filter((s) => {
    if (filter === "confirmed") return s.confirmedAt && !s.unsubscribed;
    if (filter === "unconfirmed") return !s.confirmedAt && !s.unsubscribed;
    if (filter === "unsubscribed") return s.unsubscribed;
    return true;
  });

  const stats = {
    total: subscribers.length,
    confirmed: subscribers.filter(s => s.confirmedAt && !s.unsubscribed).length,
    unconfirmed: subscribers.filter(s => !s.confirmedAt && !s.unsubscribed).length,
    unsubscribed: subscribers.filter(s => s.unsubscribed).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail size={24} className="text-[var(--accent)]" />
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your email newsletter list
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Users size={16} />
            <span className="text-xs font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <CheckCircle size={16} />
            <span className="text-xs font-medium">Confirmed</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <Mail size={16} />
            <span className="text-xs font-medium">Pending</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{stats.unconfirmed}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <XCircle size={16} />
            <span className="text-xs font-medium">Unsubscribed</span>
          </div>
          <p className="text-2xl font-bold text-gray-400">{stats.unsubscribed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(["all", "confirmed", "unconfirmed", "unsubscribed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              filter === f
                ? "bg-[var(--accent)] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Subscribers List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="p-12 text-center">
            <Mail size={32} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">No subscribers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscribed</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{subscriber.email}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        subscriber.unsubscribed
                          ? "bg-gray-100 text-gray-600"
                          : subscriber.confirmedAt
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      )}>
                        {subscriber.unsubscribed ? "Unsubscribed" : subscriber.confirmedAt ? "Confirmed" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(subscriber.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(subscriber.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
