const CACHE_NAME = "ebook-library-v4";

const LOCAL_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./app-icon.svg"
];

const READER_FILES = [
  "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js",
  "https://cdn.jsdelivr.net/npm/epubjs@0.3.93/dist/epub.min.js"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(LOCAL_FILES);

    await Promise.allSettled(
      READER_FILES.map(async url => {
        try {
          const response = await fetch(url);
          if (response && response.ok) {
            await cache.put(url, response.clone());
          }
        } catch (error) {
          console.warn("Could not cache:", url, error);
        }
      })
    );

    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();

    await Promise.all(
      names.map(name => {
        if (name !== CACHE_NAME) {
          return caches.delete(name);
        }
      })
    );

    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(event.request);
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, response.clone());
        return response;
      } catch (error) {
        return (
          await caches.match(event.request)
        ) || (
          await caches.match("./index.html")
        );
      }
    })());

    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;

    try {
      const response = await fetch(event.request);

      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, response.clone());
      }

      return response;
    } catch (error) {
      return new Response("Offline", {
        status: 503,
        statusText: "Offline"
      });
    }
  })());
});
        );


        await Promise.allSettled(

          READER_FILES.map(
            async url => {

              try {

                const response =
                  await fetch(url);


                if (
                  response.ok
                ) {

                  await cache.put(
                    url,
                    response.clone()
                  );

                }

              }

              catch(error) {

                console.warn(
                  "Could not cache:",
                  url
                );

              }

            }
          )

        );


        await self.skipWaiting();

      })()

    );

  }
);


/* ACTIVATE */

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      (async () => {

        const names =
          await caches.keys();


        await Promise.all(

          names.map(
            name => {

              if (
                name !== CACHE_NAME
              ) {

                return caches.delete(
                  name
                );

              }

            }
          )

        );


        await self.clients.claim();

      })()

    );

  }
);


/* FETCH */

self.addEventListener(
  "fetch",
  event => {

    if (
      event.request.method !==
      "GET"
    ) {

      return;

    }


    /*
      HTML navigation:
      internet first,
      cache if offline.
    */

    if (
      event.request.mode ===
      "navigate"
    ) {

      event.respondWith(

        (async () => {

          try {

            const response =
              await fetch(
                event.request
              );


            const cache =
              await caches.open(
                CACHE_NAME
              );


            await cache.put(
              event.request,
              response.clone()
            );


            return response;

          }

          catch(error) {

            return (
              await caches.match(
                event.request
              )
            )
            ||
            (
              await caches.match(
                "./index.html"
              )
            );

          }

        })()

      );


      return;

    }


    /*
      JS, icons and other assets:
      cached copy first.
    */

    event.respondWith(

      (async () => {

        const cached =
          await caches.match(
            event.request
          );


        if (cached) {

          return cached;

        }


        try {

          const response =
            await fetch(
              event.request
            );


          const cache =
            await caches.open(
              CACHE_NAME
            );


          if (
            response.ok
          ) {

            await cache.put(
              event.request,
              response.clone()
            );

          }


          return response;

        }

        catch(error) {

          return new Response(
            "Offline",
            {
              status: 503,
              statusText: "Offline"
            }
          );

        }

      })()

    );

  }
);
