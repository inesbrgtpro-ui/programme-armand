"use strict";

/* Incrémenter la version à chaque mise à jour de l'app pour forcer le rafraîchissement du cache */
const CACHE = "armand-v3.0.0";

const PRECACHE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-512-maskable.png",
  "icons/apple-touch-icon.png",
  "img/dev-couche-halteres.webp", "img/dc-machine.webp", "img/pompes.webp",
  "img/tractions.webp", "img/tirage-vertical.webp", "img/tractions-assistees.webp",
  "img/dev-epaules-halteres.webp", "img/dev-epaules-machine.webp", "img/elevations-laterales.webp",
  "img/rowing-machine.webp", "img/tirage-horizontal.webp", "img/rowing-haltere.webp",
  "img/curl-halteres.webp", "img/curl-marteau.webp", "img/triceps-poulie.webp",
  "img/presse-inclinee.webp", "img/presse-horizontale.webp",
  "img/fentes-marchees.webp", "img/fentes-bulgares.webp", "img/step-up.webp",
  "img/leg-extension.webp", "img/leg-curl-allonge.webp", "img/leg-curl-assis.webp",
  "img/planche.webp", "img/planche-laterale.webp",
  "img/crunch-poulie.webp", "img/releves-genoux.webp", "img/releves-jambes.webp",
  "img/dev-incline.webp", "img/ecarte-poulie.webp"
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
