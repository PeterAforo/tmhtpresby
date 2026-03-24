"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import RichTextEditor from "@/components/admin/RichTextEditor";
import FileUpload from "@/components/admin/FileUpload";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Save,
  X,
  Loader2,
  User,
  Calendar,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Position {
  id: string;
  title: string;
  order: number;
}

interface Executive {
  id: string;
  firstName: string;
  lastName: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  imageUrl: string | null;
  bio: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  whatsapp: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  positionId: string;
  position: Position;
}

interface Props {
  params: Promise<{ slug: string }>;
}

const emptyForm = {
  firstName: "",
  lastName: "",
  title: "",
  email: "",
  phone: "",
  imageUrl: "",
  bio: "",
  facebook: "",
  twitter: "",
  instagram: "",
  linkedin: "",
  whatsapp: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  isCurrent: true,
  positionId: "",
  customPosition: "",
};

export default function MinistryExecutivesPage({ params }: Props) {
  const { slug } = use(params);
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [ministryName, setMinistryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/ministries/${slug}/executives`);
      if (res.ok) {
        const data = await res.json();
        setExecutives(data.executives || []);
        setPositions(data.positions || []);
        setMinistryName(data.ministryName || slug);
      }
    } catch (err) {
      console.error("Failed to fetch:", err);
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

      const res = await fetch(`/api/admin/ministries/${slug}/executives`, {
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

  const handleEdit = (exec: Executive) => {
    setEditingId(exec.id);
    setForm({
      firstName: exec.firstName,
      lastName: exec.lastName,
      title: exec.title || "",
      email: exec.email || "",
      phone: exec.phone || "",
      imageUrl: exec.imageUrl || "",
      bio: exec.bio || "",
      facebook: exec.facebook || "",
      twitter: exec.twitter || "",
      instagram: exec.instagram || "",
      linkedin: exec.linkedin || "",
      whatsapp: exec.whatsapp || "",
      startDate: exec.startDate.split("T")[0],
      endDate: exec.endDate?.split("T")[0] || "",
      isCurrent: exec.isCurrent,
      positionId: exec.positionId,
      customPosition: "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from executives? This cannot be undone.`)) return;

    try {
      await fetch(`/api/admin/ministries/${slug}/executives?id=${id}`, {
        method: "DELETE",
      });
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const inputClasses = cn(
    "w-full px-3 py-2.5 rounded-lg text-sm",
    "bg-[var(--bg)] text-[var(--text)] border border-[var(--border)]",
    "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
  );

  const currentExecs = executives.filter((e) => e.isCurrent);
  const pastExecs = executives.filter((e) => !e.isCurrent);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/ministries"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to Ministries
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">
              {ministryName} Executives
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Manage current and past executives for this ministry
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
            Add Executive
          </button>
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--text)]">
                {editingId ? "Edit Executive" : "Add Executive"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    First Name *
                  </label>
                  <input
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Last Name *
                  </label>
                  <input
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    required
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Title (e.g. Elder, Rev.)
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Position *
                  </label>
                  <select
                    value={form.positionId}
                    onChange={(e) => setForm({ ...form, positionId: e.target.value, customPosition: "" })}
                    required={!form.customPosition}
                    className={inputClasses}
                  >
                    <option value="">Select position</option>
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.title}
                      </option>
                    ))}
                    <option value="custom">+ Add Custom Position</option>
                  </select>
                  {form.positionId === "custom" && (
                    <input
                      value={form.customPosition}
                      onChange={(e) => setForm({ ...form, customPosition: e.target.value })}
                      placeholder="Enter custom position title"
                      required
                      className={cn(inputClasses, "mt-2")}
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Phone
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                  Profile Image
                </label>
                <FileUpload
                  value={form.imageUrl}
                  onChange={(url) => setForm({ ...form, imageUrl: url })}
                  type="image"
                  placeholder="Upload executive photo"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                  Bio
                </label>
                <RichTextEditor
                  value={form.bio}
                  onChange={(value) => setForm({ ...form, bio: value })}
                  placeholder="Executive bio..."
                />
              </div>

              {/* Social Media Links */}
              <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--bg)]">
                <p className="text-xs font-semibold text-[var(--text)] mb-3">Social Media Links</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Facebook size={16} className="text-blue-600 shrink-0" />
                    <input
                      value={form.facebook}
                      onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                      placeholder="Facebook URL"
                      className={cn(inputClasses, "text-xs py-2")}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter size={16} className="text-sky-500 shrink-0" />
                    <input
                      value={form.twitter}
                      onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                      placeholder="Twitter/X handle"
                      className={cn(inputClasses, "text-xs py-2")}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Instagram size={16} className="text-pink-600 shrink-0" />
                    <input
                      value={form.instagram}
                      onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                      placeholder="Instagram handle"
                      className={cn(inputClasses, "text-xs py-2")}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin size={16} className="text-blue-700 shrink-0" />
                    <input
                      value={form.linkedin}
                      onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                      placeholder="LinkedIn URL"
                      className={cn(inputClasses, "text-xs py-2")}
                    />
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <MessageCircle size={16} className="text-green-600 shrink-0" />
                    <input
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      placeholder="WhatsApp number (with country code)"
                      className={cn(inputClasses, "text-xs py-2")}
                    />
                  </div>
                </div>
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
                    disabled={form.isCurrent}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-[var(--text)]">
                <input
                  type="checkbox"
                  checked={form.isCurrent}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      isCurrent: e.target.checked,
                      endDate: e.target.checked ? "" : form.endDate,
                    })
                  }
                  className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                Currently serving
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingId ? "Update" : "Add"} Executive
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

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Current Executives */}
          <div>
            <h2 className="text-lg font-semibold text-[var(--text)] mb-4">
              Current Executives ({currentExecs.length})
            </h2>
            {currentExecs.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] py-4">
                No current executives. Add one above.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentExecs.map((exec) => (
                  <div
                    key={exec.id}
                    className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {exec.imageUrl ? (
                          <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-[var(--accent)]/20">
                            <Image src={exec.imageUrl} alt={`${exec.firstName} ${exec.lastName}`} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-bold text-lg shrink-0">
                            {exec.firstName[0]}{exec.lastName[0]}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                            {exec.position.title}
                          </p>
                          <p className="text-sm font-semibold text-[var(--text)]">
                            {exec.title && `${exec.title} `}
                            {exec.firstName} {exec.lastName}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-1">
                            <Calendar size={10} />
                            Since {new Date(exec.startDate).getFullYear()}
                          </p>
                          {/* Social Media Icons */}
                          {(exec.facebook || exec.twitter || exec.instagram || exec.linkedin || exec.whatsapp) && (
                            <div className="flex items-center gap-2 mt-2">
                              {exec.facebook && (
                                <a href={exec.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:opacity-80">
                                  <Facebook size={14} />
                                </a>
                              )}
                              {exec.twitter && (
                                <a href={exec.twitter.startsWith('http') ? exec.twitter : `https://twitter.com/${exec.twitter}`} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:opacity-80">
                                  <Twitter size={14} />
                                </a>
                              )}
                              {exec.instagram && (
                                <a href={exec.instagram.startsWith('http') ? exec.instagram : `https://instagram.com/${exec.instagram}`} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:opacity-80">
                                  <Instagram size={14} />
                                </a>
                              )}
                              {exec.linkedin && (
                                <a href={exec.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:opacity-80">
                                  <Linkedin size={14} />
                                </a>
                              )}
                              {exec.whatsapp && (
                                <a href={`https://wa.me/${exec.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:opacity-80">
                                  <MessageCircle size={14} />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(exec)}
                          className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg)] transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(exec.id, `${exec.firstName} ${exec.lastName}`)}
                          className="p-1.5 rounded text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Executives */}
          {pastExecs.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[var(--text)] mb-4">
                Past Executives ({pastExecs.length})
              </h2>
              <div className="space-y-2">
                {pastExecs.map((exec) => (
                  <div
                    key={exec.id}
                    className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {exec.imageUrl ? (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                          <Image src={exec.imageUrl} alt={`${exec.firstName} ${exec.lastName}`} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[var(--border)] flex items-center justify-center text-[var(--text-muted)] text-xs font-medium">
                          {exec.firstName[0]}{exec.lastName[0]}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-[var(--text)]">
                          {exec.title && `${exec.title} `}
                          {exec.firstName} {exec.lastName}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {exec.position.title} •{" "}
                          {new Date(exec.startDate).getFullYear()} -{" "}
                          {exec.endDate ? new Date(exec.endDate).getFullYear() : "Present"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(exec)}
                        className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-card)] transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(exec.id, `${exec.firstName} ${exec.lastName}`)}
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
