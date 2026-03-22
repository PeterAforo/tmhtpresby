"use client";

import { useState, useEffect, useCallback } from "react";

interface UseOnlineStatusReturn {
  isOnline: boolean;
  isOffline: boolean;
  lastOnlineAt: Date | null;
}

const LAST_ONLINE_KEY = "tmhtpresby-last-online";

export function useOnlineStatus(): UseOnlineStatusReturn {
  const [isOnline, setIsOnline] = useState(true);
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize with current status
    setIsOnline(navigator.onLine);

    // Load last online timestamp
    const stored = localStorage.getItem(LAST_ONLINE_KEY);
    if (stored) {
      setLastOnlineAt(new Date(stored));
    }

    const handleOnline = () => {
      setIsOnline(true);
      const now = new Date();
      setLastOnlineAt(now);
      localStorage.setItem(LAST_ONLINE_KEY, now.toISOString());
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Update last online timestamp periodically when online
    const interval = setInterval(() => {
      if (navigator.onLine) {
        const now = new Date();
        setLastOnlineAt(now);
        localStorage.setItem(LAST_ONLINE_KEY, now.toISOString());
      }
    }, 60000); // Every minute

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    lastOnlineAt,
  };
}
