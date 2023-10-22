import React, { useState } from 'react';
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import {
  WalletIcon ,
  BanknotesIcon,
  TruckIcon,
  CalculatorIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon ,
} from '@heroicons/react/24/outline'
import { useNavigate, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';

const ButtonSlice = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const rolUsuario = localStorage.getItem("userRole");
    const [isLoading, setIsLoading] = useState(false);

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

    const solutions = [
        { name: 'Pagos', description: 'Visualiza, carga y obtiene los pagos', icon: BanknotesIcon, ruta:`/pagos/${userId}`},
        { name: 'Proveedores', description: 'Información almacenada sobre los proveedores', icon: TruckIcon, ruta:`/proveedores/${userId}`},
        { name: 'Calculos', description: "Generacion de pdf en fecha y calculos sobre proveedores", icon: CalculatorIcon, ruta:`/calculos/${userId}`},
        { name: 'Medios de pago', description: 'Informacion almacenada sobre los medios de pago', icon: WalletIcon, ruta:`/medios/${userId}`},
    ]
      
    const callsToAction = [
        { name: 'Usuarios', icon: UsersIcon, click: () => navigate('/usuarios') },
        { name: 'Cerrar sesión', icon: ArrowRightOnRectangleIcon, click: handleLogout },
    ]

    let allowedSolutions = [];
    if (rolUsuario === 'Usuario') {
        allowedSolutions = solutions.filter((solution) => solution.name === 'Pagos');
    } else if (rolUsuario === 'Administrador') {
        allowedSolutions = solutions.filter(
            (solution) => solution.name === 'Pagos' || solution.name === 'Proveedores' || solution.name === 'Calculos' || solution.name === 'Medios de pago'
        );
    }

    let allowedSolutionsBellow = [];
    if (rolUsuario === 'Usuario') {
        allowedSolutionsBellow = callsToAction.filter((solution) => solution.name === 'Cerrar sesión');
    } else if (rolUsuario === 'Administrador') {
        allowedSolutionsBellow = callsToAction.filter(
            (call) => call.name === 'Usuarios' || call.name === 'Cerrar sesión'
        );
    }

    return (
      <Popover className="relative">
        <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
          <span style={{color:'#fff'}}>Servicios</span>
          <ChevronDownIcon style={{color:'#fff'}} className="h-5 w-5" aria-hidden="true" />
        </Popover.Button>
  
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
            <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
              <div className="p-4">
                {allowedSolutions.map((item) => (
                    <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50" onClick={() => navigate(item.ruta)}>
                        <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <item.icon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                        </div>
                        <div>
                        <a href={item.href} className="font-semibold text-gray-900">
                            {item.name}
                            <span className="absolute inset-0" />
                        </a>
                        <p className="mt-1 text-gray-600">{item.description}</p>
                        </div>
                    </div>                  
                ))}
              </div>
              <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                {allowedSolutionsBellow.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                    onClick={(item.click)}
                  >
                    <item.icon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </Popover.Panel>
        </Transition>

        <Modal open={isLoading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
            <CircularProgress />
                <p>Cerrando sesión...</p>
            </div>
        </Modal>

      </Popover>
    )
  }

export default ButtonSlice