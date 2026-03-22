"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverUrl: string | null;
  published: boolean;
  _count: { images: number };
}

const emptyForm = {
  title: "",
  description: "",
  coverUrl: "",
  published: true,
};

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      setAlbums(data.albums || []);
    } catch {
      console.error("Failed to fetch albums");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAlbums(); }, [fetchAlbums]);

  function openNew() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(album: GalleryAlbum) {
    setForm({
      title: album.title,
      description: album.description || "",
      coverUrl: album.coverUrl || "",
      published: album.published,
    });
    setEditingId(album.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = { ...form, ...(editingId && { id: editingId }) };
      const res = await fetch("/api/admin/gallery", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowForm(false);
        fetchAlbums();
      }
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(album: GalleryAlbum) {
    await fetch("/api/admin/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: album.id, published: !album.published }),
    });
    fetchAlbums();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this album and all its images? This cannot be undone.")) return;
    await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    fetchAlbums();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)]">Gallery</h1>
          <p className="text-sm text-[var(--text-muted)]">Manage photo albums</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus size={16} /> New Album
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--text)]">{editingId ? "Edit Album" : "New Album"}</h2>
              <button onClick={() => setShowForm(false)} className="text-[var(--text-muted)] hover:text-[var(--text)]"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Album title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />

              <textarea rows={3} placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />

              <input placeholder="Cover image URL (optional)" value={form.coverUrl} onChange={(e) => setForm({ ...form, coverUrl: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />

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

      {/* Albums grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-[var(--accent)]" /></div>
      ) : albums.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-muted)]">No albums yet. Create your first album!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {albums.map((album) => (
            <div key={album.id} className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden">
              <div className="aspect-[16/10] bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 flex items-center justify-center">
                <ImageIcon size={32} className="text-[var(--text-muted)] opacity-30" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-[var(--text)]">{album.title}</h3>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", album.published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400")}>
                    {album.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-3">{album._count.images} photo{album._count.images !== 1 ? "s" : ""}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => togglePublished(album)} className="p-1.5 rounded-lg hover:bg-[var(--border)]/50 text-[var(--text-muted)]" title={album.published ? "Unpublish" : "Publish"}>
                    {album.published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => openEdit(album)} className="p-1.5 rounded-lg hover:bg-[var(--border)]/50 text-[var(--text-muted)]" title="Edit">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(album.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
