"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, MessageSquare, Pin, X, Save, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Author {
  id: string;
  firstName: string;
  lastName: string;
  image: string | null;
  role: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  author: Author;
  _count: { replies: number };
  createdAt: string;
}

const categories = [
  { value: "all", label: "All Topics" },
  { value: "general", label: "General" },
  { value: "prayer", label: "Prayer" },
  { value: "testimony", label: "Testimony" },
  { value: "question", label: "Questions" },
  { value: "announcement", label: "Announcements" },
];

const categoryBadges: Record<string, string> = {
  general: "bg-gray-100 text-gray-600",
  prayer: "bg-emerald-100 text-emerald-700",
  testimony: "bg-amber-100 text-amber-700",
  question: "bg-blue-100 text-blue-700",
  announcement: "bg-[var(--accent)]/10 text-[var(--accent)]",
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

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category: "general" });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/community?category=${filter}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      console.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ title: "", content: "", category: "general" });
        fetchPosts();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[var(--primary)]/10 to-transparent py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-1">Community</p>
              <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[var(--text)]">
                Discussion Board
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">Share, ask, encourage, and grow together.</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus size={16} /> New Post
            </button>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-colors",
                  filter === cat.value
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--accent)]/40"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* New post modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--text)]">New Discussion</h2>
              <button onClick={() => setShowForm(false)} className="text-[var(--text-muted)] hover:text-[var(--text)]"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                placeholder="Discussion title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
              >
                {categories.filter((c) => c.value !== "all").map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <textarea
                required
                rows={5}
                placeholder="What's on your mind?"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
              />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)]">Cancel</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts list */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-[var(--accent)]" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-muted)]">
            No discussions yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-3 -mt-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="block rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-5 hover:border-[var(--accent)]/40 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                    {post.author.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.author.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <User size={18} className="text-[var(--accent)]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {post.isPinned && <Pin size={12} className="text-[var(--accent)]" />}
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize", categoryBadges[post.category] || "bg-gray-100 text-gray-600")}>
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-[var(--text)] mb-1">{post.title}</h3>
                    <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-2">{post.content}</p>
                    <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                      <span>{post.author.firstName} {post.author.lastName}</span>
                      <span>{timeAgo(post.createdAt)}</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={11} /> {post._count.replies} {post._count.replies === 1 ? "reply" : "replies"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
