/* English Quest v13: network-first navigation, offline fallback. */
const CACHE_NAME='english-quest-v13-shell';
const SHELL=['./','./index.html','./studio.js?v=13','./studio.css?v=13','./manifest.webmanifest','./icon-192.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>(key.startsWith('toeic-quest-')||key.startsWith('english-quest-'))&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url),scope=new URL(self.registration.scope);
  if(url.origin!==scope.origin || !url.pathname.startsWith(scope.pathname))return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(resp=>{
      if(resp.ok){const copy=resp.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy)).catch(()=>{});}
      return resp;
    }).catch(async()=> (await caches.match('./index.html')) || Response.error()));
    return;
  }
  // Always check for fresh Speaking/Writing scripts, so old iPhone PWA caches
  // cannot keep the broken audio controls indefinitely.
  if(url.pathname.endsWith('/studio.js')||url.pathname.endsWith('/studio.css')){
    event.respondWith(fetch(req).then(resp=>{
      if(resp.ok){const copy=resp.clone();caches.open(CACHE_NAME).then(c=>c.put(req,copy)).catch(()=>{});}
      return resp;
    }).catch(async()=>await caches.match(req)||Response.error()));
    return;
  }
  event.respondWith(caches.match(req).then(found=>found||fetch(req).then(resp=>{
    if(resp.ok){const copy=resp.clone();caches.open(CACHE_NAME).then(c=>c.put(req,copy)).catch(()=>{});}return resp;
  })));
});
