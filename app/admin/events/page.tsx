"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Loader2, Calendar, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string | null;
  category: string;
  startDate: string;
  endDate: string | null;
  startTime: string | null;
  endTime: string | null;
  capacity: number | null;
  isFeatured: boolean;
  published: boolean;
  _count: { rsvps: number };
}

const categories = ["worship", "youth", "women", "men", "outreach", "family", "prayer", "conference", "special"];

const emptyForm = {
  title: "",
  description: "",
  location: "",
  category: "special",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  startTime: "",
  endTime: "",
  capacity: "",
  isFeatured: false,
  published: true,
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events");
      const data = await res.json();
      setEvents(data.events || []);
    } catch {
      console.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  function openNew() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(event: Event) {
    setForm({
      title: event.title,
      description: event.description || "",
      location: event.location || "",
      category: event.category,
      startDate: event.startDate.split("T")[0],
      endDate: event.endDate ? event.endDate.split("T")[0] : "",
      startTime: event.startTime || "",
      endTime: event.endTime || "",
      capacity: event.capacity?.toString() || "",
      isFeatured: event.isFeatured,
      published: event.published,
    });
    setEditingId(event.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = { ...form, ...(editingId && { id: editingId }) };
      const res = await fetch("/api/admin/events", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowForm(false);
        fetchEvents();
      }
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(event: Event) {
    await fetch("/api/admin/events", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: event.id, published: !event.published }),
    });
    fetchEvents();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
    fetchEvents();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)]">Events</h1>
          <p className="text-sm text-[var(--text-muted)]">Manage church events and registrations</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus size={16} /> New Event
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--text)]">{editingId ? "Edit Event" : "New Event"}</h2>
              <button onClick={() => setShowForm(false)} className="text-[var(--text-muted)] hover:text-[var(--text)]"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Event title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />

              <RichTextEditor
                value={form.description}
                onChange={(value) => setForm({ ...form, description: value })}
                placeholder="Event description..."
              />

              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30">
                  {categories.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[var(--text-muted)] mb-1 block">Start date</label>
                  <input required type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)] mb-1 block">End date (optional)</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-[var(--text-muted)] mb-1 block">Start time</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)] mb-1 block">End time</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)] mb-1 block">Capacity</label>
                  <input type="number" placeholder="Unlimited" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-[var(--text)]">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded" />
                  Featured event
                </label>
                <label className="flex items-center gap-2 text-sm text-[var(--text)]">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded" />
                  Published
                </label>
              </div>

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

      {/* Events table */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-[var(--accent)]" /></div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-muted)]">No events yet. Create your first event!</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-card)] border-b border-[var(--border)]">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text)]">Event</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text)]">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--text)]">Date</th>
                <th className="text-center px-4 py-3 font-semibold text-[var(--text)]">RSVPs</th>
                <th className="text-center px-4 py-3 font-semibold text-[var(--text)]">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-[var(--text)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-[var(--bg-card)]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[var(--text)]">{event.title}</span>
                      {event.isFeatured && <Star size={14} className="text-amber-500 fill-amber-500" />}
                    </div>
                    {event.location && <p className="text-xs text-[var(--text-muted)]">{event.location}</p>}
                  </td>
                  <td className="px-4 py-3 capitalize text-[var(--text-muted)]">{event.category}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">
                    {new Date(event.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[var(--text-muted)]">
                      <Users size={12} /> {event._count.rsvps}
                      {event.capacity && <span className="text-xs">/ {event.capacity}</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", event.published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400")}>
                      {event.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => togglePublished(event)} className="p-1.5 rounded-lg hover:bg-[var(--border)]/50 text-[var(--text-muted)]" title={event.published ? "Unpublish" : "Publish"}>
                        {event.published ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => openEdit(event)} className="p-1.5 rounded-lg hover:bg-[var(--border)]/50 text-[var(--text-muted)]" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(event.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600" title="Delete">
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
