"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Calendar,
  MapPin,
  Clock,
  Users,
  Eye,
  EyeOff,
  X,
  Save,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/admin/RichTextEditor";
import FileUpload from "@/components/admin/FileUpload";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string | null;
  category: string;
  imageUrl: string | null;
  startDate: string;
  endDate: string | null;
  startTime: string | null;
  endTime: string | null;
  capacity: number | null;
  isFeatured: boolean;
  published: boolean;
  _count: { rsvps: number };
}

interface Props {
  params: Promise<{ slug: string }>;
}

const emptyForm = {
  title: "",
  description: "",
  location: "",
  imageUrl: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  startTime: "",
  endTime: "",
  capacity: "",
  isFeatured: false,
  published: true,
};

export default function MinistryEventsPage({ params }: Props) {
  const { slug } = use(params);
  const [events, setEvents] = useState<Event[]>([]);
  const [ministryName, setMinistryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/ministries/${slug}/events`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
        setMinistryName(data.ministryName || slug);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...form } : form;

      const res = await fetch(`/api/admin/ministries/${slug}/events`, {
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

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description || "",
      location: event.location || "",
      imageUrl: event.imageUrl || "",
      startDate: event.startDate.split("T")[0],
      endDate: event.endDate ? event.endDate.split("T")[0] : "",
      startTime: event.startTime || "",
      endTime: event.endTime || "",
      capacity: event.capacity?.toString() || "",
      isFeatured: event.isFeatured,
      published: event.published,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    try {
      await fetch(`/api/admin/ministries/${slug}/events?id=${id}`, {
        method: "DELETE",
      });
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const togglePublished = async (event: Event) => {
    try {
      await fetch(`/api/admin/ministries/${slug}/events`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: event.id, published: !event.published }),
      });
      fetchData();
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const inputClasses = cn(
    "w-full px-3 py-2.5 rounded-lg text-sm",
    "bg-[var(--bg)] text-[var(--text)] border border-[var(--border)]",
    "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
  );

  const upcomingEvents = events.filter(
    (e) => new Date(e.startDate) >= new Date()
  );
  const pastEvents = events.filter((e) => new Date(e.startDate) < new Date());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/ministries/${slug}`}
            className="p-2 rounded-lg hover:bg-[var(--border)] transition-colors"
          >
            <ArrowLeft size={20} className="text-[var(--text-muted)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">
              {ministryName} Events
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              {events.length} event{events.length !== 1 ? "s" : ""}
            </p>
          </div>
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
          Add Event
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--text)]">
                {editingId ? "Edit Event" : "Add Event"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                  Event Title *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className={inputClasses}
                  placeholder="Event title"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                  Event Image
                </label>
                <FileUpload
                  value={form.imageUrl}
                  onChange={(url) => setForm({ ...form, imageUrl: url })}
                  type="image"
                  placeholder="Upload event image"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                  Description
                </label>
                <RichTextEditor
                  value={form.description}
                  onChange={(value) => setForm({ ...form, description: value })}
                  placeholder="Event description..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                  Location
                </label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className={inputClasses}
                  placeholder="Event venue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    className={inputClasses}
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-[var(--text)]">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                  Featured Event
                </label>
                <label className="flex items-center gap-2 text-sm text-[var(--text)]">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                  Published
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingId ? "Update" : "Create"} Event
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

      {/* Events List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
          <Calendar size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
          <p className="text-[var(--text-muted)]">No events yet</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Create your first event using the button above
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[var(--text)] mb-4">
                Upcoming Events ({upcomingEvents.length})
              </h2>
              <div className="grid gap-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex gap-4 p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]"
                  >
                    {event.imageUrl ? (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                        <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                        <Calendar size={24} className="text-[var(--accent)]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-[var(--text)]">{event.title}</h3>
                            {event.isFeatured && (
                              <Star size={14} className="text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[var(--text-muted)]">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(event.startDate).toLocaleDateString()}
                            </span>
                            {event.startTime && (
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {event.startTime}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin size={12} />
                                {event.location}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {event._count.rsvps} RSVPs
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium",
                              event.published
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-100 text-gray-500"
                            )}
                          >
                            {event.published ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => togglePublished(event)}
                        className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg)] transition-colors"
                        title={event.published ? "Unpublish" : "Publish"}
                      >
                        {event.published ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg)] transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id, event.title)}
                        className="p-1.5 rounded text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[var(--text)] mb-4">
                Past Events ({pastEvents.length})
              </h2>
              <div className="space-y-2">
                {pastEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between gap-4 p-3 bg-[var(--bg)] rounded-lg border border-[var(--border)]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {event.imageUrl ? (
                        <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                          <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-[var(--border)] flex items-center justify-center shrink-0">
                          <Calendar size={16} className="text-[var(--text-muted)]" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--text)] truncate">{event.title}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {new Date(event.startDate).toLocaleDateString()} • {event._count.rsvps} RSVPs
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-card)] transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id, event.title)}
                        className="p-1.5 rounded text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
