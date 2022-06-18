const cacheName = 'bread-v0.5.6';
const urlsToCache = [
  // '/',
  // '/static/media/eating_together.964f55d4c88af0548e5eed64357bed2d.svg',
  // '/favicon.ico',
  // '/manifest.json',
  // '/logo192.png',
];

self.addEventListener('install', (event) => {
  console.log('auto installing...');
  self.skipWaiting();
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('cache creating...');
      cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        console.log('old cache deleting...');
        return Promise.all(cacheNames.filter((name) => name !== cacheName).map((name) => caches.delete(name)));
      })
      .then(() => {
        clients.claim();
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
