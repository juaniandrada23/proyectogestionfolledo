import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useTimeout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }

    const timeoutId = setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');

      navigate('/');
    }, 300000);

    return () => clearTimeout(timeoutId);
  }, [navigate]);
}
