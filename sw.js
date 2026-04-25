// sw.js — Service Worker "Il Mio Ricettario"
// Versione 4.0 — Firebase Cloud Messaging + notifiche reali in background

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const CACHE = 'ricettario-v4';

// ── Firebase config ───────────────────────────────────────────────────────
firebase.initializeApp({
  apiKey: "AIzaSyCvirGI-HQPMkv1YWNJsmgI7_XyFhREOvg",
  authDomain: "aldente-85774.firebaseapp.com",
  projectId: "aldente-85774",
  storageBucket: "aldente-85774.firebasestorage.app",
  messagingSenderId: "840163575181",
  appId: "1:840163575181:web:f09f98ea115fdecf4529c4"
});

const messaging = firebase.messaging();

// ── Notifiche push FCM in background (app chiusa/minimizzata) ─────────────
messaging.onBackgroundMessage(payload => {
  const title = (payload.notification && payload.notification.title) || '🛒 Lista della Spesa';
  const body  = (payload.notification && payload.notification.body)  || 'Hai prodotti da comprare!';
  self.registration.showNotification(title, {
    body:    body,
    icon:    './icon-192.png',
    badge:   './icon-192.png',
    tag:     'spesa-promemoria',
    vibrate: [200, 100, 200],
    data:    { url: (payload.data && payload.data.url) || './' }
  });
});

// ── INSTALL ───────────────────────────────────────────────────────────────
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.addAll(['./', './index.html', './icon-192.png']).catch(function(){});
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE ──────────────────────────────────────────────────────────────
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

// ── FETCH ─────────────────────────────────────────────────────────────────
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) { return r || fetch(e.request).catch(function(){ return r; }); })
  );
});

// ── MESSAGGI dall'app ─────────────────────────────────────────────────────
self.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'MOSTRA_NOTIFICA') {
    self.registration.showNotification(e.data.title || '🛒 Lista della Spesa', {
      body:     e.data.body || '',
      icon:     './icon-192.png',
      badge:    './icon-192.png',
      tag:      'spesa-promemoria',
      vibrate:  [200, 100, 200],
      renotify: true
    });
  }
});

// ── CLICK notifica → apri app ─────────────────────────────────────────────
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.includes(self.location.origin) && 'focus' in list[i]) return list[i].focus();
      }
      return clients.openWindow(url);
    })
  );
});

// ── PERIODIC SYNC ─────────────────────────────────────────────────────────
self.addEventListener('periodicsync', function(e) {
  if (e.tag === 'spesa-reminder') {
    e.waitUntil(
      self.registration.showNotification('🛒 Lista della Spesa', {
        body:    'Ricordati di controllare la tua lista della spesa!',
        icon:    './icon-192.png',
        badge:   './icon-192.png',
        tag:     'spesa-promemoria',
        vibrate: [200, 100, 200]
      })
    );
  }
});
