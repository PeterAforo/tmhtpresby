import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Thank You for Your Gift",
};

export default function GiveSuccessPage() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center py-16 bg-[var(--bg)]">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--text)] mb-3">
          Thank You!
        </h1>
        <p className="text-[var(--text-muted)] leading-relaxed mb-6">
          Your donation has been processed successfully. A receipt has been
          sent to your email address. May God bless you for your generosity.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
          >
            Return Home
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/give"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] transition-colors"
          >
            Give Again
          </Link>
        </div>
      </div>
    </section>
  );
}
