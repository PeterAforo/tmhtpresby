"use client";

import { useState, useEffect, useCallback } from "react";

interface UseServiceWorkerReturn {
  isUpdateAvailable: boolean;
  isRegistered: boolean;
  registration: ServiceWorkerRegistration | null;
  updateServiceWorker: () => void;
  checkForUpdates: () => Promise<void>;
}

export function useServiceWorker(): UseServiceWorkerReturn {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    // Listen for update events from SW registration
    const handleSwUpdate = (event: CustomEvent<{ registration: ServiceWorkerRegistration }>) => {
      setIsUpdateAvailable(true);
      setRegistration(event.detail.registration);
    };

    window.addEventListener("swUpdate", handleSwUpdate as EventListener);

    // Check if already registered
    navigator.serviceWorker.ready.then((reg) => {
      setIsRegistered(true);
      setRegistration(reg);
    });

    // Listen for controller change (new SW activated)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });

    return () => {
      window.removeEventListener("swUpdate", handleSwUpdate as EventListener);
    };
  }, []);

  const updateServiceWorker = useCallback(() => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
  }, [registration]);

  const checkForUpdates = useCallback(async () => {
    if (registration) {
      await registration.update();
    }
  }, [registration]);

  return {
    isUpdateAvailable,
    isRegistered,
    registration,
    updateServiceWorker,
    checkForUpdates,
  };
}
