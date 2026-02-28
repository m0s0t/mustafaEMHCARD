const CACHE_NAME = 'ndmr-v2'; // تحديث الإصدار لضمان تحديث الملفات عند المستخدمين
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/assets/patient-photo.jpg',
  '/manifest.json'
];

// تثبيت الـ Service Worker وحفظ الملفات الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('NDMR: Caching core assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// استراتيجية الاستجابة: جلب من الإنترنت أولاً، ثم الكاش في حال انقطاع الشبكة
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});