const CACHE_NAME = "konfigurator-reziva-v2";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_FILES);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  // TEST 10O: Native HTTP-style download response for the installed PWA.
  const downloadUrl = new URL(event.request.url);
  if (event.request.method === "GET" && downloadUrl.origin === self.location.origin &&
      downloadUrl.pathname.endsWith("/__pz_local_backup_download__")) {
    const id = downloadUrl.searchParams.get("id");
    const entry = self.__pzBackupDownloads && self.__pzBackupDownloads.get(id);
    if (!entry) {
      event.respondWith(new Response("Záloha vypršela. Připravte ji znovu.", {status:410}));
      return;
    }
    event.respondWith(new Response(entry.json, {
      status:200,
      headers:{"Content-Type":"application/json; charset=utf-8",
        "Content-Disposition":"attachment; filename=\"" + entry.filename + "\"",
        "Cache-Control":"no-store"}
    }));
    setTimeout(() => self.__pzBackupDownloads?.delete(id), 120000);
    return;
  }
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, copy);
          });
        }

        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});


// TEST 10O: Temporary, in-memory backup payload. Never touches local data or caches.
self.addEventListener("message", event => {
 if (event.data?.type !== "PZ_BACKUP_PREPARE_10O") return;
 const port=event.ports?.[0];
 try {
  const {id,json,filename}=event.data;
  if(typeof id!=="string" || !/^[a-zA-Z0-9-]+$/.test(id) ||
     typeof json!=="string" || typeof filename!=="string" ||
     !/^Pila_Zeleznice_MISTNI_Zaloha_[0-9-]+\.json$/.test(filename)) throw Error("Neplatná data zálohy");
  self.__pzBackupDownloads ||= new Map();
  self.__pzBackupDownloads.set(id,{json,filename});
  port?.postMessage({ok:true});
 } catch(err) {port?.postMessage({ok:false,name:err.name,message:err.message});}
});
