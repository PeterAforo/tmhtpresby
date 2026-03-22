// ============================================================
// MHTPC Service Worker
// The Most Holy Trinity Presbyterian Church
// Production-grade PWA with intelligent caching strategies
// ============================================================

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

const { precaching, routing, strategies, expiration, cacheableResponse, backgroundSync } = workbox;

// ─── Cache Configuration ────────────────────────────────────────
const CACHE_VERSION = 'v1';
const APP_SHELL_CACHE = `mhtpc-shell-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `mhtpc-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `mhtpc-images-${CACHE_VERSION}`;
const FONT_CACHE = `mhtpc-fonts-${CACHE_VERSION}`;
const API_CACHE = `mhtpc-api-${CACHE_VERSION}`;

// ─── Core Configuration ─────────────────────────────────────────
workbox.core.skipWaiting();
workbox.core.clientsClaim();

// ─── Precaching ─────────────────────────────────────────────────
// Critical assets that must be available offline
precaching.precacheAndRoute([
  { url: '/', revision: CACHE_VERSION },
  { url: '/offline', revision: CACHE_VERSION },
  { url: '/manifest.json', revision: CACHE_VERSION },
  { url: '/favicon.png', revision: CACHE_VERSION },
  { url: '/logo.png', revision: CACHE_VERSION },
]);

// ─── Navigation Requests (HTML Pages) ───────────────────────────
// Network First with offline fallback
routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new strategies.NetworkFirst({
    cacheName: APP_SHELL_CACHE,
    networkTimeoutSeconds: 3,
    plugins: [
      new cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      new expiration.ExpirationPlugin({ 
        maxEntries: 50, 
        maxAgeSeconds: 24 * 60 * 60 // 1 day
      })
    ]
  })
);

// ─── Static Assets (JS, CSS) ────────────────────────────────────
// Cache First - these are versioned by Next.js build
routing.registerRoute(
  ({ request }) => 
    request.destination === 'script' || 
    request.destination === 'style',
  new strategies.CacheFirst({
    cacheName: APP_SHELL_CACHE,
    plugins: [
      new cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      new expiration.ExpirationPlugin({ 
        maxEntries: 100, 
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      })
    ]
  })
);

// ─── Images ─────────────────────────────────────────────────────
// Cache First with long expiration
routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new strategies.CacheFirst({
    cacheName: IMAGE_CACHE,
    plugins: [
      new cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      new expiration.ExpirationPlugin({ 
        maxEntries: 100, 
        maxAgeSeconds: 60 * 24 * 60 * 60 // 60 days
      })
    ]
  })
);

// ─── Google Fonts ───────────────────────────────────────────────
// Cache First with very long expiration
routing.registerRoute(
  ({ url }) => 
    url.origin === 'https://fonts.googleapis.com' || 
    url.origin === 'https://fonts.gstatic.com',
  new strategies.CacheFirst({
    cacheName: FONT_CACHE,
    plugins: [
      new cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      new expiration.ExpirationPlugin({ 
        maxEntries: 30, 
        maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
      })
    ]
  })
);

// ─── API Calls (GET) ────────────────────────────────────────────
// Network First with cache fallback
routing.registerRoute(
  ({ url, request }) => 
    url.pathname.startsWith('/api/') && 
    request.method === 'GET',
  new strategies.NetworkFirst({
    cacheName: API_CACHE,
    networkTimeoutSeconds: 5,
    plugins: [
      new cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      new expiration.ExpirationPlugin({ 
        maxEntries: 50, 
        maxAgeSeconds: 5 * 60 // 5 minutes
      })
    ]
  })
);

// ─── API Mutations (POST/PUT/DELETE) ────────────────────────────
// Network Only with Background Sync for offline support
const bgSyncPlugin = new backgroundSync.BackgroundSyncPlugin('mhtpc-sync-queue', {
  maxRetentionTime: 24 * 60 // 24 hours
});

routing.registerRoute(
  ({ url, request }) => 
    url.pathname.startsWith('/api/') && 
    ['POST', 'PUT', 'DELETE'].includes(request.method),
  new strategies.NetworkOnly({
    plugins: [bgSyncPlugin]
  }),
  'POST'
);

routing.registerRoute(
  ({ url, request }) => 
    url.pathname.startsWith('/api/') && 
    request.method === 'PUT',
  new strategies.NetworkOnly({
    plugins: [bgSyncPlugin]
  }),
  'PUT'
);

// ─── Offline Fallback ───────────────────────────────────────────
routing.setCatchHandler(async ({ event }) => {
  if (event.request.destination === 'document') {
    return caches.match('/offline') || caches.match('/offline.html');
  }
  return Response.error();
});

// ─── Push Notifications ─────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: 'MHTPC', body: event.data.text() };
  }

  const options = {
    body: data.body || 'You have a new notification',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/icon-96x96.png',
    image: data.image || undefined,
    tag: data.tag || 'mhtpc-notification',
    data: data.data || {},
    actions: data.actions || [],
    vibrate: [100, 50, 100],
    renotify: true,
    requireInteraction: data.requireInteraction || false
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'MHTPC', options)
  );
});

// ─── Notification Click Handler ─────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const deepLink = event.notification.data?.deep_link || '/';
  const action = event.action;

  // Handle action buttons
  if (action === 'dismiss') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(deepLink);
            return client.focus();
          }
        }
        // Open new window if app is not open
        if (clients.openWindow) {
          return clients.openWindow(deepLink);
        }
      })
  );
});

// ─── Notification Close Handler ─────────────────────────────────
self.addEventListener('notificationclose', (event) => {
  // Track dismissed notifications for analytics
  const data = event.notification.data || {};
  console.log('Notification dismissed:', data.type || 'unknown');
});

// ─── Message Handler (from main thread) ─────────────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data?.type === 'CLEAR_CACHE') {
    caches.keys().then((keys) => 
      Promise.all(keys.map((key) => caches.delete(key)))
    );
  }

  if (event.data?.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

// ─── Install Event ──────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('Service Worker installing, version:', CACHE_VERSION);
});

// ─── Activate Event ─────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating, version:', CACHE_VERSION);
  
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => !key.includes(CACHE_VERSION))
          .map((key) => {
            console.log('Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
});
