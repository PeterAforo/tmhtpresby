import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | Admin — MHTPC",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Admin header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-card)] border-b border-[var(--border)] px-4 sm:px-6 lg:px-8 py-3">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider bg-[var(--accent)] text-white px-2 py-0.5 rounded">
              Admin
            </span>
            <span className="font-[family-name:var(--font-heading)] text-sm font-semibold text-[var(--text)]">
              Most Holy Trinity
            </span>
          </div>
          <nav className="flex items-center gap-4 text-sm overflow-x-auto">
            <a
              href="/admin/sermons"
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors whitespace-nowrap"
            >
              Sermons
            </a>
            <a
              href="/admin/giving"
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors whitespace-nowrap"
            >
              Giving
            </a>
            <a
              href="/admin/events"
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors whitespace-nowrap"
            >
              Events
            </a>
            <a
              href="/admin/blog"
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors whitespace-nowrap"
            >
              Blog
            </a>
            <a
              href="/admin/gallery"
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors whitespace-nowrap"
            >
              Gallery
            </a>
            <a
              href="/admin/campaigns"
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors whitespace-nowrap"
            >
              Campaigns
            </a>
            <a
              href="/admin/analytics"
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors whitespace-nowrap"
            >
              Analytics
            </a>
            <span className="w-px h-4 bg-[var(--border)]" />
            <a
              href="/"
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors whitespace-nowrap"
            >
              View Site
            </a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
