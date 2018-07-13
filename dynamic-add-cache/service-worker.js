var CACHE_VERSION = 1;
var CACHENAME = 'dynamic-cache-v' + CACHE_VERSION;

self.addEventListener('install', function (event) {
  console.log('activate');
  console.log(event);
  event.waitUntil(precache());
});

self.addEventListener('fetch', function(event) {
  event.respondWith(fromCache(event.request).catch(function() {
    return fromNetwork(event.request, 400);
  }));
});

function precache() {
  return caches.open(CACHENAME).then(function (cache) {
    return cache.addAll([
      './',
      './index.html'
    ])
  })
}

function fromNetwork(request, timeout) {
  return new Promise(function(fulfill, reject) {
    var timeoutId = setTimeout(reject, timeout);
    fetch(request).then(function(response) {
      clearTimeout(timeoutId);
      console.log('[fetch] Returning from server: ' + request.url);
      // precache();
      fulfill(response);
    }, reject);
  });
}

function fromCache(request) {
  return caches.open(CACHENAME).then(function(cache) {
    return cache.match(request).then(function(matching) {
      if (matching) {
        console.log('[fetch] Returning from ServiceWorker cache: ' + request.url);
        return matching;
      }
      return Promise.reject('no-match');
    });
  });
}
