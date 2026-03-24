"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mic,
  Calendar,
  FileText,
  Image as ImageIcon,
  Megaphone,
  BarChart3,
  PanelTop,
  Users,
  Shield,
  Heart,
  ShoppingBag,
  Church,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Bell,
  FolderOpen,
  Layers,
} from "lucide-react";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Content Management",
    icon: <FileText size={20} />,
    children: [
      { label: "Sermons", href: "/admin/sermons" },
      { label: "Speakers", href: "/admin/speakers" },
      { label: "Blog / News", href: "/admin/blog" },
      { label: "Events", href: "/admin/events" },
      { label: "Gallery", href: "/admin/gallery" },
      { label: "Devotionals", href: "/admin/devotionals" },
      { label: "Page Heroes", href: "/admin/page-heroes" },
    ],
  },
  {
    label: "Pages",
    href: "/admin/pages",
    icon: <Layers size={20} />,
  },
  {
    label: "File Manager",
    href: "/admin/files",
    icon: <FolderOpen size={20} />,
  },
  {
    label: "Ministries",
    href: "/admin/ministries",
    icon: <Church size={20} />,
  },
  {
    label: "Giving & Finance",
    icon: <Heart size={20} />,
    children: [
      { label: "Donations", href: "/admin/giving" },
      { label: "Campaigns", href: "/admin/campaigns" },
    ],
  },
  {
    label: "Shop",
    href: "/admin/products",
    icon: <ShoppingBag size={20} />,
  },
  {
    label: "User Management",
    icon: <Users size={20} />,
    children: [
      { label: "All Users", href: "/admin/users" },
      { label: "Roles & Permissions", href: "/admin/roles" },
    ],
  },
  {
    label: "Communications",
    icon: <Megaphone size={20} />,
    children: [
      { label: "Notifications", href: "/admin/notifications" },
      { label: "Newsletter", href: "/admin/newsletter" },
      { label: "Contact Messages", href: "/admin/contacts" },
      { label: "Prayer Requests", href: "/admin/prayer-requests" },
    ],
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: <BarChart3 size={20} />,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings size={20} />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Content Management"]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const isParentActive = (children?: { label: string; href: string }[]) => {
    if (!children) return false;
    return children.some((child) => pathname.startsWith(child.href));
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-[#2a3441]">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
            <Image
              src="/images/logo.png"
              alt="TMHT"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-white font-bold text-sm leading-tight">
              TMHT Presby
            </h1>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isParentActive(item.children)
                        ? "bg-[var(--accent)] text-white"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {item.icon}
                      {item.label}
                    </span>
                    {expandedItems.includes(item.label) ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                  {expandedItems.includes(item.label) && (
                    <ul className="mt-1 ml-4 pl-4 border-l border-[#2a3441] space-y-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive(child.href)
                                ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href!}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href!)
                      ? "bg-[var(--accent)] text-white"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#2a3441]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <ExternalLink size={16} />
          View Website
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1a2332] text-white shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1a2332] flex flex-col z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-1 rounded text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>
    </>
  );
}
