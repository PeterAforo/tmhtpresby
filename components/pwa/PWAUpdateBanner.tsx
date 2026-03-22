"use client";

import { useServiceWorker } from "@/hooks/useServiceWorker";
import { X, RefreshCw } from "lucide-react";
import { useState } from "react";

export function PWAUpdateBanner() {
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorker();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isUpdateAvailable || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-[var(--accent)]/10 rounded-full flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--text)] text-sm">
              Update Available
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              A new version of TMHT Presby is ready to install.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={updateServiceWorker}
                className="px-3 py-1.5 bg-[var(--accent)] text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Update Now
              </button>
              <button
                onClick={() => setIsDismissed(true)}
                className="px-3 py-1.5 text-[var(--text-muted)] text-xs font-medium hover:text-[var(--text)] transition-colors"
              >
                Later
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="flex-shrink-0 p-1 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
