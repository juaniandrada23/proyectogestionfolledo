import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import { BiExpandVertical } from "react-icons/bi";

const Usuarios = () => {
  const [modalOpen, setModalOpen] = useState(false);  
  const rolUsuario = localStorage.getItem("userRole");
  const nombreDeUsuario = localStorage.getItem("userName");
  const imagenDelUsuario = localStorage.getItem("imagen");
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    contraseña: ''
  });
  const [modalOpen2, setModalOpen2] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  const abrirModalBorrar = (id, username) => {
    setModalOpen2(true);
    setUsuarioAEliminar({ id, username });
  }; 

  const handleBorrarClick = (userId) => {
    setIsLoading2(true);

    fetch(`https://apifolledo.onrender.com/usuarios/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        console.log('Usuario eliminado exitosamente');
        cargarDatos();
        setModalOpen2(false);
        setIsLoading2(false);
      } else {
        console.error('Error al borrar el usuario:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error al borrar el usuario:', error);
    });
  };
  
  const handleNuevoUsuarioChange = (event) => {
    const { name, value } = event.target;
    setNuevoUsuario(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAceptarClick = () => {
    setIsLoading(true);

    fetch('https://apifolledo.onrender.com/login/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: nuevoUsuario.nombre,
        password: nuevoUsuario.contraseña
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Respuesta de la API:', data);
      handleModalClose();
      setIsLoading(false);
      cargarDatos();
    })
    .catch(error => {
      console.error('Error al agregar el usuario:', error);
    });
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

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
          <div className="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-2 mb-2 bg-white shadow-xl rounded-lg text-gray-900">
              <div className="rounded-t-lg h-32 overflow-hidden">
                  <img className="object-cover object-top w-full" src='https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='Mountain'/>
              </div>
              <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
                  <img className="object-cover object-center h-32" src={`${imagenDelUsuario}`} alt="Imagen del usuario"/>
              </div>
              <div className="text-center mt-2">
                  <h2 className="font-semibold">{nombreDeUsuario}</h2>
                  <p className="text-gray-500">{rolUsuario}</p>
              </div>
              <div className="p-4 border-t mt-2 flex flex-row">
                <button className="block mx-auto rounded-full font-semibold text-white px-2 py-1 sm:px-4 sm:py-2 transition ease-in-out delay-150 bg-blue-600 hover:bg-blue-900 duration-300">
                    Actualizar datos
                </button>
                <button className="block mx-auto rounded-full font-semibold text-white px-2 py-1 sm:px-4 sm:py-2 transition ease-in-out delay-150 bg-green-600 hover:bg-green-900 duration-300" onClick={handleModalOpen}>
                    Agregar usuario
                </button>
              </div>
          </div>
          </Grid>
          <Grid item xs={12} lg={8}>
          <div className="overflow-x-auto mt-2 mb-2 mr-2">
            <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
              <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre de usuario
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                    </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios.map((user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                                <Avatar sx={{ width: 44, height: 44 }} src={`${user.imagen}`} alt={`${user.username}`}/>
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                    {user.username}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {user.email ? user.email : 'Sin email'}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.descripcion ? user.descripcion : 'Sin descripcion'}</div>
                        <div className="text-sm text-gray-500">{user.descripcion ? user.descripcion : 'Sin subdescripcion'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email ? user.email : 'Sin email'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900">Editar</button>
                        <button className="ml-2 text-red-600 hover:text-red-900" onClick={() => abrirModalBorrar(user.id, user.username)}>Borrar</button>
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
            <div className="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-2 mb-2 bg-white shadow-xl rounded-lg text-gray-900">
                <div className="rounded-t-lg h-32 overflow-hidden">
                    <img className="object-cover object-top w-full" src='https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='Mountain'/>
                </div>
                <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
                    <img claclassNamess="object-cover object-center h-32" src={`${imagenDelUsuario}`} alt="Imagen del usuario"/>
                </div>
                <div className="text-center mt-2">
                    <h2 className="font-semibold">{nombreDeUsuario}</h2>
                    <p className="text-gray-500">{rolUsuario}</p>
                </div>
                <div className="p-4 border-t mx-8 mt-2">
                  <button className="block mx-auto rounded-full hover:shadow-lg font-semibold text-white px-6 py-2">                    
                    <Accordion style={{backgroundColor:'#006989', borderRadius:'15px'}}>
                        <AccordionSummary expandIcon={<BiExpandVertical style={{color:'#004E66', backgroundColor:'#EAEBED', borderRadius:'50px'}} />} style={{color:'#ffffff'}} aria-controls="panel1a-content" id="panel1a-header">
                        <h1>Ver mis datos</h1>
                        </AccordionSummary>
                        <AccordionDetails style={{backgroundColor:'#fffff'}}>
                        <h1>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                            malesuada lacus ex, sit amet blandit leo lobortis eget.
                        </h1>
                        </AccordionDetails>
                    </Accordion>
                  </button>
                </div>
            </div>
          </Grid>
      </Grid>
      )}

      <Footer style={{ flexShrink: 0 }}/>

      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle style={{ backgroundColor: '#006989', color: 'white', marginBottom: '5px' }}>Agregar Nuevo Usuario</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" id="nombre" name="nombre" label="Nombre de usuario" type="text" fullWidth value={nuevoUsuario.nombre} onChange={handleNuevoUsuarioChange}/>
          <TextField margin="dense" id="contraseña" name="contraseña" label="Contraseña" type="password" fullWidth value={nuevoUsuario.contraseña} onChange={handleNuevoUsuarioChange}/>
        </DialogContent>
        <DialogActions style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
          <button style={{ backgroundColor: '#dc3545', color: '#fff', padding: '10px', borderRadius: '50px' }} onClick={handleModalClose} color="primary">
            Cancelar
          </button>
          <button style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px', borderRadius: '50px' }} onClick={handleAceptarClick}>
            Aceptar <br />{isLoading && <LinearProgress />}
          </button>
        </DialogActions>
      </Dialog>

      <Dialog open={modalOpen2} onClose={() => setModalOpen2(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle style={{ backgroundColor: '#006989', color: 'white', marginBottom: '15px' }}>Borrar Usuario</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
            ¿Está seguro de que quiere borrar el usuario "{usuarioAEliminar ? usuarioAEliminar.username : ''}"? 
            <br/>
            </DialogContentText>
        </DialogContent>
        <DialogActions style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
            <button style={{ backgroundColor: '#dc3545', color: '#fff', padding: '10px', borderRadius: '50px' }} onClick={() => setModalOpen2(false)}>
            Cancelar
            </button>
            <button style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px', borderRadius: '50px' }} onClick={() => handleBorrarClick(usuarioAEliminar.id)}>
            Confirmar <br />{isLoading2 && <LinearProgress />}
            </button>
        </DialogActions>
      </Dialog>

    </div>

    </>
  )
}

export default Usuarios