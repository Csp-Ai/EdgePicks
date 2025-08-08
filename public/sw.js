const CACHE_NAME = 'demo-run-agents';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname === '/api/run-agents') {
    event.respondWith(handleRunAgents());
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
