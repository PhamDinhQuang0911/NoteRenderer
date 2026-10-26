const CACHE_NAME = 'noterenderer-pwa-v063-merged-v4';
const PRECACHE_ASSETS = [
  './favicon.png',
  './manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // For navigation requests (e.g. ?classId=...), network first, fallback to root/index.html
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(async () => {
        return (await caches.match('./index.html')) || (await caches.match('./')) || new Response('Offline', { status: 503 });
      })
    );
    return;
  }

  // Network first for JS and CSS to guarantee fresh code
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    e.respondWith(
      fetch(e.request).catch(async () => {
        return (await caches.match(e.request)) || new Response('', { status: 404 });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request).catch(() => new Response('', { status: 404 })))
  );
});
