const CACHE = "invest-v2";
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["./", "./index.html", "./manifest.json"])));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  if (e.request.url.includes("twelvedata.com")) return; // jamais mis en cache, données live
  if (e.request.mode === "navigate" || e.request.url.endsWith("index.html") || e.request.url.endsWith("/")) {
    // réseau en priorité pour toujours avoir la dernière version, cache en secours hors-ligne
    e.respondWith(
      fetch(e.request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
