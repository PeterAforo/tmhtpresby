"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Image as ImageIcon, Save, X } from "lucide-react";

interface PageHero {
  id: string;
  pageSlug: string;
  title: string | null;
  subtitle: string | null;
  backgroundUrl: string | null;
  overlayColor: string | null;
  isActive: boolean;
}

const PREDEFINED_PAGES = [
  { slug: "about", label: "About" },
  { slug: "about/church", label: "About - Church" },
  { slug: "about/minister", label: "About - Minister" },
  { slug: "about/catechist", label: "About - Catechist" },
  { slug: "about/session", label: "About - Session" },
  { slug: "about/agents", label: "About - Agents" },
  { slug: "about/administration", label: "About - Administration" },
  { slug: "about/departments", label: "About - Departments" },
  { slug: "about/committees", label: "About - Committees" },
  { slug: "about/our-story", label: "About - Our Story" },
  { slug: "about/beliefs", label: "About - Beliefs" },
  { slug: "about/vision", label: "About - Vision" },
  { slug: "sermons", label: "Sermons" },
  { slug: "events", label: "Events" },
  { slug: "blog", label: "Blog" },
  { slug: "gallery", label: "Gallery" },
  { slug: "contact", label: "Contact" },
  { slug: "give", label: "Give" },
  { slug: "ministries", label: "Ministries" },
  { slug: "announcements", label: "Announcements" },
  { slug: "daily-word", label: "Daily Word" },
  { slug: "devotionals", label: "Devotionals" },
  { slug: "resources", label: "Resources" },
  { slug: "community-impact", label: "Community Impact" },
  { slug: "videos", label: "Videos" },
  { slug: "volunteers", label: "Volunteers" },
  { slug: "news", label: "News" },
];

export default function PageHeroesAdmin() {
  const [heroes, setHeroes] = useState<PageHero[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    pageSlug: "",
    title: "",
    subtitle: "",
    backgroundUrl: "",
    overlayColor: "rgba(12, 21, 41, 0.85)",
  });

  useEffect(() => {
    fetchHeroes();
  }, []);

  async function fetchHeroes() {
    try {
      const res = await fetch("/api/admin/page-heroes");
      if (res.ok) {
        const data = await res.json();
        setHeroes(data);
      }
    } catch (error) {
      console.error("Error fetching heroes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const url = editingId 
        ? `/api/admin/page-heroes/${editingId}`
        : "/api/admin/page-heroes";
      
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchHeroes();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving hero:", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this page hero?")) return;

    try {
      const res = await fetch(`/api/admin/page-heroes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchHeroes();
      }
    } catch (error) {
      console.error("Error deleting hero:", error);
    }
  }

  function handleEdit(hero: PageHero) {
    setFormData({
      pageSlug: hero.pageSlug,
      title: hero.title || "",
      subtitle: hero.subtitle || "",
      backgroundUrl: hero.backgroundUrl || "",
      overlayColor: hero.overlayColor || "rgba(12, 21, 41, 0.85)",
    });
    setEditingId(hero.id);
    setShowForm(true);
  }

  function resetForm() {
    setFormData({
      pageSlug: "",
      title: "",
      subtitle: "",
      backgroundUrl: "",
      overlayColor: "rgba(12, 21, 41, 0.85)",
    });
    setEditingId(null);
    setShowForm(false);
  }

  const usedSlugs = heroes.map(h => h.pageSlug);
  const availablePages = PREDEFINED_PAGES.filter(p => !usedSlugs.includes(p.slug) || (editingId && formData.pageSlug === p.slug));

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--border)] rounded w-1/4"></div>
          <div className="h-64 bg-[var(--border)] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Page Hero Backgrounds</h1>
          <p className="text-[var(--text-muted)] mt-1">
            Manage background images for page title sections
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Add Page Hero
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--text)]">
              {editingId ? "Edit Page Hero" : "Add Page Hero"}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  Page
                </label>
                <select
                  value={formData.pageSlug}
                  onChange={(e) => setFormData({ ...formData, pageSlug: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  required
                >
                  <option value="">Select a page...</option>
                  {availablePages.map((page) => (
                    <option key={page.slug} value={page.slug}>
                      {page.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  Background Image URL
                </label>
                <input
                  type="url"
                  value={formData.backgroundUrl}
                  onChange={(e) => setFormData({ ...formData, backgroundUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  Title Override (optional)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Leave empty to use default"
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  Subtitle Override (optional)
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Leave empty to use default"
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  Overlay Color
                </label>
                <input
                  type="text"
                  value={formData.overlayColor}
                  onChange={(e) => setFormData({ ...formData, overlayColor: e.target.value })}
                  placeholder="rgba(12, 21, 41, 0.85)"
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Use rgba format for transparency, e.g., rgba(0, 0, 0, 0.7)
                </p>
              </div>
            </div>

            {formData.backgroundUrl && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  Preview
                </label>
                <div className="relative h-32 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.backgroundUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: formData.overlayColor }}
                  >
                    <span className="text-white font-semibold">
                      {formData.title || "Page Title"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-[var(--border)] text-[var(--text)] rounded-lg hover:bg-[var(--bg)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Save size={18} />
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text)]">Page</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text)]">Background</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text)]">Title Override</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text)]">Status</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--text)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {heroes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-muted)]">
                    <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
                    <p>No page heroes configured yet.</p>
                    <p className="text-sm">Click &quot;Add Page Hero&quot; to get started.</p>
                  </td>
                </tr>
              ) : (
                heroes.map((hero) => {
                  const pageLabel = PREDEFINED_PAGES.find(p => p.slug === hero.pageSlug)?.label || hero.pageSlug;
                  return (
                    <tr key={hero.id} className="border-b border-[var(--border)] last:border-0">
                      <td className="px-6 py-4">
                        <span className="font-medium text-[var(--text)]">{pageLabel}</span>
                        <span className="block text-xs text-[var(--text-muted)]">/{hero.pageSlug}</span>
                      </td>
                      <td className="px-6 py-4">
                        {hero.backgroundUrl ? (
                          <div className="w-20 h-12 rounded overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={hero.backgroundUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-[var(--text-muted)] text-sm">No image</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[var(--text-muted)] text-sm">
                        {hero.title || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          hero.isActive 
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}>
                          {hero.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(hero)}
                            className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(hero.id)}
                            className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
