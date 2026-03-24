"use client";

import { useState, useEffect, useCallback } from "react";
import { BookOpen, Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface Devotional {
  id: string;
  title: string;
  scripture: string;
  content: string;
  author: string;
  publishDate: string;
  published: boolean;
}

const emptyForm = {
  title: "",
  scripture: "",
  content: "",
  author: "",
  publishDate: new Date().toISOString().split("T")[0],
  published: true,
};

export default function DevotionalsAdminPage() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchDevotionals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/devotionals");
      if (res.ok) {
        const data = await res.json();
        setDevotionals(data.devotionals || []);
      }
    } catch (err) {
      console.error("Failed to fetch devotionals:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevotionals();
  }, [fetchDevotionals]);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (devotional: Devotional) => {
    setForm({
      title: devotional.title,
      scripture: devotional.scripture,
      content: devotional.content,
      author: devotional.author,
      publishDate: devotional.publishDate.split("T")[0],
      published: devotional.published,
    });
    setEditingId(devotional.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = { ...form, ...(editingId && { id: editingId }) };
      const res = await fetch("/api/admin/devotionals", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowForm(false);
        fetchDevotionals();
      }
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (devotional: Devotional) => {
    await fetch("/api/admin/devotionals", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: devotional.id, published: !devotional.published }),
    });
    fetchDevotionals();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this devotional?")) return;
    await fetch(`/api/admin/devotionals?id=${id}`, { method: "DELETE" });
    fetchDevotionals();
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
            <BookOpen size={24} className="text-[var(--accent)]" />
            Daily Devotionals
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage daily devotional content</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={18} /> New Devotional
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? "Edit Devotional" : "New Devotional"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputClasses}
                  placeholder="Devotional title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scripture *</label>
                  <input
                    required
                    value={form.scripture}
                    onChange={(e) => setForm({ ...form, scripture: e.target.value })}
                    className={inputClasses}
                    placeholder="e.g., John 3:16"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                  <input
                    required
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className={inputClasses}
                    placeholder="Author name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <RichTextEditor
                  value={form.content}
                  onChange={(value) => setForm({ ...form, content: value })}
                  placeholder="Devotional content..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date *</label>
                  <input
                    type="date"
                    required
                    value={form.publishDate}
                    onChange={(e) => setForm({ ...form, publishDate: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm({ ...form, published: e.target.checked })}
                      className="rounded border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)]"
                    />
                    <span className="text-sm text-gray-700">Published</span>
                  </label>
                </div>
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

      {/* Devotionals List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
          </div>
        ) : devotionals.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen size={32} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No devotionals yet</h3>
            <p className="text-sm text-gray-500">Create your first daily devotional.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scripture</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {devotionals.map((devotional) => (
                  <tr key={devotional.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{devotional.title}</td>
                    <td className="px-6 py-4 text-gray-600">{devotional.scripture}</td>
                    <td className="px-6 py-4 text-gray-600">{devotional.author}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(devotional.publishDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        devotional.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      )}>
                        {devotional.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => togglePublished(devotional)}
                          className="p-1.5 text-gray-400 hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-lg"
                          title={devotional.published ? "Unpublish" : "Publish"}
                        >
                          {devotional.published ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          onClick={() => openEdit(devotional)}
                          className="p-1.5 text-gray-400 hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-lg"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(devotional.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
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
    </div>
  );
}
