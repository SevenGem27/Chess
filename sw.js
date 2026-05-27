const CACHE_NAME = 'chess-pwa-v4';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  
  // 1. Librerie
  'https://code.jquery.com/jquery-3.5.1.min.js',
  'https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css',
  'https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js',
  
  // 2. Immagini (Bianchi)
  'https://chessboardjs.com/img/chesspieces/wikipedia/wP.png',
  'https://chessboardjs.com/img/chesspieces/wikipedia/wN.png',
  'https://chessboardjs.com/img/chesspieces/wikipedia/wB.png',
  'https://chessboardjs.com/img/chesspieces/wikipedia/wR.png',
  'https://chessboardjs.com/img/chesspieces/wikipedia/wQ.png',
  'https://chessboardjs.com/img/chesspieces/wikipedia/wK.png',
  
  // 3. Immagini (Neri)
  'https://chessboardjs.com/img/chesspieces/wikipedia/bP.png',
  'https://chessboardjs.com/img/chesspieces/wikipedia/bN.png',
  'https://chessboardjs.com/img/chesspieces/wikipedia/bB.png',
  'https://chessboardjs.com/img/chesspieces/wikipedia/bR.png',
  'https://chessboardjs.com/img/chesspieces/wikipedia/bQ.png',
  'https://chessboardjs.com/img/chesspieces/wikipedia/bK.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
