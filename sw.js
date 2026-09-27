const CACHE = 'portfolio-v4-3';
const SHELL = [
  '/',
  '/index.html',
  '/css/base.css',
  '/css/layout.css',
  '/css/components.css',
  '/css/player.css',
  '/css/terminal.css',
  '/css/responsive.css',
  '/js/vendor/gsap.min.js',
  '/js/vendor/ScrollTrigger.min.js',
  '/js/vendor/MotionPathPlugin.min.js',
  '/js/vendor/DrawSVGPlugin.min.js',
  '/js/vendor/SplitText.min.js',
  '/js/vendor/ScrambleTextPlugin.min.js',
  '/js/vendor/CustomEase.min.js',
  '/js/data.js',
  '/js/i18n.js',
  '/js/guilloche.js',
  '/js/player.js',
  '/js/scenes/tesoreria.js',
  '/js/scenes/edi.js',
  '/js/scenes/cfdi.js',
  '/js/scenes/imss.js',
  '/js/scenes/ptu.js',
  '/js/scenes/banxico.js',
  '/js/scenes/sepomex.js',
  '/js/main.js',
  '/js/terminal.js',
  '/i18n/es.json',
  '/i18n/en.json',
  '/assets/icon.svg',
  '/assets/icon-maskable.svg',
  '/assets/icon-192.png',
  '/assets/vcard-qr.svg',
  '/manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.endsWith('.mp4') || url.pathname.endsWith('.pdf')) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(e.request).then((hit) => hit || (e.request.mode === 'navigate' ? caches.match('/index.html') : undefined))
      )
  );
});
