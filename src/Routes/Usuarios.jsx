import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';

const Usuarios = () => {
  const rolUsuario = localStorage.getItem("userRole");
  const nombreDeUsuario = localStorage.getItem("userName");
  const imagenDelUsuario = localStorage.getItem("imagen");

  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
      fetch('https://apifolledo.onrender.com/usuarios/total')
        .then(response => response.json())
        .then(data => {
          setUsuarios(data);
        })
        .catch(error => console.error('Error al cargar los usuarios', error));
  };

  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      {rolUsuario === 'Administrador' && (
        <>
        <Grid container spacing={2} style={{ flexGrow: 1 }}>
          <Grid item xs={12} lg={4}>
          <div class="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-2 mb-2 bg-white shadow-xl rounded-lg text-gray-900">
              <div class="rounded-t-lg h-32 overflow-hidden">
                  <img class="object-cover object-top w-full" src='https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='Mountain'/>
              </div>
              <div class="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
                  <img class="object-cover object-center h-32" src={`${imagenDelUsuario}`} alt="Imagen del usuario"/>
              </div>
              <div class="text-center mt-2">
                  <h2 class="font-semibold">{nombreDeUsuario}</h2>
                  <p class="text-gray-500">{rolUsuario}</p>
              </div>
              <div class="p-4 border-t mx-8 mt-2">
                  <button class="block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2">Ver mis datos</button>
              </div>
          </div>
          </Grid>
          <Grid item xs={12} lg={8}>
          <div class="overflow-x-auto mt-2 mb-2 mr-2">
            <table class="min-w-full divide-y divide-gray-200 overflow-x-auto">
              <thead class="bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre de usuario
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                    </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {usuarios.map((user => (
                  <tr key={user.id}>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                                <Avatar sx={{ width: 44, height: 44 }} src={`${user.imagen}`} alt={`${user.username}`}/>
                            </div>
                            <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">
                                    {user.username}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {user.email ? user.email : 'Sin email'}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{user.descripcion ? user.descripcion : 'Sin descripcion'}</div>
                        <div class="text-sm text-gray-500">{user.descripcion ? user.descripcion : 'Sin subdescripcion'}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role_name}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email ? user.email : 'Sin email'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                        <button class="text-indigo-600 hover:text-indigo-900">Editar</button>
                        <button class="ml-2 text-red-600 hover:text-red-900">Borrar</button>
                    </td>
                </tr>
                )))}
              </tbody>
            </table>
          </div>
          </Grid>
        </Grid>
        </>
      )}

      {rolUsuario === 'Usuario' && (
      <Grid container spacing={1} style={{ flexGrow: 1 }}>
          <Grid item xs={12} lg={12}>
            <div class="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-2 mb-2 bg-white shadow-xl rounded-lg text-gray-900">
                <div class="rounded-t-lg h-32 overflow-hidden">
                    <img class="object-cover object-top w-full" src='https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='Mountain'/>
                </div>
                <div class="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
                    <img class="object-cover object-center h-32" src={`${imagenDelUsuario}`} alt="Imagen del usuario"/>
                </div>
                <div class="text-center mt-2">
                    <h2 class="font-semibold">{nombreDeUsuario}</h2>
                    <p class="text-gray-500">{rolUsuario}</p>
                </div>
                <div class="p-4 border-t mx-8 mt-2">
                    <button class="block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2">Ver mis datos</button>
                </div>
            </div>
          </Grid>
      </Grid>
      )}

      <Footer style={{ flexShrink: 0 }}/>
    </div>

    </>
  )
}

export default Usuarios