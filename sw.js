const CACHE = "invest-v1";
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["./", "./index.html", "./manifest.json"])));
});
self.addEventListener("fetch", (e) => {
  if (e.request.url.includes("twelvedata.com")) return; // ne jamais mettre en cache les données live
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
