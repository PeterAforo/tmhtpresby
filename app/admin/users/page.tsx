"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, Search, Edit, Trash2, User, X, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import FileUpload from "@/components/admin/FileUpload";

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string | null;
  phone: string | null;
  role: string;
  ministryGroup: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const roleColors: Record<string, { bg: string; text: string }> = {
  super_admin: { bg: "bg-red-100", text: "text-red-800" },
  pastor: { bg: "bg-purple-100", text: "text-purple-800" },
  ministry_leader: { bg: "bg-blue-100", text: "text-blue-800" },
  member: { bg: "bg-green-100", text: "text-green-800" },
  visitor: { bg: "bg-gray-100", text: "text-gray-800" },
};

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  pastor: "Pastor",
  ministry_leader: "Ministry Leader",
  member: "Member",
  visitor: "Visitor",
};

const ministryGroups = ["children", "youth", "young_adult", "adult", "senior"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    image: "",
    role: "visitor",
    ministryGroup: "",
    isActive: true,
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openEditModal = (user: UserData) => {
    setEditingUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      image: user.image || "",
      role: user.role,
      ministryGroup: user.ministryGroup || "",
      isActive: user.isActive,
    });
    setShowEditModal(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingUser.id, ...editForm }),
      });
      if (res.ok) {
        setShowEditModal(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update user");
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (user: UserData) => {
    if (!confirm(`Delete ${user.firstName} ${user.lastName}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, { method: "DELETE" });
      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const roleStats = Object.keys(roleLabels).map((role) => ({
    role,
    count: users.filter((u) => u.role === role).length,
  }));

  const inputClasses = cn(
    "w-full px-3 py-2 rounded-lg text-sm",
    "bg-white text-gray-900 border border-gray-200",
    "focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage church members and their roles
          </p>
        </div>
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {roleStats.map(({ role, count }) => {
          const colors = roleColors[role] || roleColors.visitor;
          return (
            <div key={role} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${colors.bg.replace("100", "500")}`} />
                <span className="text-xs font-medium text-gray-500">{roleLabels[role]}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
          >
            <option value="">All Roles</option>
            {Object.entries(roleLabels).map(([role, label]) => (
              <option key={role} value={role}>{label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Edit User</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className={inputClasses}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                <FileUpload
                  value={editForm.image}
                  onChange={(url) => setEditForm({ ...editForm, image: url })}
                  type="image"
                  placeholder="Upload profile picture"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className={inputClasses}
                  >
                    {Object.entries(roleLabels).map(([role, label]) => (
                      <option key={role} value={role}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ministry Group</label>
                  <select
                    value={editForm.ministryGroup}
                    onChange={(e) => setEditForm({ ...editForm, ministryGroup: e.target.value })}
                    className={inputClasses}
                  >
                    <option value="">None</option>
                    {ministryGroups.map((group) => (
                      <option key={group} value={group}>{group.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>
                    ))}
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUser}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <User size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
            <p className="text-sm text-gray-500">
              {searchQuery || roleFilter || statusFilter ? "Try adjusting your filters." : "No users registered yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const colors = roleColors[user.role] || roleColors.visitor;
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-medium overflow-hidden flex-shrink-0">
                            {user.image ? (
                              <Image src={user.image} alt={`${user.firstName} ${user.lastName}`} width={40} height={40} className="w-full h-full object-cover" />
                            ) : (
                              `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U"
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                          {roleLabels[user.role] || user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-gray-400 hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
