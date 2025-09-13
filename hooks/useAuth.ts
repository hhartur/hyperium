import { useState, useEffect } from 'react';
import { deleteCookie } from 'cookies-next';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
      setLoading(false);
    }

    loadUser();
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    deleteCookie('session_token');
    window.location.reload();
  };

  return { user, loading, logout };
}
