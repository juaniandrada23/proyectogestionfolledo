import React from 'react';
import { FaGithub } from 'react-icons/fa';
import '../Styles/app.css'

const Footer = () => {
  return (
    <footer className="px-4 divide-y">
      <div className="container flex flex-col justify-between py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0 lg:items-center">

        <div className="lg:w-1/3">
          <a rel="noopener noreferrer" href="." className="flex justify-center space-x-3 lg:justify-start">
            <div className="flex items-center justify-center w-12 h-12 rounded-full">
              <img src="https://previews.123rf.com/images/vecstock/vecstock2101/vecstock210100927/162213113-icono-de-edificio-de-oficinas-de-gran-altura-sobre-fondo-blanco-estilo-de-silueta-ilustraci%C3%B3n.jpg" alt="Icono" className="w-full rounded-full" />
            </div>
            <div className='flex flex-col'>
              <span className="self-center text-2xl font-semibold">Gestion Folledo</span>
              <span className="self-center text-2xl font-semibold">2023</span>
            </div>
          </a>
        </div>

        <div className='flex flex-col text-center'>
          <div>
            <h1 className='font-semibold'>Repositorio</h1>
            <div className='flex justify-center'>
              <a rel="noopener noreferrer" href="https://github.com/juaniandrada23/BalanceFolledo" title="GitHub" className="flex items-center">
                <FaGithub style={{width:'45px', height:'40px'}}/>
              </a>
            </div>
          </div>
        </div>

      </div>
      <div className="py-6 text-sm text-center dark:text-white">Creado por Juan Ignacio Andrada Cabo 2023.</div>
    </footer>
  );
}

export default Footer;