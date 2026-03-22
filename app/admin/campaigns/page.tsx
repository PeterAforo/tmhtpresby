"use client";

import { useState, useEffect, useCallback } from "react";
import { Megaphone, Plus, Send, X, Save, Loader2, Mail, MessageSquare, Bell, Users, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Campaign {
  id: string;
  title: string;
  subject: string | null;
  content: string;
  channel: string;
  audience: string;
  status: string;
  scheduledAt: string | null;
  sentAt: string | null;
  sentCount: number;
  createdAt: string;
}

const channelIcons: Record<string, React.ReactNode> = {
  email: <Mail size={14} />,
  sms: <MessageSquare size={14} />,
  push: <Bell size={14} />,
};

const statusBadges: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  scheduled: "bg-blue-100 text-blue-700",
  sent: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
};

export default function CampaignsAdminPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", subject: "", content: "", channel: "email", audience: "all",
  });

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/campaigns");
      const data = await res.json();
      setCampaigns(data.campaigns || []);
    } catch {
      console.error("Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ title: "", subject: "", content: "", channel: "email", audience: "all" });
        fetchCampaigns();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleSend(id: string) {
    if (!confirm("Send this campaign to all targeted users? This cannot be undone.")) return;
    setSending(id);
    try {
      await fetch("/api/admin/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "send" }),
      });
      fetchCampaigns();
    } finally {
      setSending(null);
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)] flex items-center gap-2">
            <Megaphone size={24} className="text-[var(--accent)]" /> Campaign Manager
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Create and send email, SMS, and push announcements.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {/* Create campaign modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--text)]">New Campaign</h2>
              <button onClick={() => setShowForm(false)} className="text-[var(--text-muted)] hover:text-[var(--text)]"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <input required placeholder="Campaign title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
              <input placeholder="Email subject (optional)" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30">
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push Notification</option>
                </select>
                <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30">
                  <option value="all">All Members</option>
                  <option value="members">Registered Members Only</option>
                  <option value="visitors">Visitors Only</option>
                  <option value="youth">Youth Ministry</option>
                  <option value="young_adult">Young Adults</option>
                  <option value="adult">Adult Fellowship</option>
                  <option value="senior">Senior Fellowship</option>
                </select>
              </div>
              <textarea required rows={6} placeholder="Campaign message…" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)]">Cancel</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaign list */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-[var(--accent)]" /></div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-muted)]">
          <Megaphone size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-lg">No campaigns yet</p>
          <p className="text-sm mt-1">Create your first campaign to reach your congregation.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((camp) => (
            <div key={camp.id} className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase", statusBadges[camp.status] || "bg-gray-100 text-gray-600")}>
                      {camp.status}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                      {channelIcons[camp.channel]} {camp.channel}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                      <Users size={11} /> {camp.audience}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text)]">{camp.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] line-clamp-2 mt-1">{camp.content}</p>
                  <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] mt-2">
                    <span className="flex items-center gap-1"><Clock size={11} /> Created {new Date(camp.createdAt).toLocaleDateString()}</span>
                    {camp.sentAt && (
                      <span className="flex items-center gap-1"><CheckCircle2 size={11} /> Sent to {camp.sentCount} recipients</span>
                    )}
                  </div>
                </div>
                {camp.status === "draft" && (
                  <button
                    onClick={() => handleSend(camp.id)}
                    disabled={sending === camp.id}
                    className="shrink-0 flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 ml-4"
                  >
                    {sending === camp.id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    Send
                  </button>
                )}
                {camp.status === "failed" && (
                  <span className="shrink-0 flex items-center gap-1 text-red-500 text-sm ml-4">
                    <AlertCircle size={14} /> Failed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
