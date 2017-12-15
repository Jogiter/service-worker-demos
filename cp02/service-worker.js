var CACHE_VERSION = 1;
var CACHE = 'cache-v' + CACHE_VERSION;
self.addEventListener('install', function(event) {
    console.log('The service worker is being installed.');
    // add to caches
    event.waitUntil(precache());
});

self.addEventListener('activate', function(event) {
    // delete old caches
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (CACHE != cacheName) {
                        console.log('[activate] Deleting out of date cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(fromCache(event.request).catch(function() {
        return fromNetwork(event.request, 400);
    }));
});

function precache() {
    return caches.open(CACHE).then(function(cache) {
        return cache.addAll([
            './',
            './index.html',
            './controlled.html',
            './non-controlled.html',
            './index.js',
            '../images/',
            '../images/fdr.jpg',
            '../images/lm.jpg',
            '../images/qmsht.jpg'
        ]);
    });
}

function fromNetwork(request, timeout) {
    return new Promise(function(fulfill, reject) {
        var timeoutId = setTimeout(reject, timeout);
        fetch(request).then(function(response) {
            clearTimeout(timeoutId);
            console.log('[fetch] Returning from server: ' + request);
            fulfill(response);
        }, reject);
    });
}

function fromCache(request) {
    return caches.open(CACHE).then(function(cache) {
        return cache.match(request).then(function(matching) {
            if (matching) {
                console.log('[fetch] Returning from ServiceWorker cache: ' + request);
                return matching;
            }
            return Promise.reject('no-match');
        });
    });
}
