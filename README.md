# serviceWoker

>Service workers 本质上充当Web应用程序与浏览器之间的代理服务器，也可以在网络可用时作为浏览器和网络间的代理。它们旨在（除其他之外）使得能够创建有效的离线体验，拦截网络请求并基于网络是否可用以及更新的资源是否驻留在服务器上来采取适当的动作。他们还允许访问推送通知和后台同步API。
**浏览器兼容性**

+ [浏览器兼容性](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7)
+ [ is Serviceworker ready](https://jakearchibald.github.io/isserviceworkerready/)

[使用前的设置](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers#%E4%BD%BF%E7%94%A8%E5%89%8D%E7%9A%84%E8%AE%BE%E7%BD%AE)

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


## read-links

+ [Service Worker 入门](https://www.w3ctech.com/topic/866)
+ [ServiceWorker-MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/ServiceWorker#方法)
+ [serviceworke](https://serviceworke.rs/strategy-cache-only_service-worker_doc.html)
+ [Service Worker Recipes - GitHub Pages](https://googlechrome.github.io/samples/service-worker/)
+ [chrome://serviceworker-internals/](chrome://serviceworker-internals/)
