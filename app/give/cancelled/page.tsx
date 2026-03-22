import type { Metadata } from "next";
import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Donation Cancelled",
};

export default function GiveCancelledPage() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center py-16 bg-[var(--bg)]">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-[var(--text-muted)]/10 flex items-center justify-center">
          <XCircle size={40} className="text-[var(--text-muted)]" />
        </div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--text)] mb-3">
          Donation Cancelled
        </h1>
        <p className="text-[var(--text-muted)] leading-relaxed mb-6">
          Your donation was not completed. No charges were made. You can try
          again whenever you&apos;re ready.
        </p>
        <Link
          href="/give"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
        >
          <ArrowLeft size={16} />
          Back to Giving
        </Link>
      </div>
    </section>
  );
}
