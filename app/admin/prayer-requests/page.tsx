"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, Trash2, Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrayerRequest {
  id: string;
  name: string;
  email: string | null;
  request: string;
  isPrivate: boolean;
  createdAt: string;
}

export default function PrayerRequestsAdminPage() {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "public" | "private">("all");

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/prayer-requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Failed to fetch prayer requests:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this prayer request?")) return;
    try {
      await fetch(`/api/admin/prayer-requests?id=${id}`, { method: "DELETE" });
      fetchRequests();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const togglePrivacy = async (request: PrayerRequest) => {
    try {
      await fetch("/api/admin/prayer-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: request.id, isPrivate: !request.isPrivate }),
      });
      fetchRequests();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === "public") return !r.isPrivate;
    if (filter === "private") return r.isPrivate;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart size={24} className="text-[var(--accent)]" />
            Prayer Requests
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {requests.length} total requests
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["all", "public", "private"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
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
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center">
            <Heart size={32} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">No prayer requests found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">{request.name}</span>
                      {request.email && (
                        <a
                          href={`mailto:${request.email}`}
                          className="text-xs text-[var(--accent)] flex items-center gap-1 hover:underline"
                        >
                          <Mail size={12} /> {request.email}
                        </a>
                      )}
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        request.isPrivate
                          ? "bg-gray-100 text-gray-600"
                          : "bg-green-100 text-green-700"
                      )}>
                        {request.isPrivate ? "Private" : "Public"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{request.request}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(request.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePrivacy(request)}
                      className="p-2 text-gray-400 hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-lg transition-colors"
                      title={request.isPrivate ? "Make Public" : "Make Private"}
                    >
                      {request.isPrivate ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => handleDelete(request.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
