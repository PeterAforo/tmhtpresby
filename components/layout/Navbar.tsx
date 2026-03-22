"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Sun, Moon, User, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { getTheme, setTheme, type Theme } from "@/lib/theme";
import type { NavItem } from "@/types";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>("light");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  // Navbar always has white background now - no transparent state
  const isOverHero = false; // Always use solid background styling

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setCurrentTheme(getTheme());
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleTheme = useCallback(() => {
    const next: Theme = currentTheme === "dark" ? "light" : "dark";
    setTheme(next);
    setCurrentTheme(next);
  }, [currentTheme]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-white dark:bg-[var(--nav-bg)] border-b border-[var(--border)]",
        scrolled && "shadow-sm"
      )}
    >
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            aria-label="Home"
          >
            <Image
              src="/logo.png"
              alt="Presbyterian Church of Ghana Logo"
              width={44}
              height={52}
              className="shrink-0"
              priority
            />
            <div className="hidden sm:block">
              <span
                className={cn(
                  "font-[family-name:var(--font-heading)] text-lg font-bold leading-tight transition-colors duration-300",
                  isOverHero ? "text-white" : "text-[var(--nav-text)]"
                )}
              >
                The Most Holy Trinity
              </span>
              <span
                className={cn(
                  "block text-xs leading-none -mt-0.5 transition-colors duration-300",
                  isOverHero ? "text-white/60" : "text-[var(--text-muted)]"
                )}
              >
                Presbyterian Church
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLinkDesktop
                key={item.href}
                item={item}
                isActive={isActive(item.href)}
                isOpen={openDropdown === item.label}
                isOverHero={isOverHero}
                onMouseEnter={() =>
                  item.subItems
                    ? handleDropdownEnter(item.label)
                    : setOpenDropdown(null)
                }
                onMouseLeave={handleDropdownLeave}
              />
            ))}
          </div>

          {/* Right side: theme toggle + CTA + hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-full transition-colors duration-200",
                isOverHero
                  ? "text-white/70 hover:text-white hover:bg-white/10"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--text)]/5"
              )}
              aria-label={`Switch to ${currentTheme === "dark" ? "light" : "dark"} mode`}
            >
              {currentTheme === "dark" ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>

            {session?.user ? (
              <Link
                href="/profile"
                className={cn(
                  "hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200",
                  isOverHero
                    ? "bg-white/15 text-white border border-white/20 hover:bg-white/25"
                    : "bg-[var(--accent)] text-white hover:opacity-90"
                )}
              >
                <User size={16} />
                My Account
              </Link>
            ) : (
              <Link
                href="/login"
                className={cn(
                  "hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200",
                  isOverHero
                    ? "bg-white/15 text-white border border-white/20 hover:bg-white/25"
                    : "bg-[var(--accent)] text-white hover:opacity-90"
                )}
              >
                <LogIn size={16} />
                Sign In
              </Link>
            )}

            <button
              className={cn(
                "lg:hidden p-2 rounded-md transition-colors",
                isOverHero
                  ? "text-white hover:bg-white/10"
                  : "text-[var(--text)] hover:bg-[var(--text)]/5"
              )}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-[var(--bg)] overflow-y-auto">
          <div className="px-4 py-6 space-y-1">
            {NAV_ITEMS.map((item) => (
              <MobileNavLink
                key={item.href}
                item={item}
                isActive={isActive(item.href)}
              />
            ))}
            <div className="pt-4 space-y-2">
              {session?.user ? (
                <Link
                  href="/profile"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-md text-base font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
                >
                  <User size={18} />
                  My Account
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-md text-base font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
                >
                  <LogIn size={18} />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─── Desktop nav item ─── */

function NavLinkDesktop({
  item,
  isActive,
  isOpen,
  isOverHero,
  onMouseEnter,
  onMouseLeave,
}: {
  item: NavItem;
  isActive: boolean;
  isOpen: boolean;
  isOverHero: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const hasDropdown = item.subItems && item.subItems.length > 0;

  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        className={cn(
          "inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
          isOverHero
            ? isActive
              ? "text-[#3DA066]"
              : "text-white/85 hover:text-white hover:bg-white/10"
            : isActive
              ? "text-[var(--accent)] bg-[var(--accent)]/10"
              : "text-[var(--text)] hover:text-[var(--accent)] hover:bg-[var(--text)]/5"
        )}
      >
        {item.label}
        {hasDropdown && (
          <ChevronDown
            size={14}
            className={cn(
              "transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        )}
      </Link>

      {/* Dropdown panel */}
      {hasDropdown && isOpen && (
        <div className="absolute top-full left-0 pt-1 min-w-[220px]">
          <div className="bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border)] py-2">
            {item.subItems!.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                className="block px-4 py-2.5 hover:bg-[var(--text)]/5 transition-colors"
              >
                <span className="block text-sm font-medium text-[var(--text)]">
                  {sub.label}
                </span>
                {sub.description && (
                  <span className="block text-xs text-[var(--text-muted)] mt-0.5">
                    {sub.description}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Mobile nav item ─── */

function MobileNavLink({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasDropdown = item.subItems && item.subItems.length > 0;

  return (
    <div>
      <div className="flex items-center">
        <Link
          href={item.href}
          className={cn(
            "flex-1 px-3 py-3 text-base font-medium rounded-md transition-colors min-h-[44px] flex items-center",
            isActive
              ? "text-[var(--accent)] bg-[var(--accent)]/10"
              : "text-[var(--text)] hover:bg-[var(--text)]/5"
          )}
        >
          {item.label}
        </Link>
        {hasDropdown && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-3 text-[var(--text-muted)] hover:text-[var(--text)]"
            aria-label={`Expand ${item.label} submenu`}
          >
            <ChevronDown
              size={16}
              className={cn(
                "transition-transform duration-200",
                expanded && "rotate-180"
              )}
            />
          </button>
        )}
      </div>

      {hasDropdown && expanded && (
        <div className="pl-6 pb-2 space-y-1">
          {item.subItems!.map((sub) => (
            <Link
              key={sub.href}
              href={sub.href}
              className="block px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] rounded-md hover:bg-[var(--text)]/5"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
