"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  X,
  Users,
  Calendar,
  Camera,
  ChevronRight,
  ImageIcon,
} from "lucide-react";

interface Ministry {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  order: number;
}

export default function AdminMinistryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    order: 0,
  });

  const fetchMinistry = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/ministries/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setMinistry(data.ministry);
        setForm({
          name: data.ministry.name || "",
          description: data.ministry.description || "",
          imageUrl: data.ministry.imageUrl || "",
          order: data.ministry.order || 0,
        });
      } else {
        router.push("/admin/ministries");
      }
    } catch (err) {
      console.error("Failed to fetch ministry:", err);
      router.push("/admin/ministries");
    } finally {
      setLoading(false);
    }
  }, [slug, router]);

  useEffect(() => {
    fetchMinistry();
  }, [fetchMinistry]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "ministries");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({ ...prev, imageUrl: data.url }));
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ministry) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/ministries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ministry.id,
          name: form.name,
          description: form.description,
          imageUrl: form.imageUrl,
          order: form.order,
        }),
      });

      if (res.ok) {
        fetchMinistry();
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!ministry) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--text-muted)]">Ministry not found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/ministries" className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg)]">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">{ministry.name}</h1>
          <p className="text-sm text-[var(--text-muted)]">Edit ministry details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Ministry Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Description</label>
                  <RichTextEditor
                    value={form.description}
                    onChange={(value) => setForm({ ...form, description: value })}
                    placeholder="Ministry description..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Display Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-32 px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Cover Image</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">This image displays on ministry cards.</p>

              {form.imageUrl ? (
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <Image src={form.imageUrl} alt={form.name} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imageUrl: "" })}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="aspect-video rounded-lg border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center mb-4 bg-[var(--bg)]">
                  <ImageIcon size={48} className="text-[var(--text-muted)] mb-2" />
                  <p className="text-sm text-[var(--text-muted)]">No image uploaded</p>
                </div>
              )}

              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[var(--bg)] border border-[var(--border)] cursor-pointer">
                <Upload size={16} />
                {uploading ? "Uploading..." : "Upload Image"}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-[var(--accent)] text-white"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href={`/admin/ministries/${slug}/executives`} className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg)] group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">Executives</p>
                    <p className="text-xs text-[var(--text-muted)]">Manage leadership</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[var(--text-muted)]" />
              </Link>
              <Link href={`/admin/ministries/${slug}/events`} className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg)] group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">Events</p>
                    <p className="text-xs text-[var(--text-muted)]">Manage activities</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[var(--text-muted)]" />
              </Link>
              <Link href={`/admin/ministries/${slug}/gallery`} className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg)] group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Camera size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">Gallery</p>
                    <p className="text-xs text-[var(--text-muted)]">Manage photos</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[var(--text-muted)]" />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text)] mb-2">Preview</h2>
            <Link href={`/ministries/${slug}`} target="_blank" className="text-sm text-[var(--accent)] hover:underline">
              View public page →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
