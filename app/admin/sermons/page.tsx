"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface Speaker {
  id: string;
  name: string;
}
interface Series {
  id: string;
  title: string;
  slug: string;
}
interface Sermon {
  id: string;
  title: string;
  slug: string;
  scripture: string | null;
  description: string | null;
  content: string | null;
  date: string;
  duration: number | null;
  mediaType: string;
  videoUrl: string | null;
  audioUrl: string | null;
  youtubeId: string | null;
  documentUrl: string | null;
  published: boolean;
  viewCount: number;
  speakerId: string;
  seriesId: string | null;
  speaker: Speaker;
  series: Series | null;
}

const emptyForm = {
  title: "",
  scripture: "",
  description: "",
  content: "",
  date: new Date().toISOString().split("T")[0],
  duration: "",
  mediaType: "video",
  videoUrl: "",
  audioUrl: "",
  youtubeId: "",
  documentUrl: "",
  speakerId: "",
  seriesId: "",
  published: true,
};

export default function AdminSermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [allSeries, setAllSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sermonsRes, speakersRes, seriesRes] = await Promise.all([
        fetch("/api/admin/sermons"),
        fetch("/api/sermons?limit=0").then(() =>
          fetch("/api/admin/sermons")
        ),
        Promise.resolve(),
      ]);

      const sermonsData = await sermonsRes.json();
      setSermons(sermonsData.sermons || []);

      // Fetch speakers and series directly
      const metaRes = await fetch("/api/admin/sermons/meta");
      if (metaRes.ok) {
        const meta = await metaRes.json();
        setSpeakers(meta.speakers || []);
        setAllSeries(meta.series || []);
      }
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...form } : form;

      const res = await fetch("/api/admin/sermons", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        fetchData();
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (sermon: Sermon) => {
    setEditingId(sermon.id);
    setForm({
      title: sermon.title,
      scripture: sermon.scripture || "",
      description: sermon.description || "",
      content: sermon.content || "",
      date: sermon.date.split("T")[0],
      duration: sermon.duration?.toString() || "",
      mediaType: sermon.mediaType || "video",
      videoUrl: sermon.videoUrl || "",
      audioUrl: sermon.audioUrl || "",
      youtubeId: sermon.youtubeId || "",
      documentUrl: sermon.documentUrl || "",
      speakerId: sermon.speakerId,
      seriesId: sermon.seriesId || "",
      published: sermon.published,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    try {
      await fetch(`/api/admin/sermons?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const togglePublished = async (sermon: Sermon) => {
    await fetch("/api/admin/sermons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: sermon.id, published: !sermon.published }),
    });
    fetchData();
  };

  const inputClasses = cn(
    "w-full px-3 py-2.5 rounded-lg text-sm",
    "bg-[var(--bg)] text-[var(--text)] border border-[var(--border)]",
    "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)]">
            Sermon Manager
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {sermons.length} sermon{sermons.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Add Sermon
        </button>
      </div>

      {/* ── Form Modal ────────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--text)]">
                {editingId ? "Edit Sermon" : "New Sermon"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-[var(--text-muted)] hover:text-[var(--text)]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className={inputClasses} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">Date *</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className={inputClasses} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">Duration (seconds)</label>
                  <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 2520" className={inputClasses} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">Speaker *</label>
                  <select value={form.speakerId} onChange={(e) => setForm({ ...form, speakerId: e.target.value })} required className={inputClasses}>
                    <option value="">Select speaker</option>
                    {speakers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">Series</label>
                  <select value={form.seriesId} onChange={(e) => setForm({ ...form, seriesId: e.target.value })} className={inputClasses}>
                    <option value="">No series</option>
                    {allSeries.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Scripture</label>
                <input value={form.scripture} onChange={(e) => setForm({ ...form, scripture: e.target.value })} placeholder="e.g. John 3:16-18" className={inputClasses} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Description</label>
                <RichTextEditor
                  value={form.description}
                  onChange={(value) => setForm({ ...form, description: value })}
                  placeholder="Sermon description..."
                />
              </div>

              {/* Media Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Media Type *</label>
                <div className="flex gap-3">
                  {[
                    { value: "video", label: "Video", desc: "YouTube or video file" },
                    { value: "audio", label: "Audio", desc: "Audio recording" },
                    { value: "text", label: "Written", desc: "Text/transcript only" },
                  ].map((type) => (
                    <label
                      key={type.value}
                      className={cn(
                        "flex-1 p-3 rounded-lg border cursor-pointer transition-all",
                        form.mediaType === type.value
                          ? "border-[var(--accent)] bg-[var(--accent)]/5"
                          : "border-[var(--border)] hover:border-[var(--accent)]/40"
                      )}
                    >
                      <input
                        type="radio"
                        name="mediaType"
                        value={type.value}
                        checked={form.mediaType === type.value}
                        onChange={(e) => setForm({ ...form, mediaType: e.target.value })}
                        className="sr-only"
                      />
                      <span className="block text-sm font-semibold text-[var(--text)]">{type.label}</span>
                      <span className="block text-xs text-[var(--text-muted)]">{type.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Video/Audio URLs - shown for video and audio types */}
              {(form.mediaType === "video" || form.mediaType === "audio") && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text)] mb-1">YouTube ID</label>
                    <input value={form.youtubeId} onChange={(e) => setForm({ ...form, youtubeId: e.target.value })} placeholder="dQw4w9WgXcQ" className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text)] mb-1">Video URL</label>
                    <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text)] mb-1">Audio URL</label>
                    <input value={form.audioUrl} onChange={(e) => setForm({ ...form, audioUrl: e.target.value })} className={inputClasses} />
                  </div>
                </div>
              )}

              {/* Document URL - for downloadable PDF */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Document URL (PDF)</label>
                <input value={form.documentUrl} onChange={(e) => setForm({ ...form, documentUrl: e.target.value })} placeholder="https://..." className={inputClasses} />
              </div>

              {/* Full sermon content/transcript */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                  {form.mediaType === "text" ? "Sermon Content *" : "Sermon Transcript (optional)"}
                </label>
                <RichTextEditor
                  value={form.content}
                  onChange={(value) => setForm({ ...form, content: value })}
                  placeholder="Enter the full sermon text or transcript here..."
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-[var(--text)]">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                Published
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingId ? "Update" : "Create"} Sermon
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Sermon table ──────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg-card)] border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 font-semibold text-[var(--text)]">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text)] hidden md:table-cell">Speaker</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text)] hidden lg:table-cell">Series</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text)] hidden sm:table-cell">Date</th>
                <th className="text-center px-4 py-3 font-semibold text-[var(--text)]">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-[var(--text)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sermons.map((sermon) => (
                <tr key={sermon.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-card)]/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--text)] line-clamp-1">{sermon.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{sermon.scripture}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)] hidden md:table-cell">
                    {sermon.speaker.name.split(" ").slice(-1)[0]}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)] hidden lg:table-cell">
                    {sermon.series?.title || "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)] hidden sm:table-cell">
                    {new Date(sermon.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => togglePublished(sermon)}
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
                        sermon.published
                          ? "bg-green-500/10 text-green-600"
                          : "bg-gray-500/10 text-gray-500 dark:text-gray-400"
                      )}
                    >
                      {sermon.published ? <Eye size={12} /> : <EyeOff size={12} />}
                      {sermon.published ? "Live" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(sermon)}
                        className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(sermon.id, sermon.title)}
                        className="p-1.5 rounded text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
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
