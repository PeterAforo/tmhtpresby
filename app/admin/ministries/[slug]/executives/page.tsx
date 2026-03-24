"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import RichTextEditor from "@/components/admin/RichTextEditor";
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
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  isCurrent: true,
  positionId: "",
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
      startDate: exec.startDate.split("T")[0],
      endDate: exec.endDate?.split("T")[0] || "",
      isCurrent: exec.isCurrent,
      positionId: exec.positionId,
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
                    onChange={(e) => setForm({ ...form, positionId: e.target.value })}
                    required
                    className={inputClasses}
                  >
                    <option value="">Select position</option>
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.title}
                      </option>
                    ))}
                  </select>
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
                  Image URL
                </label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className={inputClasses}
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
                        <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-bold shrink-0">
                          {exec.firstName[0]}{exec.lastName[0]}
                        </div>
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
                      <div className="w-8 h-8 rounded-full bg-[var(--border)] flex items-center justify-center text-[var(--text-muted)] text-xs font-medium">
                        {exec.firstName[0]}{exec.lastName[0]}
                      </div>
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
