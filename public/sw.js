const CACHE = 'recipe-notebook-v5';
const ROOT = new URL('./', self.location.href).href;
const FILES = ['./', './index.html', './style.css', './written-recipe.css', './student-recipe.css', './trials.js', './assets/fonts/student-hand.woff', './assets/fonts/kalam-hand.woff', './assets/fonts/kristi-hand.woff', './assets/bear-face-v2.svg', './assets/bear-face-192-v2.png', './assets/bear-face-512-v2.png', './assets/apple-touch-bear-v2.png', './assets/favicon-bear-v2.png', './assets/fonts/written-script.woff', './assets/fonts/written-body.woff', './assets/fonts/written-body-italic.woff', './app.js', './recipes.js', './storage.js', './crypto.js', './kitchen.js', './sections.js', './contents.js', './manifest.webmanifest', './assets/bear.svg', './assets/cookies-graphite.webp', './assets/cake-graphite.webp', './assets/bread-graphite.webp', './assets/icon.svg', './assets/icon-192.png', './assets/icon-512.png', './assets/apple-touch-icon.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>Promise.all(FILES.map(async file=>{const key=new URL(file,ROOT);const download=new URL(key);download.searchParams.set('recipe-build',CACHE);const response=await fetch(new Request(download.href,{cache:'no-store'}));if(!response.ok)throw Error('Notebook asset unavailable: '+file);await cache.put(key.href,response);}))));});
self.addEventListener('activate', event => {event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('recipe-notebook-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch', event => {
 const url = new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(ROOT)) return;
 if(event.request.mode==='navigate'&&![new URL(ROOT).pathname,new URL('./index.html',ROOT).pathname].includes(url.pathname))return;
 if(event.request.mode==='navigate') {event.respondWith(caches.match(new URL('./index.html',ROOT).href).then(cached=>cached||fetch(event.request)));return;}
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});

self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')event.waitUntil(self.skipWaiting());});
