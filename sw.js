"use strict";

/* Incrémenter la version à chaque mise à jour de l'app pour forcer le rafraîchissement du cache */
const CACHE = "armand-v2.2.0";

const PRECACHE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-512-maskable.png",
  "icons/apple-touch-icon.png",
  "img/upper-0.webp", "img/upper-1.webp", "img/upper-2.webp",
  "img/upper-3.webp", "img/upper-4.webp",
  "img/lower-0.webp", "img/lower-1.webp", "img/lower-2.webp",
  "img/lower-3.webp", "img/lower-4.webp",
  "img/full-0.webp", "img/full-1.webp", "img/full-2.webp",
  "img/full-3.webp", "img/full-4.webp"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (url.origin !== self.location.origin && !isFont) return;

  /* Cache d'abord, réseau en secours (et mise en cache au passage) :
     l'app doit marcher dans une salle de sport sans réseau */
  e.respondWith(
    caches.match(req, { ignoreSearch: url.origin === self.location.origin }).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && (res.ok || res.type === "opaque")) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
