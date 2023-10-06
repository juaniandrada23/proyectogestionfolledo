import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthAdmin = () => {
  const userRole = localStorage.getItem('userRole');
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole && userRole !== 'Administrador') {
      navigate(-1);
    }
  }, [navigate, userRole]);

  return null;
};

export default AuthAdmin;
