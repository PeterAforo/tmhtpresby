"use client";

import { useEffect } from "react";
import { register } from "@/lib/pwa/serviceWorkerRegistration";
import { PWAUpdateBanner } from "./PWAUpdateBanner";
import { PWAInstallButton } from "./PWAInstallButton";
import { NetworkStatusBanner } from "./NetworkStatusBanner";

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker
    register({
      onSuccess: (registration) => {
        console.log("Service Worker registered successfully:", registration.scope);
      },
      onUpdate: (registration) => {
        console.log("New content available, please refresh.");
      },
      onOffline: () => {
        console.log("App is offline");
      },
      onOnline: () => {
        console.log("App is back online");
        // Update last online timestamp
        localStorage.setItem("tmhtpresby-last-online", new Date().toISOString());
      },
    });
  }, []);

  return (
    <>
      {children}
      <NetworkStatusBanner />
      <PWAUpdateBanner />
      <PWAInstallButton />
    </>
  );
}
