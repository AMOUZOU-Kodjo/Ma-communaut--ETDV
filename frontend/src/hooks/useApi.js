// hooks/useApi.js
// Hook partagé pour tous les appels API du dashboard
import { useState, useCallback } from 'react';
import { api } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function useApi() {
  const [loading, setLoading] = useState(false);

  const request = useCallback(async (method, url, data = null, options = {}) => {
    setLoading(true);
    try {
      const config = { method, url, ...options };
      if (data) config.data = data;
      const response = await api(config);
      return { data: response.data, error: null };
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Erreur serveur';
      if (!options.silent) toast.error(message);
      return { data: null, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, request };
}
