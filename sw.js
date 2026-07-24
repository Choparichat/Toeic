const CACHE='toeic-vocab-v5';
const ASSETS=['./','./index.html','./book_words.js','./manifest.json'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

/* network-first: ลองโหลดจากอินเทอร์เน็ตก่อนเสมอ (คำศัพท์จะอัปเดตทันที)
   ถ้าออฟไลน์ค่อยหยิบจากแคช */
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(
    fetch(e.request).then(res=>{
      const copy=res.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
      return res;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
  );
});
