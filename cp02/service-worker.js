var CACHE_VERSION = 1;
var CACHE = 'cache-v' + CACHE_VERSION;

self.addEventListener('install', function(event) {
    console.log('The service worker is being installed.');

    // delete old caches
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (CACHE != cacheName) {
                        console.log('Deleting out of date cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );

    // add to caches
    event.waitUntil(precache());
});
self.addEventListener('fetch', function(event) {
    console.log('The service worker is serving the asset.');
    event.respondWith(fromNetwork(event.request, 400).catch(function() {
        return fromCache(event.request);
    }));
});

function precache() {
    return caches.open(CACHE).then(function(cache) {
        return cache.addAll([
            './controlled.html',
            'https://serviceworke.rs/strategy-network-or-cache/asset'
        ]);
    });
}

function fromNetwork(request, timeout) {
    return new Promise(function(fulfill, reject) {
        var timeoutId = setTimeout(reject, timeout);
        fetch(request).then(function(response) {
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
}

function fromCache(request) {
    return caches.open(CACHE).then(function(cache) {
        return cache.match(request).then(function(matching) {
            return matching || Promise.reject('no-match');
        });
    });
}
