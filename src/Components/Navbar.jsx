import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../Styles/app.css'
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import ButtonSlice from './ButtonSlice';
import Avatar from '@mui/material/Avatar';
import { CgHomeAlt, CgProfile } from "react-icons/cg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [tokenAvailable, setTokenAvailable] = useState(false);
  const { userId } = useParams();
  const nombreDelUsuario  = localStorage.getItem("userName");
  const rolUsuario = localStorage.getItem("userRole");
  const [isLoading, setIsLoading] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setTokenAvailable(true);
    }
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
  
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/');
    setIsLoading(false);
  };
   
  return (
    <nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img className="h-8 w-8 bg-white rounded-full p-66" src="https://previews.123rf.com/images/vecstock/vecstock2101/vecstock210100927/162213113-icono-de-edificio-de-oficinas-de-gran-altura-sobre-fondo-blanco-estilo-de-silueta-ilustraci%C3%B3n.jpg" alt="Logo"/>
            </div>
            <div className="md:block">
              <h2 className="text-white text-lg ml-2 font-semibold">Gestión de pagos</h2>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 gap-4 navegacion">
            {tokenAvailable && (
              <>
                <ButtonSlice/>
                <button className='bg-white p-2 rounded-full hover:bg-slate-300' onClick={() => navigate(`/probandoprincipal/${userId}`)}><CgHomeAlt className='text-slate-950 w-4 h-4'/></button>
                <button className='bg-white p-2 rounded-full hover:bg-slate-300' onClick={() => navigate(`/usuarios/${userId}`)}><CgProfile className='text-slate-950 w-4 h-4'/></button>
              </>
              )}
            </div>
          </div>
        
          {tokenAvailable && (
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-300 hover:bg-blue-800 focus:outline-none focus:bg-blue-800 focus:text-white transition duration-150 ease-in-out"
              aria-label="Main menu" aria-expanded="false">
              <svg className="block h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className={`${isOpen ? 'hidden' : 'block'}`} fillRule="evenodd" clipRule="evenodd"d="M4 6H20V8H4V6ZM4 11H20V13H4V11ZM4 16H20V18H4V16Z" fill="currentColor"/>
                <path className={`${isOpen ? 'block' : 'hidden'}`} fillRule="evenodd" clipRule="evenodd" d="M6 18H18V16H6V18ZM6 13H18V11H6V13ZM6 8H18V6H6V8Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          )}
        </div>

        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="flex flex-col items-start px-2 pt-2 pb-3 sm:px-3">
          {tokenAvailable && (
              <>
                <button className="text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-blue-300" onClick={() => navigate(`/probandoprincipal/${userId}`)}>Inicio</button>
                <button className="text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-blue-300" onClick={() => navigate(`/pagos/${userId}`)}>Pagos</button>
                {rolUsuario === 'Administrador' && (
                  <>
                    <button className="text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-blue-300" onClick={() => navigate(`/proveedores/${userId}`)}>Proveedores</button>
                    <button className="text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-blue-300" onClick={() => navigate(`/calculos/${userId}`)}>Calculos</button>
                    <button className="text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-blue-300" onClick={() => navigate(`/medios/${userId}`)}>Medios de Pago</button>
                    <button className="text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-blue-300" onClick={() => navigate(`/usuarios/${userId}`)}>Usuarios</button>
                  </>
                )}
                <button className="text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-blue-300" onClick={handleLogout}>Cerrar Sesión</button>
              </>
              )}
          </div>

          <div className="pt-4 pb-3 border-t border-blue-800">
            <div className="flex items-center px-5 mb-1">
            {tokenAvailable && (
            <>
              <div className="flex-shrink-0">
                <button className="flex text-white items-center justify-center h-8 w-8 rounded-full bg-blue-800 hover:bg-blue-700 focus:outline-none focus:bg-blue-700 transition-colors" onClick={() => navigate(`/usuarios/${userId}`)}>
                  <Avatar style={{backgroundColor:'white'}} alt={`${nombreDelUsuario}`} onClick={() => navigate(`/usuarios/${userId}`)}><CgProfile style={{color:'black', width:'35px', height:'35px'}}/></Avatar>
                </button>
              </div>
              <div className="ml-3">
                <p className="text-white text-sm font-medium leading-none">Bienvenido {nombreDelUsuario}</p>
              </div>
            </>
            )}
            </div>
          </div>
        </div>

        <Modal open={isLoading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <CircularProgress />
          <p>Cerrando sesión...</p>
        </div>
        </Modal>
      </div>
    </nav>
  );
}

export default Navbar;