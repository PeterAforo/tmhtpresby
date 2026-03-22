/**
 * Service Worker Registration Module
 * Handles SW registration, updates, and lifecycle events
 */

type SWConfig = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onOffline?: () => void;
  onOnline?: () => void;
};

const isLocalhost = Boolean(
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))
);

export function register(config?: SWConfig): void {
  if (typeof window === 'undefined') return;
  
  // Only register in production or on localhost
  if (process.env.NODE_ENV !== 'production' && !isLocalhost) {
    console.log('Service Worker registration skipped in development');
    return;
  }

  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported');
    return;
  }

  window.addEventListener('load', () => {
    const swUrl = '/sw.js';
    registerValidSW(swUrl, config);
  });

  // Online/offline event handlers
  if (config?.onOffline) {
    window.addEventListener('offline', config.onOffline);
  }
  if (config?.onOnline) {
    window.addEventListener('online', config.onOnline);
  }
}

async function registerValidSW(swUrl: string, config?: SWConfig): Promise<void> {
  try {
    const registration = await navigator.serviceWorker.register(swUrl, {
      scope: '/',
    });

    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000); // Check every hour

    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      if (!installingWorker) return;

      installingWorker.onstatechange = () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // New content available
            console.log('New content available; please refresh.');
            
            // Dispatch custom event for UI to handle
            window.dispatchEvent(new CustomEvent('swUpdate', { 
              detail: { registration } 
            }));
            
            config?.onUpdate?.(registration);
          } else {
            // Content cached for offline use
            console.log('Content cached for offline use.');
            config?.onSuccess?.(registration);
          }
        }
      };
    };

    // Initial success callback
    if (registration.active) {
      config?.onSuccess?.(registration);
    }
  } catch (error) {
    console.error('Error during service worker registration:', error);
  }
}

export function unregister(): void {
  if (typeof window === 'undefined') return;
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error('Error unregistering service worker:', error);
      });
  }
}

export async function checkForUpdates(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
  }
}

export function skipWaiting(): void {
  if (typeof window === 'undefined') return;
  
  navigator.serviceWorker.ready.then((registration) => {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  });
}

export function clearCache(): void {
  if (typeof window === 'undefined') return;
  
  navigator.serviceWorker.ready.then((registration) => {
    if (registration.active) {
      registration.active.postMessage({ type: 'CLEAR_CACHE' });
    }
  });
}
