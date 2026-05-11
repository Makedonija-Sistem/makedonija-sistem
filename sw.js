/**
 * Македонија-Систем · Service Worker
 * Public MVP 0.1.0
 *
 * Стратегија:
 * - HTML: network-first (за свежи updates), fallback to cache
 * - Static assets: cache-first (за брзина)
 * - Pre-cache само постоечки фајлови
 */

const CACHE_NAME = 'mks-public-mvp-v0.1.0';
const RUNTIME_CACHE = 'mks-runtime';

// Pre-cache само фајлови што се сигурни дека постојат
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/404.html',
  '/assets/icons/icon.svg'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Кеширај по еден фајл за да не падне ако еден недостасува
        return Promise.all(
          PRECACHE_URLS.map((url) => {
            return cache.add(url).catch((err) => {
              console.warn('[SW] Skip caching:', url, err.message);
            });
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event — clean old caches
self.addEventListener('activate', (event) => {
  const validCaches = [CACHE_NAME, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !validCaches.includes(name))
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET
  if (request.method !== 'GET') return;

  // Skip cross-origin
  if (url.origin !== self.location.origin) return;

  // HTML / navigation — network first
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('/404.html') || caches.match('/');
          });
        })
    );
    return;
  }

  // Static assets — cache first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseClone = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone));
        return response;
      }).catch(() => cached);
    })
  );
});

// Message handler
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
