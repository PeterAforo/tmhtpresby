"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download, X, Share, Plus } from "lucide-react";
import { useState } from "react";

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, promptInstall, dismissInstall } = usePWAInstall();
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Show iOS instructions modal
  if (isIOS && showIOSInstructions) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4">
        <div className="bg-[var(--bg-card)] rounded-t-2xl w-full max-w-md animate-slideUp">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text)]">
                Install MHTPC
              </h3>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[var(--accent)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[var(--accent)]">1</span>
                </div>
                <div>
                  <p className="text-sm text-[var(--text)]">
                    Tap the <Share className="w-4 h-4 inline mx-1" /> Share button at the bottom of your browser
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[var(--accent)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[var(--accent)]">2</span>
                </div>
                <div>
                  <p className="text-sm text-[var(--text)]">
                    Scroll down and tap <Plus className="w-4 h-4 inline mx-1" /> <strong>Add to Home Screen</strong>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[var(--accent)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[var(--accent)]">3</span>
                </div>
                <div>
                  <p className="text-sm text-[var(--text)]">
                    Tap <strong>Add</strong> in the top right corner
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full mt-6 py-3 bg-[var(--accent)] text-white font-medium rounded-lg"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show install prompt for iOS
  if (isIOS) {
    return (
      <button
        onClick={() => setShowIOSInstructions(true)}
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 px-4 py-3 bg-[var(--accent)] text-white rounded-full shadow-lg hover:opacity-90 transition-opacity"
      >
        <Download className="w-5 h-5" />
        <span className="font-medium text-sm">Install App</span>
      </button>
    );
  }

  // Show install prompt for Android/Desktop
  if (!isInstallable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-xl flex items-center justify-center">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--text)]">
              Install MHTPC
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              Add to your home screen for quick access to sermons, events, and more.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={promptInstall}
                className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Install
              </button>
              <button
                onClick={dismissInstall}
                className="px-4 py-2 text-[var(--text-muted)] text-sm font-medium hover:text-[var(--text)] transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
          <button
            onClick={dismissInstall}
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
