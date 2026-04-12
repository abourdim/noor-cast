/* NoorCast Service Worker v0.7.158
   Cache-first for app shell, network-first for fonts. */

const CACHE_NAME = 'noorcast-v168';
const APP_SHELL = [
  './',
  './index.html',
  './noorcast.js',
  './style.css',
  './icon.svg',
  './logo.svg',
  './manifest.json',
  './fonts/amiri-400.woff2',
  './fonts/amiri-400-ar.woff2',
  './fonts/amiri-700.woff2',
  './fonts/amiri-700-ar.woff2',
  './fonts/bangers-400.woff2',
  './fonts/orbitron-500-700.woff2',
  './fonts/righteous-400.woff2',
  './fonts/tajawal-400.woff2',
  './fonts/tajawal-400-ar.woff2',
  './fonts/tajawal-500.woff2',
  './fonts/tajawal-500-ar.woff2',
  './fonts/tajawal-700.woff2',
  './fonts/tajawal-700-ar.woff2',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Cache-first for app shell (fonts are now self-hosted, no external requests)
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
