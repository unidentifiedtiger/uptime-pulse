import { useState, useEffect } from 'react';

export function useAuthUserId() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      const currentUserId = payload.sub || payload.id || payload.userId;
      if (currentUserId) {
        setUserId(currentUserId);
      }
    } catch (e) {
      console.error('Ошибка декодирования токена', e);
    }
  }, []);

  return userId;
}
