const CACHE = 'recipe-notebook-v5';
const ROOT = new URL('./', self.location.href).href;
const FILES = ['./', './index.html', './style.css', './app.js', './recipes.js', './storage.js', './crypto.js', './kitchen.js', './manifest.webmanifest', './assets/bear.svg', './assets/cookies.svg', './assets/cake.svg', './assets/bread.svg', './assets/icon.svg', './assets/icon-192.png', './assets/icon-512.png', './assets/apple-touch-icon.png'];
self.addEventListener('install', event => {event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES.map(file => new URL(file,ROOT).href))));});
self.addEventListener('activate', event => {event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('recipe-notebook-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch', event => {
 const url = new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(ROOT)) return;
 if(event.request.mode==='navigate') {event.respondWith(fetch(event.request).catch(()=>caches.match(new URL('./index.html',ROOT).href)));return;}
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});

self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
