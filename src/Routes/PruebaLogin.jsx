import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import '../Styles/pruebalogin.css'
import fotoEdificio from '../Images/fotoedificio.jpeg';
import EstadoServicio from '../Components/EstadoServicio';
import isLogged from '../Functions/isLogged';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';


    const loginSectionStyle = {
        background: `linear-gradient(rgba(2,2,2,.7),rgba(0,0,0,.7)),url(${fotoEdificio}) center center`,
        height: '100vh',
        display: 'flex',
    };

    const loginSectionStyle2 = {
      background: `#F3F6F7`,
      height: '100vh',
      display: 'flex',
    };

const PruebaLogin = () => {
    isLogged();
    const apiUrl = process.env.REACT_APP_APIURL;

    const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth <= 600);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalText, setModalText] = useState('Cargando...');
  
    const handleWindowResize = () => {
      setIsMobileScreen(window.innerWidth <= 600);
    };

    useEffect(() => {
      window.addEventListener('resize', handleWindowResize);
      return () => {
        window.removeEventListener('resize', handleWindowResize);
      };
    }, []);
    
    useEffect(() => {
      let timer;
      if (isLoading) {
          // Si isLoading es verdadero, inicia un temporizador después de 11 segundos
          timer = setTimeout(() => {
              setModalText('Iniciando servidor, por favor espere...');
          }, 11000); // 11000 milisegundos = 11 segundos
      } else {
          clearTimeout(timer);
      }
      return () => {
          clearTimeout(timer);
      };
    }, [isLoading]);

    const handleLogin = async () => {
      try {
        setIsLoading(true);
  
        const response = await fetch(`${apiUrl}/login/iniciosesion`, {
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
          const imagen = data.imagen;
          localStorage.setItem('userName', userName);
          localStorage.setItem('userId', userId);
          localStorage.setItem('userRole', userRole);
          localStorage.setItem('imagen', imagen);
          localStorage.setItem('token', data.token);
  
          navigate(`/probandoprincipal/${userId}`);
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
    <>
    <Navbar></Navbar>
    <div style={loginSectionStyle} className="h-screen flex">
      <div className="hidden lg:flex w-full lg:w-1/2 login_img_section justify-around items-center">
        <div className="bg-black opacity-20 inset-0 z-0"></div>
        <div className="w-full mx-auto px-20 flex-col items-center space-y-6">
          <h1 className="text-white font-bold text-4xl font-sans">Gestión de Pagos Folledo</h1>
          <p className="text-white mt-1">Una aplicación fácil de usar para gestionar pagos, cobros, proveedores y usuarios. Simplifica tu contabilidad y realiza seguimiento de transacciones de forma eficiente.</p>
          {/*<div className="flex justify-center lg:justify-start mt-6">
            <button className="hover:bg-sky-700 hover:text-white hover:-translate-y-1 transition-all duration-500 bg-white text-sky-800 mt-4 px-4 py-2 rounded-2xl font-bold mb-2">Empezar</button>
            </div>*/}
        </div>
      </div>
      <div style={isMobileScreen ? loginSectionStyle : loginSectionStyle2} className="flex w-full lg:w-1/2 justify-center items-center bg-white space-y-8">
        <div className="w-full px-8 md:px-32 lg:px-24">
          <div className="bg-white rounded-md shadow-2xl hover:border-2 hover:border-sky-500 p-5 hover:-translate-y-2 hover:scale-100 duration-300">
            <h1 className="text-gray-800 font-bold text-2xl mb-1">¡Hola de nuevo!</h1>
            <p className="text-sm font-normal text-gray-600 mb-5">¡Bienvenido!</p>
            {errorMessage && <Alert className='mb-2' severity="error">{errorMessage}</Alert>}
            <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <input id="username" className="pl-2 w-full outline-none border-none" type="text" name="username" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className="flex items-center border-2 mb-12 py-2 px-3 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              <input className="pl-2 w-full outline-none border-none" type="password" name="password" id="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button className="block w-full bg-sky-600 mt-5 py-2 rounded-2xl hover:bg-sky-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2" onClick={handleLogin}>Iniciar sesión</button>
            <div className="flex justify-between mt-4">
              {/*<span className="text-sm ml-2 hover:text-blue-500 cursor-pointer hover:-translate-y-1 duration-500 transition-all">¿Olvidaste tu contraseña?</span>
              <a href="#" className="text-sm ml-2 hover:text-blue-500 cursor-pointer hover:-translate-y-1 duration-500 transition-all">¿Todavía no tienes una cuenta?</a>*/}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>

    <EstadoServicio/>

    <Modal open={isLoading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
        <CircularProgress />
        <p>{modalText}</p>
    </div>
    </Modal>
      </>
      )
}

export default PruebaLogin