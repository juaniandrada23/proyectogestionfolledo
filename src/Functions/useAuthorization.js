import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const useAuthorization = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedInUser = userId === localStorage.getItem('userId');

    if (!isLoggedInUser) {
      navigate(-1);
    }
  }, [navigate, userId]);
};

export default useAuthorization;
