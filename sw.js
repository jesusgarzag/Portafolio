/* Service Worker — minimal cache-first for static shell */
const CACHE = 'portfolio-v1';
const SHELL = [
  '/',
  '/index.html',
  '/css/base.css',
  '/css/terminal.css',
  '/css/layout.css',
  '/css/components.css',
  '/css/responsive.css',
  '/js/main.js',
  '/js/terminal.js',
  '/js/i18n.js',
  '/i18n/es.json',
  '/i18n/en.json',
  '/assets/icon.svg',
  '/manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Network first for GitHub API (always fresh)
  if (url.hostname.includes('api.github.com')) return;
  // Cache first for everything else, with network fallback
  e.respondWith(
    caches.match(e.request).then(hit =>
      hit || fetch(e.request).then(res => {
        if (res.ok && url.origin === location.origin) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match('/index.html'))
    )
  );
});
