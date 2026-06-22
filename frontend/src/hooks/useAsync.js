import { useState, useCallback } from 'react';
import { getErrorMessage } from '../utils/errorHandler';


export default function useAsync() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = useCallback(async (asyncFunction) => {
    setLoading(true);
    setError('');
    try {
      const response = await asyncFunction();
      return { data: response?.data || response, error: null };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      return { data: null, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, setError, execute };
}
