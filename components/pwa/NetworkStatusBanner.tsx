"use client";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { WifiOff, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

export function NetworkStatusBanner() {
  const { isOnline, isOffline } = useOnlineStatus();
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setWasOffline(true);
    } else if (wasOffline && isOnline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, isOffline, wasOffline]);

  // Show offline banner
  if (isOffline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2 safe-area-top">
        <WifiOff className="w-4 h-4" />
        <span>You&apos;re offline. Some features may be unavailable.</span>
      </div>
    );
  }

  // Show reconnected toast
  if (showReconnected) {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg animate-fadeIn">
        <Wifi className="w-4 h-4" />
        <span>Back online</span>
      </div>
    );
  }

  return null;
}
