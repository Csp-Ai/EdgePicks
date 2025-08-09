const CACHE_NAME = 'edgepicks-cache-v1';
const APP_SHELL = ['/'];

// Precache the app shell so the basic UI works offline
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Serve cached content when offline and keep cache updated when online
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname === '/api/run-agents') {
    event.respondWith(handleRunAgents());
    return;
  }

  // For navigation requests, try network first, fall back to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/'))
    );
    return;
  }

  // Cache-first strategy for same-origin GET requests
  if (event.request.method === 'GET' && url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request)
          .then((resp) => {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            return resp;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});

async function handleRunAgents() {
  const cache = await caches.open(CACHE_NAME);
  let resp = await cache.match('/fixtures/demo/agent-events.json');
  if (!resp) {
    resp = await fetch('/fixtures/demo/agent-events.json');
    await cache.put('/fixtures/demo/agent-events.json', resp.clone());
  }
  const data = await resp.json();
  const stream = new ReadableStream({
    start(controller) {
      for (const ev of data.events) {
        controller.enqueue(`data: ${JSON.stringify(ev)}\n\n`);
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
