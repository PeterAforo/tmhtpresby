"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Pin, User, Loader2, Send } from "lucide-react";
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

interface Reply {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
}

const categoryBadges: Record<string, string> = {
  general: "bg-gray-100 text-gray-600",
  prayer: "bg-emerald-100 text-emerald-700",
  testimony: "bg-amber-100 text-amber-700",
  question: "bg-blue-100 text-blue-700",
  announcement: "bg-[var(--accent)]/10 text-[var(--accent)]",
};

const roleBadges: Record<string, string> = {
  super_admin: "bg-red-100 text-red-700",
  pastor: "bg-[var(--accent)]/10 text-[var(--accent)]",
  ministry_leader: "bg-purple-100 text-purple-700",
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

export default function DiscussionThreadPage() {
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [sending, setSending] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [postsRes, repliesRes] = await Promise.all([
        fetch(`/api/community`),
        fetch(`/api/community/${id}/replies`),
      ]);
      const postsData = await postsRes.json();
      const repliesData = await repliesRes.json();

      const found = (postsData.posts || []).find((p: Post) => p.id === id);
      setPost(found || null);
      setReplies(repliesData.replies || []);
    } catch {
      console.error("Failed to fetch thread");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyContent.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/community/${id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent }),
      });
      if (res.ok) {
        setReplyContent("");
        fetchData();
      }
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-[var(--text-muted)]">Discussion not found.</p>
        <Link href="/community" className="text-sm text-[var(--accent)] hover:underline">
          ← Back to Community
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back link */}
        <Link href="/community" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Community
        </Link>

        {/* Original post */}
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-6 mb-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {post.isPinned && <Pin size={12} className="text-[var(--accent)]" />}
            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize", categoryBadges[post.category] || "bg-gray-100 text-gray-600")}>
              {post.category}
            </span>
          </div>

          <h1 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold text-[var(--text)] mb-4">
            {post.title}
          </h1>

          <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-line mb-6">
            {post.content}
          </p>

          <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
              {post.author.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.author.image} alt="" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <User size={14} className="text-[var(--accent)]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--text)]">
                  {post.author.firstName} {post.author.lastName}
                </span>
                {roleBadges[post.author.role] && (
                  <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-semibold", roleBadges[post.author.role])}>
                    {post.author.role === "pastor" ? "Pastor" : post.author.role === "super_admin" ? "Admin" : "Leader"}
                  </span>
                )}
              </div>
              <span className="text-xs text-[var(--text-muted)]">{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Replies */}
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-4">
            <MessageSquare size={16} className="text-[var(--accent)]" />
            {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
          </h2>

          {replies.length > 0 ? (
            <div className="space-y-4">
              {replies.map((reply) => (
                <div key={reply.id} className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-5">
                  <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-line mb-3">
                    {reply.content}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                      {reply.author.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={reply.author.image} alt="" className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <User size={11} className="text-[var(--accent)]" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-[var(--text)]">
                      {reply.author.firstName} {reply.author.lastName}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">{formatDate(reply.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)] py-6 text-center">No replies yet. Be the first to respond!</p>
          )}
        </div>

        {/* Reply form */}
        <form onSubmit={handleReply} className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-4">
          <textarea
            rows={3}
            required
            placeholder="Write a reply…"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 mb-3"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending || !replyContent.trim()}
              className="flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
