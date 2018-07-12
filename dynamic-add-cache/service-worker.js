var CACHE_VERSION = 1;
var CACHENAME = 'dynamic-cache-v' + CACHE_VERSION;

self.addEventListener('install', function (event) {
  console.log('activate');
  console.log(event);
  // event.waitUntil(precahe());
});

self.addEventListener('activate', function (event) {
  console.log('activate');
  console.log(event);
})

function precache() {
  
}
