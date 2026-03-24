import { WifiOff } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Offline | The Most Holy Trinity Presbyterian Church",
  description: "You are currently offline.",
};

export default function OfflinePage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
          <WifiOff className="w-10 h-10 text-[var(--accent)]" />
        </div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)] mb-3">
          You&apos;re Offline
        </h1>
        <p className="text-[var(--text-muted)] mb-6">
          It looks like you&apos;ve lost your internet connection. Please check your connection and try again.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
