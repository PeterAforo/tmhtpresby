"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import RichTextEditor from "@/components/admin/RichTextEditor";
import FileUpload from "@/components/admin/FileUpload";
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
  UserCheck,
  Shield,
  Clock,
  Check,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Ministry {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  order: number;
  ageMin: number | null;
  ageMax: number | null;
  _count?: { members: number };
}

interface MinistryMember {
  id: string;
  userId: string;
  role: string;
  status: string;
  canViewMembers: boolean;
  joinedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string | null;
  };
}

interface Executive {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  position: { title: string };
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
    ageMin: "",
    ageMax: "",
  });
  const [members, setMembers] = useState<MinistryMember[]>([]);
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showModeratorModal, setShowModeratorModal] = useState(false);

  const fetchMinistry = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/ministries/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setMinistry(data.ministry);
        setMembers(data.members || []);
        setExecutives(data.executives || []);
        setForm({
          name: data.ministry.name || "",
          description: data.ministry.description || "",
          imageUrl: data.ministry.imageUrl || "",
          order: data.ministry.order || 0,
          ageMin: data.ministry.ageMin?.toString() || "",
          ageMax: data.ministry.ageMax?.toString() || "",
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
          ageMin: form.ageMin ? parseInt(form.ageMin) : null,
          ageMax: form.ageMax ? parseInt(form.ageMax) : null,
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

            {/* Age Range Settings */}
            <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--text)] mb-2">Auto-Membership by Age</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Users within this age range will automatically become members of this ministry.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Minimum Age</label>
                  <input
                    type="number"
                    value={form.ageMin}
                    onChange={(e) => setForm({ ...form, ageMin: e.target.value })}
                    placeholder="e.g., 18"
                    min="0"
                    max="120"
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Maximum Age</label>
                  <input
                    type="number"
                    value={form.ageMax}
                    onChange={(e) => setForm({ ...form, ageMax: e.target.value })}
                    placeholder="e.g., 35"
                    min="0"
                    max="120"
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
                  />
                </div>
              </div>
              {form.ageMin && form.ageMax && (
                <p className="text-xs text-[var(--accent)] mt-2">
                  Members aged {form.ageMin} to {form.ageMax} years will be auto-assigned to this ministry.
                </p>
              )}
            </div>

            <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Cover Image</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">This image displays on ministry cards.</p>

              <FileUpload
                value={form.imageUrl}
                onChange={(url) => setForm({ ...form, imageUrl: url })}
                type="image"
                placeholder="Upload ministry cover image"
              />
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

          {/* Members Stats */}
          <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--text)]">Members</h2>
              <button
                onClick={() => setShowMembersModal(true)}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Manage →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[var(--bg)]">
                <p className="text-2xl font-bold text-[var(--text)]">
                  {members.filter(m => m.status === "approved").length}
                </p>
                <p className="text-xs text-[var(--text-muted)]">Approved</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg)]">
                <p className="text-2xl font-bold text-yellow-600">
                  {members.filter(m => m.status === "pending").length}
                </p>
                <p className="text-xs text-[var(--text-muted)]">Pending</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)]">
                Moderators: {members.filter(m => m.role === "moderator").length}
              </p>
            </div>
          </div>

          {/* Assign Moderator */}
          <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--text)]">Moderators</h2>
              <button
                onClick={() => setShowModeratorModal(true)}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Assign →
              </button>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-3">
              Moderators can manage ministry content and approve members.
            </p>
            {members.filter(m => m.role === "moderator").length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] italic">No moderators assigned</p>
            ) : (
              <div className="space-y-2">
                {members.filter(m => m.role === "moderator").map(mod => (
                  <div key={mod.id} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg)]">
                    {mod.user.image ? (
                      <Image src={mod.user.image} alt="" width={24} height={24} className="rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] text-xs font-bold">
                        {mod.user.firstName[0]}
                      </div>
                    )}
                    <span className="text-sm text-[var(--text)]">{mod.user.firstName} {mod.user.lastName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Members Management Modal */}
      {showMembersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--text)]">Ministry Members</h2>
              <button onClick={() => setShowMembersModal(false)} className="p-1 text-[var(--text-muted)] hover:text-[var(--text)]">
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              {members.length === 0 ? (
                <p className="text-center text-[var(--text-muted)] py-8">No members yet</p>
              ) : (
                <div className="space-y-3">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
                      <div className="flex items-center gap-3">
                        {member.user.image ? (
                          <Image src={member.user.image} alt="" width={40} height={40} className="rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-bold">
                            {member.user.firstName[0]}{member.user.lastName[0]}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-[var(--text)]">
                            {member.user.firstName} {member.user.lastName}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">{member.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          member.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                          member.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {member.status}
                        </span>
                        {member.role === "moderator" && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            Moderator
                          </span>
                        )}
                        {member.canViewMembers && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            Can View
                          </span>
                        )}
                        {member.status === "pending" && (
                          <div className="flex gap-1">
                            <button
                              onClick={async () => {
                                await fetch(`/api/admin/ministries/${slug}/members`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ memberId: member.id, status: "approved" }),
                                });
                                fetchMinistry();
                              }}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              title="Approve"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={async () => {
                                await fetch(`/api/admin/ministries/${slug}/members`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ memberId: member.id, status: "rejected" }),
                                });
                                fetchMinistry();
                              }}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Reject"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        )}
                        {member.status === "approved" && !member.canViewMembers && (
                          <button
                            onClick={async () => {
                              await fetch(`/api/admin/ministries/${slug}/members`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ memberId: member.id, canViewMembers: true }),
                              });
                              fetchMinistry();
                            }}
                            className="text-xs text-[var(--accent)] hover:underline"
                          >
                            Grant View Access
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign Moderator Modal */}
      {showModeratorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--text)]">Assign Moderator</h2>
              <button onClick={() => setShowModeratorModal(false)} className="p-1 text-[var(--text-muted)] hover:text-[var(--text)]">
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Select an executive to assign as moderator for this ministry.
              </p>
              {executives.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[var(--text-muted)]">No executives found</p>
                  <Link href={`/admin/ministries/${slug}/executives`} className="text-sm text-[var(--accent)] hover:underline mt-2 inline-block">
                    Add executives first →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {executives.map(exec => {
                    const isModerator = members.some(m => m.user.firstName === exec.firstName && m.user.lastName === exec.lastName && m.role === "moderator");
                    return (
                      <div key={exec.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
                        <div className="flex items-center gap-3">
                          {exec.imageUrl ? (
                            <Image src={exec.imageUrl} alt="" width={40} height={40} className="rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-bold">
                              {exec.firstName[0]}{exec.lastName[0]}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-[var(--text)]">
                              {exec.firstName} {exec.lastName}
                            </p>
                            <p className="text-xs text-[var(--text-muted)]">{exec.position.title}</p>
                          </div>
                        </div>
                        {isModerator ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            Moderator
                          </span>
                        ) : (
                          <button
                            onClick={async () => {
                              await fetch(`/api/admin/ministries/${slug}/members`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  firstName: exec.firstName,
                                  lastName: exec.lastName,
                                  role: "moderator",
                                }),
                              });
                              fetchMinistry();
                            }}
                            className="px-3 py-1 rounded-lg text-xs font-medium bg-[var(--accent)] text-white hover:opacity-90"
                          >
                            Assign
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
