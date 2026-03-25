"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Loader2, Trash2, Info, ExternalLink, Settings } from "lucide-react";
import PageBuilder, { BlockData } from "@/components/admin/PageBuilder";

interface PageData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: BlockData[] | null;
  template: string;
  published: boolean;
  isCore: boolean;
  metaTitle: string | null;
  metaDesc: string | null;
}

export default function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState<PageData | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [template, setTemplate] = useState("default");
  const [published, setPublished] = useState(false);
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [activeTab, setActiveTab] = useState<"content" | "settings">("content");

  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await fetch(`/api/admin/pages/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPage(data);
          setTitle(data.title);
          setSlug(data.slug);
          setDescription(data.description || "");
          setTemplate(data.template);
          setPublished(data.published);
          setBlocks(data.content || []);
        } else {
          router.push("/admin/pages");
        }
      } catch (error) {
        console.error("Error fetching page:", error);
        router.push("/admin/pages");
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, [id, router]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a page title");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || generateSlug(title),
          description,
          template,
          published,
          content: blocks,
        }),
      });

      if (res.ok) {
        router.push("/admin/pages");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update page");
      }
    } catch (error) {
      console.error("Error updating page:", error);
      alert("Failed to update page");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this page? This cannot be undone.")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/pages");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete page");
      }
    } catch (error) {
      console.error("Error deleting page:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/pages"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Page Title"
                className="text-xl font-bold text-gray-900 border-none outline-none bg-transparent w-full"
              />
              <p className="text-sm text-gray-500">
                /{slug || "page-url"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab("content")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "content"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "settings"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Settings
              </button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span className="text-sm text-gray-700">Published</span>
            </label>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
              Delete
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === "content" ? (
        <div className="flex-1 overflow-hidden">
          {page.isCore && (
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
              <div className="flex items-center gap-3">
                <Info size={18} className="text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  <strong>Core Page:</strong> Edit the content of each section below. Changes will appear on the live site after saving.
                </p>
              </div>
            </div>
          )}
          <PageBuilder initialBlocks={blocks} onChange={setBlocks} />
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Page Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(generateSlug(e.target.value))}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
                    placeholder="Brief description of the page..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template
                  </label>
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
                  >
                    <option value="default">Default (with header/footer)</option>
                    <option value="full-width">Full Width</option>
                    <option value="sidebar">With Sidebar</option>
                    <option value="blank">Blank (no header/footer)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
