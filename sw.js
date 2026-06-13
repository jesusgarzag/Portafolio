/* Service Worker — NETWORK-FIRST: el contenido siempre se sirve fresco desde
   la red y la caché solo actúa como respaldo offline. Esto evita el problema
   clásico de "los cambios no se ven hasta hacer Ctrl+Shift+R".
   Sube CACHE (v2, v3, ...) en cada cambio importante para purgar lo viejo. */
const CACHE = 'portfolio-v2';
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
  '/assets/icon-maskable.svg',
  '/manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();            // activa el SW nuevo sin esperar
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())   // toma control de las pestañas abiertas
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Cross-origin (Google Fonts, APIs de GitHub, etc.) va directo a la red.
  if (url.origin !== location.origin) return;

  // NETWORK-FIRST: intenta red, refresca la caché y cae a caché solo si no hay red.
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(e.request).then(hit =>
          hit || (e.request.mode === 'navigate' ? caches.match('/index.html') : undefined)
        )
      )
  );
});
