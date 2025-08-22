
const CACHE_NAME = 'hvm-app-v1';
const ASSETS = [
  '/', '/index.html','/manifest.json','/sw.js','/staticwebapp.config.json',
  '/static/css/styles.css',
  '/static/js/script.js','/static/js/background.js','/static/js/truths.js',
  '/static/js/leaderboard.js','/static/js/payments.js','/static/js/config-loader.js',
  '/static/js/auth.scaffold.js','/static/js/sync.scaffold.js','/static/js/entitlements.js','/static/js/ui-paywall.js',
  '/static/js/analytics.js','/static/js/cookie-consent.js',
  '/static/img/logo.svg','/static/img/hv1.png','/static/img/hv2.png','/static/img/hv3.png','/static/img/hv4.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => resp))
  );
});
