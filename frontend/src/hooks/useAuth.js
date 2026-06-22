import { useCallback } from 'react';
import API from '../api/api';
import useAsync from './useAsync';

/**
 * Custom hook for authentication operations
 * Centralizes login, register, and logout logic with error handling
 */
export default function useAuth() {
  const { loading, error, setError, execute } = useAsync();

  // Login user
  const login = useCallback(async (email, password) => {
    const { data, error } = await execute(() =>
      API.post('/auth/login', { email, password })
    );

    if (!error && data) {
      // Fetch fresh user data from backend
      const meRes = await API.get('/auth/me');
      return { user: meRes.data.user, error: null };
    }

    return { user: null, error };
  }, [execute]);

  // Register user
  const register = useCallback(async (username, email, password) => {
    const { error } = await execute(() =>
      API.post('/auth/register', { username, email, password })
    );

    return { error };
  }, [execute]);

  // Get current user
  const getMe = useCallback(async () => {
    const { data, error } = await execute(() => API.get('/auth/me'));
    return { user: data?.user || null, error };
  }, [execute]);

  // Logout user
  const logout = useCallback(async () => {
    const { error } = await execute(() => API.post('/auth/logout'));
    return { error };
  }, [execute]);

  return {
    loading,
    error,
    setError,
    login,
    register,
    getMe,
    logout,
  };
}
