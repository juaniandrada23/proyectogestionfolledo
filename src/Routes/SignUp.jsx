import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import EstadoServicio from '../Components/EstadoServicio.jsx'

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async () => {
    if (username === '' || password === '') {
      setErrorMessage('Error: Debe ingresar todos los datos');
      return;
    } else if (password !== confirmPassword) {
      setErrorMessage('Error: La contraseña no es igual que la confirmada');
      return;
    } else if (password.length < 8) {
      setErrorMessage('Error: Debe ingresar una contraseña mayor a 8 caracteres');
      return;
    }

    try {
      const response = await fetch('https://apifolledo.onrender.com/login/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 201) {
        console.log('Usuario registrado exitosamente');
        navigate('/');
      } else {
        console.error('Error al registrar usuario');
      }
    } catch (error) {
      console.error('Error de red al registrar usuario', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar/>
      <div style={{flexGrow: 1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:'10px'}}>
        <div className='divform'>
          <h2>Registro</h2>
          {errorMessage && <p>{errorMessage}</p>}
          <input className='username' type="text" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)}/>
          <input className='password' type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <input className='repassword' type="password" placeholder="Confirmar Contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
          <button className='boton' onClick={handleSignUp}>Registrarse</button>
          <p className='volver'>Ya tiene una cuenta? <Link to="/">Iniciar Sesión</Link></p>
        </div>
      </div>
      <Footer style={{ flexShrink: 0 }}/>

      <EstadoServicio/>
    </div>
  );
};

export default SignUp;
