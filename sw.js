const CACHE_NAME = 'murooj-platform-v3';

// قائمة الملفات التي سيتم حفظها في ذاكرة الجهاز (Offline Assets)
const assetsToCache = [
  './',
  './index.html',
  './splash.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Amiri:wght@700&family=Tajawal:wght@500;800&display=swap',
  'https://raw.githubusercontent.com/faissaltunisia/student-grades/main/Screenshot%202025-12-16%20235912.png'
];

// 1. مرحلة التثبيت: حفظ الملفات الأساسية في الكاش
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('تم حفظ ملفات المنصة في الكاش بنجاح');
      return cache.addAll(assetsToCache);
    })
  );
});

// 2. مرحلة التنشيط: مسح الكاش القديم عند تحديث التطبيق
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// 3. استراتيجية جلب البيانات: "Cache First" للملفات الثابتة و "Network First" للبيانات المتغيرة
self.addEventListener('fetch', (event) => {
  // روابط Supabase واليوتيوب لا نقوم بتخزينها في الكاش لأنها متغيرة دائماً
  if (event.request.url.includes('supabase.co') || event.request.url.includes('youtube.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // إذا وجدنا الملف في الكاش نعرضه فوراً (سرعة صاروخية)
      if (cachedResponse) {
        return cachedResponse;
      }
      // إذا لم يوجد، نجلبه من الإنترنت
      return fetch(event.request);
    })
  );
});
