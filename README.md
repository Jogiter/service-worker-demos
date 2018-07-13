# serviceWoker

>Service workers 本质上充当Web应用程序与浏览器之间的代理服务器，也可以在网络可用时作为浏览器和网络间的代理。它们旨在（除其他之外）使得能够创建有效的离线体验，拦截网络请求并基于网络是否可用以及更新的资源是否驻留在服务器上来采取适当的动作。他们还允许访问推送通知和后台同步API。
**浏览器兼容性**

+ [浏览器兼容性](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7)
+ [ is Serviceworker ready](https://jakearchibald.github.io/isserviceworkerready/)

## [使用前的设置](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers#%E4%BD%BF%E7%94%A8%E5%89%8D%E7%9A%84%E8%AE%BE%E7%BD%AE)

在已经支持 serivce workers 的浏览器的版本中，很多特性没有默认开启。如果你发现示例代码在代当前版本的浏览器中怎么样都无法正常运行，你可能需要开启一下浏览器的相关配置：

+ Firefox Nightly: 访问 about:config 并设置 dom.serviceWorkers.enabled 的值为 true; 重启浏览器；
+ Chrome Canary: 访问 chrome://flags 并开启 experimental-web-platform-features; 重启浏览器 (注意：有些特性在Chrome中没有默认开放支持)；
+ Opera: 访问 opera://flags 并开启 ServiceWorker 的支持; 重启浏览器。 

另外，你需要通过 `HTTPS` 来访问你的页面 — 出于安全原因，`Service Workers` 要求必须在 HTTPS 下才能运行。`Github` 是个用来测试的好地方，因为它就支持 `HTTPS`。为了便于本地开发，`localhost` 也被浏览器认为是安全源。

## Service workers使用场景

+   后台数据同步
+   响应来自其它源的资源请求
+   集中接收计算成本高的数据更新，比如地理位置和陀螺仪信息，这样多个页面就可以利用同一组数据
+   在客户端进行CoffeeScript，LESS，CJS/AMD等模块编译和依赖管理（用于开发目的）
+   后台服务钩子
+   自定义模板用于特定URL模式
+   性能增强，比如预取用户可能需要的资源，比如相册中的后面数张图片

未来service workers能够用来做更多使web平台接近原生应用的事。 值得关注的是，其他标准也能并且将会使用service worker，例如:

+   后台同步：启动一个service worker即使没有用户访问特定站点，也可以更新缓存
+   响应推送：启动一个service worker向用户发送一条信息通知新的内容可用
+   对时间或日期作出响应
+   进入地理栅栏



## 安全源

至少符合以下几种模式之一：

- (https, *, *)
- (wss, *, *)
- (*, localhost, *)M
- (*, 127/8, *)
- (*, ::1/128, *)
- (file, *, —)
- (chrome-extension, *, —)

## 如何使应用离线访问

>添加缓存时，主要不要遗漏 './'，否则页面无法离线工作。

```js
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
      console.log(cacheNames);
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
      './', // this is needed if you want it work offline
      './index.html',
      './controlled.html',
      './non-controlled.html',
      '../images/lm.jpg',
      './index.js',
    ]);
  });
}

function fromNetwork(request, timeout) {
  return new Promise(function(fulfill, reject) {
    var timeoutId = setTimeout(reject, timeout);
    fetch(request).then(function(response) {
      clearTimeout(timeoutId);
      console.log('[fetch] Returning from server: ' + request.url);
      // add it to cache
      fulfill(response);
    }, reject);
  });
}

function fromCache(request) {
  return caches.open(CACHE).then(function(cache) {
    return cache.match(request).then(function(matching) {
      if (matching) {
        console.log('[fetch] Returning from ServiceWorker cache: ' + request.url);
        return matching;
      }
      return Promise.reject('no-match');
    });
  });
}
```

## 如何更新缓存文件

```javascript
function fromNetwork(request, timeout) {
    return new Promise(function(fulfill, reject) {
        var timeoutId = setTimeout(reject, timeout);
        fetch(request).then(function(response) {
            return caches.open(CACHE).then(function(cache) {
                return cache.put(request, response.clone()).then(function() {
                    clearTimeout(timeoutId);
                    console.log('[fetch] Returning from server: ' + request.url);
                    return fulfill(response);
                })
            })
        }, reject);
    });
}

function fromCache(request) {
    return caches.open(CACHE).then(function(cache) {
        return cache.match(request).then(function(matching) {
            if (matching) {
                console.log('[fetch] Returning from ServiceWorker cache: ' + request.url);
                return matching;
            }
            return Promise.reject('no-match');
        });
    });
}

// On fetch, use cache but update the entry with the latest contents from the server.
self.addEventListener('fetch', function(event) {
    // fetch from the cache, once intalled, there is nothing in the cache, then fetch from network
    event.respondWith(fromCache(event.request).catch(function() {
        return fromNetwork(event.request, 400);
    }));

    // update request with the new response
    event.waitUntil(fromNetwork(event.request, 400).then(refresh));
});
```

## 动态更新缓存

[demo](https://googlechrome.github.io/samples/service-worker/window-caches/index.html)

>动态添加部分或者全部缓存，应用都将无法离线访问

```js
var CACHE_NAME = 'window-cache-v1';

// This uses window.fetch() (https://developers.google.com/web/updates/2015/03/introduction-to-fetch)
// to retrieve a Response from the network, and store it in the named cache.
// In some cases, cache.add() can be used instead of the fetch()/cache.put(),
// but only if we know that the resource we're fetching supports CORS.
// cache.add() will fail when the response status isn't 200, and when CORS isn't
// supported, the response status is always 0.
// (See https://github.com/w3c/ServiceWorker/issues/823).
function addUrlToCache(url) {
  window.fetch(url, {mode: 'no-cors'}).then(function(response) {
    caches.open(CACHE_NAME).then(function(cache) {
      cache.put(url, response).then(showList);
    });
  }).catch(function(error) {
    ChromeSamples.setStatus(error);
  });
}

function showCacheList() {
  // All the Cache Storage API methods return Promises. If you're not familiar
  // with them, see http://www.html5rocks.com/en/tutorials/es6/promises/
  // Here, we're iterating over all the available caches, and for each cache,
  // iterating over all the entries, adding each to the list.
  window.caches.keys().then(function(cacheNames) {
    cacheNames.forEach(function(cacheName) {
      window.caches.open(cacheName).then(function(cache) {
        return cache.keys();
      }).then(function(requests) {
        requests.forEach(function(request) {
          addRequestToList(cacheName, request);
        });
      });
    });
  });
}

// Given a cache name and URL, removes the cached entry.
function removeCache(cacheName, url) {
  return window.caches.open(cacheName).then(function(cache) {
    return cache.delete(url);
  });
}
```


## [Fill an area with an Iframe 100%](https://stackoverflow.com/questions/26436399/bootstrap-3-fill-an-area-with-an-iframe-100)

```html
<style>
iframe {
  width: 100%;
}
</style>
<iframe src="" frameborder="0" allowfullscreen></iframe>
```

## 

## read-links

+ [Service Worker 简介](https://developers.google.com/web/fundamentals/primers/service-workers/)
+ [ServiceWorker-MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/ServiceWorker#方法)
+ tool: chrome 中访问 `chrome://serviceworker-internals/`
+ [serviceworke](https://serviceworke.rs/strategy-cache-only_service-worker_doc.html)
+ [Google service-worker samples](https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker). view [samples ](https://googlechrome.github.io/samples/service-worker/)
+ [deanhume:progressive-web-apps-book](https://github.com/deanhume/progressive-web-apps-book)
+ [serviceworker-cookbook](https://github.com/mozilla/serviceworker-cookbook)
+ [your-first-pwapp](https://codelabs.developers.google.com/codelabs/your-first-pwapp)
+ [push-notifications](https://developers.google.com/web/fundamentals/codelabs/push-notifications/)
