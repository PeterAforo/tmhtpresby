"use client";

import { useState, useEffect, useCallback } from "react";
import { Mic, Plus, Pencil, Trash2, X, Save, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Speaker {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  imageUrl: string | null;
  _count: { sermons: number };
}

const emptyForm = {
  name: "",
  title: "",
  bio: "",
  imageUrl: "",
};

export default function SpeakersAdminPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchSpeakers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/speakers");
      if (res.ok) {
        const data = await res.json();
        setSpeakers(data.speakers || []);
      }
    } catch (err) {
      console.error("Failed to fetch speakers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpeakers();
  }, [fetchSpeakers]);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (speaker: Speaker) => {
    setForm({
      name: speaker.name,
      title: speaker.title || "",
      bio: speaker.bio || "",
      imageUrl: speaker.imageUrl || "",
    });
    setEditingId(speaker.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = { ...form, ...(editingId && { id: editingId }) };
      const res = await fetch("/api/admin/speakers", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowForm(false);
        fetchSpeakers();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this speaker? This will not delete their sermons.")) return;
    await fetch(`/api/admin/speakers?id=${id}`, { method: "DELETE" });
    fetchSpeakers();
  };

  const inputClasses = cn(
    "w-full px-3 py-2.5 rounded-lg text-sm",
    "bg-white text-gray-900 border border-gray-200",
    "focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mic size={24} className="text-[var(--accent)]" />
            Speakers
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage sermon speakers and preachers</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={18} /> Add Speaker
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? "Edit Speaker" : "New Speaker"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClasses}
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputClasses}
                  placeholder="e.g., Rev. Dr., Pastor, Elder"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className={inputClasses}
                  placeholder="Short biography..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className={inputClasses}
                  placeholder="https://..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Speakers Grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
          </div>
        ) : speakers.length === 0 ? (
          <div className="p-12 text-center">
            <Mic size={32} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No speakers yet</h3>
            <p className="text-sm text-gray-500">Add speakers to assign them to sermons.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {speakers.map((speaker) => (
              <div key={speaker.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {speaker.imageUrl ? (
                      <img src={speaker.imageUrl} alt={speaker.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{speaker.name}</h3>
                    {speaker.title && <p className="text-sm text-gray-500">{speaker.title}</p>}
                    <p className="text-xs text-[var(--accent)] mt-1">{speaker._count.sermons} sermon{speaker._count.sermons !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                {speaker.bio && (
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">{speaker.bio}</p>
                )}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => openEdit(speaker)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(speaker.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
