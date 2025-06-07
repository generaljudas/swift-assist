import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../services/userService';

// Custom hook to fetch the current context used by ChatWindow
export function useCurrentChatContext() {
  const [currentContext, setCurrentContext] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchContext() {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/public/admin-context`);
        if (isMounted) {
          setCurrentContext(res.data?.chat_context || '');
        }
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchContext();
    return () => { isMounted = false; };
  }, []);

  return { currentContext, loading, error };
}
