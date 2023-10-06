import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const IsLogged = () => {
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate(`/principal/${id}`);
    }
  }, [navigate, token, id]);

  return null;
};

export default IsLogged;
