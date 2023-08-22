/* eslint-disable no-undef */
// service-worker.js
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('my-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/checkout-summary',
                '/login',
                '/register',
                '/userProfile',
                '/baby-cloths',
                '/cart',
                '/cloths',
                '/computer',
                '/electronics',
                '/furniture',
                '/games',
                '/groceries',
                '/mobile',
                '/movie',
                '/shoes',
                '/success',
                '/toys',
                '/watch',
                '/wishlist',
                '/bestseller',
                '/404',
                '/contact',
                '/forgetPassword',
                '/resetPassword',
                '/uploadImage',
                // Add more URLs that you want to cache here
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
