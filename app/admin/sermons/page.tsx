"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  Save,
  Loader2,
  Search,
  Filter,
  Play,
  Mic,
  FileText,
  Calendar,
  Clock,
  BarChart3,
  Video,
  Music,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/admin/RichTextEditor";
import FileUpload from "@/components/admin/FileUpload";

interface Speaker {
  id: string;
  name: string;
  imageUrl?: string | null;
}
interface Series {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string | null;
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
  thumbnailUrl: string | null;
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
  thumbnailUrl: "",
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpeaker, setFilterSpeaker] = useState("");
  const [filterSeries, setFilterSeries] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
      thumbnailUrl: sermon.thumbnailUrl || "",
      documentUrl: sermon.documentUrl || "",
      speakerId: sermon.speakerId,
      seriesId: sermon.seriesId || "",
      published: sermon.published,
    });
    setShowForm(true);
  };

  // Filter sermons
  const filteredSermons = sermons.filter((sermon) => {
    const matchesSearch = !searchQuery || 
      sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.scripture?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.speaker.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpeaker = !filterSpeaker || sermon.speakerId === filterSpeaker;
    const matchesSeries = !filterSeries || sermon.seriesId === filterSeries;
    const matchesStatus = !filterStatus || 
      (filterStatus === "published" ? sermon.published : !sermon.published);
    return matchesSearch && matchesSpeaker && matchesSeries && matchesStatus;
  });

  // Stats
  const stats = {
    total: sermons.length,
    published: sermons.filter(s => s.published).length,
    drafts: sermons.filter(s => !s.published).length,
    totalViews: sermons.reduce((acc, s) => acc + s.viewCount, 0),
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "video": return <Video size={14} className="text-blue-500" />;
      case "audio": return <Music size={14} className="text-purple-500" />;
      case "text": return <BookOpen size={14} className="text-amber-500" />;
      default: return <Play size={14} />;
    }
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
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)]">
            Sermon Manager
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Manage your church sermons and messages
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-all shadow-lg shadow-[var(--accent)]/25"
        >
          <Plus size={18} />
          Add New Sermon
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs font-medium">Total Sermons</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Mic size={20} />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs font-medium">Published</p>
              <p className="text-2xl font-bold mt-1">{stats.published}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Eye size={20} />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-xs font-medium">Drafts</p>
              <p className="text-2xl font-bold mt-1">{stats.drafts}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <FileText size={20} />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs font-medium">Total Views</p>
              <p className="text-2xl font-bold mt-1">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <BarChart3 size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search sermons by title, scripture, or speaker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={filterSpeaker}
              onChange={(e) => setFilterSpeaker(e.target.value)}
              className="px-3 py-2.5 rounded-lg text-sm bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            >
              <option value="">All Speakers</option>
              {speakers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <select
              value={filterSeries}
              onChange={(e) => setFilterSeries(e.target.value)}
              className="px-3 py-2.5 rounded-lg text-sm bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            >
              <option value="">All Series</option>
              {allSeries.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2.5 rounded-lg text-sm bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
            <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "px-3 py-2 transition-colors",
                  viewMode === "grid" ? "bg-[var(--accent)] text-white" : "bg-[var(--bg)] text-[var(--text-muted)] hover:bg-[var(--border)]"
                )}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "px-3 py-2 transition-colors",
                  viewMode === "list" ? "bg-[var(--accent)] text-white" : "bg-[var(--bg)] text-[var(--text-muted)] hover:bg-[var(--border)]"
                )}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
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
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Cover Image</label>
                <FileUpload
                  value={form.thumbnailUrl}
                  onChange={(url) => setForm({ ...form, thumbnailUrl: url })}
                  type="image"
                  placeholder="Upload sermon cover image"
                />
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

              {/* Video/Audio - shown for video and audio types */}
              {(form.mediaType === "video" || form.mediaType === "audio") && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text)] mb-1">YouTube ID (optional)</label>
                    <input value={form.youtubeId} onChange={(e) => setForm({ ...form, youtubeId: e.target.value })} placeholder="dQw4w9WgXcQ" className={inputClasses} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text)] mb-1">Upload Video</label>
                      <FileUpload
                        value={form.videoUrl}
                        onChange={(url) => setForm({ ...form, videoUrl: url })}
                        type="video"
                        placeholder="Upload video file"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text)] mb-1">Upload Audio</label>
                      <FileUpload
                        value={form.audioUrl}
                        onChange={(url) => setForm({ ...form, audioUrl: url })}
                        type="audio"
                        placeholder="Upload audio file"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Document Upload - for downloadable PDF */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Sermon Document (PDF)</label>
                <FileUpload
                  value={form.documentUrl}
                  onChange={(url) => setForm({ ...form, documentUrl: url })}
                  type="document"
                  placeholder="Upload PDF document"
                />
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

      {/* ── Sermon Display ──────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
        </div>
      ) : filteredSermons.length === 0 ? (
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-12 text-center">
          <Mic size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
          <h3 className="text-lg font-semibold text-[var(--text)] mb-2">No sermons found</h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            {searchQuery || filterSpeaker || filterSeries || filterStatus
              ? "Try adjusting your search or filters"
              : "Get started by adding your first sermon"}
          </p>
          {!searchQuery && !filterSpeaker && !filterSeries && !filterStatus && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent)] text-white hover:opacity-90"
            >
              <Plus size={16} />
              Add Sermon
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSermons.map((sermon) => (
            <div
              key={sermon.id}
              className="group bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-lg hover:border-[var(--accent)]/30 transition-all"
            >
              {/* Cover Image */}
              <div className="relative aspect-video bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20">
                {sermon.thumbnailUrl ? (
                  <Image
                    src={sermon.thumbnailUrl}
                    alt={sermon.title}
                    fill
                    className="object-cover"
                  />
                ) : sermon.youtubeId ? (
                  <Image
                    src={`https://img.youtube.com/vi/${sermon.youtubeId}/maxresdefault.jpg`}
                    alt={sermon.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {getMediaIcon(sermon.mediaType)}
                    <span className="sr-only">{sermon.mediaType}</span>
                  </div>
                )}
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                    <Play size={20} className="text-[var(--accent)] ml-1" />
                  </div>
                </div>
                {/* Media type badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 text-white text-xs">
                  {getMediaIcon(sermon.mediaType)}
                  <span className="capitalize">{sermon.mediaType}</span>
                </div>
                {/* Status badge */}
                <div className={cn(
                  "absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium",
                  sermon.published ? "bg-green-500 text-white" : "bg-amber-500 text-white"
                )}>
                  {sermon.published ? "Live" : "Draft"}
                </div>
                {/* Duration */}
                {sermon.duration && (
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/60 text-white text-xs">
                    {formatDuration(sermon.duration)}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-[var(--text)] line-clamp-2 mb-1 group-hover:text-[var(--accent)] transition-colors">
                  {sermon.title}
                </h3>
                {sermon.scripture && (
                  <p className="text-xs text-[var(--accent)] mb-2">{sermon.scripture}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-3">
                  <span>{sermon.speaker.name}</span>
                  <span>•</span>
                  <span>{new Date(sermon.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                {sermon.series && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] text-xs mb-3">
                    <BookOpen size={12} />
                    {sermon.series.title}
                  </div>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                  <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                    <Eye size={12} />
                    {sermon.viewCount.toLocaleString()} views
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePublished(sermon)}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        sermon.published
                          ? "text-green-500 hover:bg-green-500/10"
                          : "text-[var(--text-muted)] hover:bg-[var(--border)]"
                      )}
                      title={sermon.published ? "Unpublish" : "Publish"}
                    >
                      {sermon.published ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      onClick={() => handleEdit(sermon)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(sermon.id, sermon.title)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text)]">Sermon</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text)] hidden md:table-cell">Speaker</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text)] hidden lg:table-cell">Series</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text)] hidden sm:table-cell">Date</th>
                  <th className="text-center px-4 py-3 font-semibold text-[var(--text)] hidden sm:table-cell">Views</th>
                  <th className="text-center px-4 py-3 font-semibold text-[var(--text)]">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-[var(--text)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSermons.map((sermon) => (
                  <tr key={sermon.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 flex-shrink-0">
                          {sermon.thumbnailUrl ? (
                            <Image
                              src={sermon.thumbnailUrl}
                              alt={sermon.title}
                              fill
                              className="object-cover"
                            />
                          ) : sermon.youtubeId ? (
                            <Image
                              src={`https://img.youtube.com/vi/${sermon.youtubeId}/mqdefault.jpg`}
                              alt={sermon.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              {getMediaIcon(sermon.mediaType)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--text)] line-clamp-1">{sermon.title}</p>
                          <p className="text-xs text-[var(--accent)]">{sermon.scripture || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-muted)] hidden md:table-cell">
                      {sermon.speaker.name}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {sermon.series ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] text-xs">
                          {sermon.series.title}
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-muted)] hidden sm:table-cell">
                      {new Date(sermon.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-center text-[var(--text-muted)] hidden sm:table-cell">
                      {sermon.viewCount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => togglePublished(sermon)}
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                          sermon.published
                            ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                            : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                        )}
                      >
                        {sermon.published ? <Eye size={12} /> : <EyeOff size={12} />}
                        {sermon.published ? "Live" : "Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(sermon)}
                          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(sermon.id, sermon.title)}
                          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
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
        </div>
      )}
    </div>
  );
}
