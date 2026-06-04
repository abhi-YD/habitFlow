self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'HabitFlow',
      {
        body:  data.body  || 'You have a new notification',
        icon:  data.icon  || '/icon.png',
        badge: data.badge || '/badge.png',
        data:  data.data  || {},
      }
    )
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});