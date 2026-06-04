import { useState } from 'react';
import api from '../api/axios';

export default function usePushNotification() {
  const [permission, setPermission] = useState(
    'Notification' in window ? Notification.permission : 'denied'
  );

  const subscribe = async () => {
    try {
      // get VAPID key from backend
      const { data } = await api.get('/notifications/vapid-key');
      const vapidKey  = data.publicKey;

      // request browser permission
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== 'granted') {
        return { success: false, message: 'Permission denied' };
      }

      // register service worker
      const reg = await navigator.serviceWorker.register('/sw.js');

      // subscribe to push
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      });

      // send subscription to backend
      await api.post('/notifications/subscribe', { subscription });
      return { success: true };

    } catch (err) {
      console.error('Push subscription error:', err);
      return { success: false };
    }
  };

  return { permission, subscribe };
}

// helper — convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64  = (base64String + padding)
    .replace(/-/g, '+').replace(/_/g, '/');
  const raw     = window.atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}