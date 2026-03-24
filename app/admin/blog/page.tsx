"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/admin/RichTextEditor";
import FileUpload from "@/components/admin/FileUpload";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  author: string;
  category: string;
  readTime: number | null;
  published: boolean;
  viewCount: number;
  publishedAt: string;
}

const blogCategories = ["general", "devotional", "bible-study", "family", "outreach", "worship", "culture"];

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  author: "",
  category: "general",
  readTime: "",
  published: true,
  publishedAt: new Date().toISOString().split("T")[0],
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      console.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  function openNew() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(post: BlogPost) {
    setForm({
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content,
      author: post.author,
      category: post.category,
      readTime: post.readTime?.toString() || "",
      published: post.published,
      publishedAt: post.publishedAt.split("T")[0],
    });
    setEditingId(post.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = { ...form, ...(editingId && { id: editingId }) };
      const res = await fetch("/api/admin/blog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowForm(false);
        fetchPosts();
      }
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(post: BlogPost) {
    await fetch("/api/admin/blog", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: post.id, published: !post.published }),
    });
    fetchPosts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
    fetchPosts();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)]">Blog Posts</h1>
          <p className="text-sm text-[var(--text-muted)]">Manage articles and devotionals</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus size={16} /> New Post
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--text)]">{editingId ? "Edit Post" : "New Post"}</h2>
              <button onClick={() => setShowForm(false)} className="text-[var(--text-muted)] hover:text-[var(--text)]"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Post title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />

              <input placeholder="Author name" required value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />

              <RichTextEditor
                value={form.excerpt}
                onChange={(value) => setForm({ ...form, excerpt: value })}
                placeholder="Short excerpt (optional)"
              />

              <RichTextEditor
                value={form.content}
                onChange={(value) => setForm({ ...form, content: value })}
                placeholder="Post content..."
              />

              <div className="grid grid-cols-3 gap-4">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30">
                  {blogCategories.map((c) => <option key={c} value={c}>{c.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>)}
                </select>
                <div>
                  <label className="text-xs text-[var(--text-muted)] mb-1 block">Read time (min)</label>
                  <input type="number" value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)] mb-1 block">Publish date</label>
                  <input type="date" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-[var(--text)]">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" />
                Published
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--border)]/50">Cancel</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts table */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-[var(--accent)]" /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-muted)]">No posts yet. Write your first blog post!</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-card)] border-b border-[var(--border)]">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text)]">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text)]">Author</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text)]">Category</th>
                <th className="text-center px-4 py-3 font-semibold text-[var(--text)]">Views</th>
                <th className="text-center px-4 py-3 font-semibold text-[var(--text)]">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-[var(--text)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-[var(--bg-card)]/50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-[var(--text)]">{post.title}</span>
                    <p className="text-xs text-[var(--text-muted)]">{new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{post.author.split(" ").slice(-1)[0]}</td>
                  <td className="px-4 py-3 capitalize text-[var(--text-muted)]">{post.category.replace("-", " ")}</td>
                  <td className="px-4 py-3 text-center text-[var(--text-muted)]">{post.viewCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", post.published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500")}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => togglePublished(post)} className="p-1.5 rounded-lg hover:bg-[var(--border)]/50 text-[var(--text-muted)]" title={post.published ? "Unpublish" : "Publish"}>
                        {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => openEdit(post)} className="p-1.5 rounded-lg hover:bg-[var(--border)]/50 text-[var(--text-muted)]" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
