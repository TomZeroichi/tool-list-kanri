const CACHE_NAME = 'tom-ebay-growth-v1-0-0';
const CACHE_PREFIX = 'tom-ebay-growth-';
const OFFLINE_ASSETS = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(caches.open(CACHE_NAME).then(cache => cache.match(req).then(cached => cached || fetch(req).then(response => {
    if (response.ok) { const clone=response.clone(); cache.put(req,clone); }
    return response;
  }))));
});