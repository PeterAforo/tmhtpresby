"use client";

import { useState } from "react";
import { Shield, Users, Check, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Permission {
  id: string;
  label: string;
  description: string;
}

interface Role {
  id: string;
  label: string;
  description: string;
  color: string;
  permissions: string[];
}

const allPermissions: Permission[] = [
  { id: "dashboard.view", label: "View Dashboard", description: "Access the admin dashboard" },
  { id: "users.view", label: "View Users", description: "View user list and details" },
  { id: "users.edit", label: "Edit Users", description: "Modify user information and roles" },
  { id: "users.delete", label: "Delete Users", description: "Remove users from the system" },
  { id: "content.view", label: "View Content", description: "View sermons, events, blog posts" },
  { id: "content.create", label: "Create Content", description: "Create new content items" },
  { id: "content.edit", label: "Edit Content", description: "Modify existing content" },
  { id: "content.delete", label: "Delete Content", description: "Remove content items" },
  { id: "content.publish", label: "Publish Content", description: "Publish/unpublish content" },
  { id: "media.upload", label: "Upload Media", description: "Upload images and files" },
  { id: "media.delete", label: "Delete Media", description: "Remove uploaded files" },
  { id: "giving.view", label: "View Donations", description: "Access donation records" },
  { id: "giving.manage", label: "Manage Donations", description: "Process and manage donations" },
  { id: "campaigns.view", label: "View Campaigns", description: "View communication campaigns" },
  { id: "campaigns.send", label: "Send Campaigns", description: "Create and send campaigns" },
  { id: "settings.view", label: "View Settings", description: "Access site settings" },
  { id: "settings.edit", label: "Edit Settings", description: "Modify site configuration" },
  { id: "analytics.view", label: "View Analytics", description: "Access analytics dashboard" },
];

const roles: Role[] = [
  {
    id: "super_admin",
    label: "Super Admin",
    description: "Full access to all features and settings",
    color: "bg-red-100 text-red-800 border-red-200",
    permissions: allPermissions.map((p) => p.id),
  },
  {
    id: "pastor",
    label: "Pastor",
    description: "Manage content, users, and communications",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    permissions: [
      "dashboard.view",
      "users.view",
      "users.edit",
      "content.view",
      "content.create",
      "content.edit",
      "content.delete",
      "content.publish",
      "media.upload",
      "media.delete",
      "giving.view",
      "campaigns.view",
      "campaigns.send",
      "settings.view",
      "analytics.view",
    ],
  },
  {
    id: "ministry_leader",
    label: "Ministry Leader",
    description: "Manage content for their ministry",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    permissions: [
      "dashboard.view",
      "users.view",
      "content.view",
      "content.create",
      "content.edit",
      "content.publish",
      "media.upload",
      "campaigns.view",
      "analytics.view",
    ],
  },
  {
    id: "member",
    label: "Member",
    description: "Registered church member",
    color: "bg-green-100 text-green-800 border-green-200",
    permissions: [],
  },
  {
    id: "visitor",
    label: "Visitor",
    description: "New or unregistered user",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    permissions: [],
  },
];

const permissionGroups = [
  { label: "Dashboard", permissions: ["dashboard.view"] },
  { label: "Users", permissions: ["users.view", "users.edit", "users.delete"] },
  { label: "Content", permissions: ["content.view", "content.create", "content.edit", "content.delete", "content.publish"] },
  { label: "Media", permissions: ["media.upload", "media.delete"] },
  { label: "Giving", permissions: ["giving.view", "giving.manage"] },
  { label: "Campaigns", permissions: ["campaigns.view", "campaigns.send"] },
  { label: "Settings", permissions: ["settings.view", "settings.edit"] },
  { label: "Analytics", permissions: ["analytics.view"] },
];

export default function RolesPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState<string>("super_admin");

  const currentRole = roles.find((r) => r.id === selectedRole);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield size={24} className="text-[var(--accent)]" />
          Roles & Permissions
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View role permissions and access levels
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-800 font-medium">Role-Based Access Control</p>
          <p className="text-sm text-blue-600 mt-1">
            Permissions are predefined for each role. To change a user&apos;s access level, update their role in the Users section.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users size={18} />
            Roles
          </h2>
          <div className="space-y-2">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-all",
                  selectedRole === role.id
                    ? "border-[var(--accent)] bg-[var(--accent)]/5 ring-2 ring-[var(--accent)]/20"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", role.color)}>
                    {role.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {role.permissions.length} permissions
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{role.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900 mb-4">
            Permissions for <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border ml-1", currentRole?.color)}>{currentRole?.label}</span>
          </h2>

          <div className="space-y-6">
            {permissionGroups.map((group) => (
              <div key={group.label}>
                <h3 className="text-sm font-medium text-gray-700 mb-2">{group.label}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.permissions.map((permId) => {
                    const perm = allPermissions.find((p) => p.id === permId);
                    const hasPermission = currentRole?.permissions.includes(permId);
                    return (
                      <div
                        key={permId}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border",
                          hasPermission
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-200"
                        )}
                      >
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                            hasPermission ? "bg-green-500" : "bg-gray-300"
                          )}
                        >
                          {hasPermission ? (
                            <Check size={14} className="text-white" />
                          ) : (
                            <X size={14} className="text-white" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className={cn("text-sm font-medium", hasPermission ? "text-green-800" : "text-gray-500")}>
                            {perm?.label}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{perm?.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
