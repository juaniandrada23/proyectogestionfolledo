import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer';
import '../Styles/login.css'
import isLogged from '../Functions/isLogged';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';

const Login = () => {
  isLogged();

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('https://apifolledo.onrender.com/login/iniciosesion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      console.log('Datos recibidos del servidor:', data);

      if (data.token) {
        const userId = data.userId;
        const userName = data.userName;
        const userRole = data.userRole;
        localStorage.setItem('userName', userName);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('token', data.token);

        navigate(`/principal/${userId}`);
      } else {
        if (response.status === 401) {
          setErrorMessage('Nombre de usuario o contraseña mal ingresados');
        } else if (response.status === 404) {
          setErrorMessage('Error: Usuario no encontrado');
        }
      }
    } catch (error) {
      setErrorMessage('Error de red al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar/>
      <div style={{textAlign:'center', flexGrow: 1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:'10px'}}>
        <div className='divform'>
          <h2>Inicio de Sesión</h2>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <input className='username' type="text" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className='password' type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className='boton' onClick={handleLogin}>Iniciar Sesión</button>
          <p className='sincuenta'>
            No tiene cuenta? <Link to="/signup">Cree una</Link>
          </p>
        </div>
      </div>
      <Footer style={{ flexShrink: 0 }}/>

      <Modal open={isLoading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <CircularProgress />
          <p>Cargando...</p>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
