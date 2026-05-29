const CACHE_NAME = 'chess-pwa-v18'; // Versione aggiornata per forzare il ricaricamento
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './stockfish.js' // IL NOSTRO NUOVO MOTORE
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // --- IL LASCIAPASSARE PER L'INTELLIGENZA ARTIFICIALE ---
  // Se la richiesta è un upload (POST) o è diretta a Roboflow, il Service Worker si fa da parte
  if (event.request.method !== 'GET' || event.request.url.includes('roboflow.com')) {
    return; 
  }

  // Comportamento standard per tutto il resto dell'app (funzionamento offline)
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
