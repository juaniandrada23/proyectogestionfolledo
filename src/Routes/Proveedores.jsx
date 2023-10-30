import React, { useState, useEffect } from 'react';
import '../Styles/proveedores.css'
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import {TiEdit, TiUserDelete} from "react-icons/ti";
import Alert from '@mui/material/Alert';
import useAuthorization from '../Functions/useAuthorization';
import { useTimeout } from '../Functions/timeOut';
import AuthAdmin from '../Functions/authAdmin';
import LinearProgress from '@mui/material/LinearProgress';
import EstadoServicio from '../Components/EstadoServicio';
import Skeleton from '@mui/material/Skeleton';

const Proveedores = () => {
  useAuthorization();
  AuthAdmin();
  
  // Estado para almacenar la lista de proveedores
  const [proveedores, setProveedores] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idProveedorEditar, setIdProveedorEditar] = useState(null);  
  const [modalOpen, setModalOpen] = useState(false);
  const [proveedorAEliminar, setProveedorAEliminar] = useState(null);
  const [borradoExitoso, setBorradoExitoso] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth <= 600);
  const [error, setError] = useState('');
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);
  const [isLoading, setLoading] = useState(false);

  useTimeout();

  const handleWindowResize = () => {
    setIsMobileScreen(window.innerWidth <= 600);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const abrirModalBorrar = (id, nombre) => {
    setModalOpen(true);
    setProveedorAEliminar({ id, nombre });
  }; 

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  }; 
  
  // Estado para los datos del formulario de agregar proveedores
  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre: '',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
      fetch('https://apifolledo.onrender.com/proveedores')
        .then(response => response.json())
        .then(data => {
          setProveedores(data);
          setIsLoadingSkeleton(false);
        })
        .catch(error => console.error('Error al cargar los proveedores', error));
  };

  // Función para manejar cambios en el formulario de agregar proveedores
  const handleNuevoProveedorChange = (e) => {
    const { name, value } = e.target;
    setNuevoProveedor({ ...nuevoProveedor, [name]: value });
  };

  const agregarOEditarProveedor = () => {
    if (!nuevoProveedor.nombre) {
      setError('Error: El campo nombre es requerido');
      return;
    }

    const proveedorExistente = proveedores.find(
      (proveedor) => proveedor.nombre === nuevoProveedor.nombre
    );

    if (proveedorExistente) {
      setError('Error: Ya existe un proveedor con ese nombre, elija otro');
      return;
    }

    setLoading(true);
  
    if (modoEdicion) {
      const proveedorModificado = {
        nombre: nuevoProveedor.nombre,
      };
  
      fetch(`https://apifolledo.onrender.com/proveedores/${idProveedorEditar}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proveedorModificado),
      })
        .then(response => {
          if (response.ok) {
            setModoEdicion(false);
            setIdProveedorEditar(null);
            setSnackbarMessage('Proveedor modificado correctamente');
            setSnackbarOpen(true);
            setLoading(false);
            setError('');
            setNuevoProveedor({
              nombre: '',
            });
            cargarDatos();
          } else {
            console.error('Error al modificar el proveedor');
          }
        })
        .catch(error => console.error('Error al modificar el proveedor', error));
    } else {
      fetch('https://apifolledo.onrender.com/proveedores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoProveedor),
      })
        .then(response => response.json())
        .then(data => {
            setProveedores([...proveedores, data]);
            setNuevoProveedor({
            nombre: '',
          });
          cargarDatos();
          setError('');
          setSnackbarMessage('Proveedor agregado correctamente');
          setSnackbarOpen(true);
          setLoading(false);
        })
        .catch(error => console.error('Error al agregar el proveedor', error));
    }
  };  

  const modificarProveedor = (id) => {
    const proveedorAEditar = proveedores.find(proveedor => proveedor.id === id);
  
    if (proveedorAEditar) {
      setNuevoProveedor({
        nombre: proveedorAEditar.nombre,
      });
  
      setModoEdicion(true);
      setIdProveedorEditar(id);
    }
  };
  
  const borrarProveedor = (id) => {

    setModalOpen(false);

    fetch(`https://apifolledo.onrender.com/proveedores/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setBorradoExitoso(true);
          cargarDatos();
        } else {
          console.error('Error al borrar el proveedor');
        }
      })
      .catch(error => console.error('Error al borrar el proveedor', error));
  };

  useEffect(() => {
    if (borradoExitoso) {
      setTimeout(() => {
        setSnackbarMessage('Proveedor borrado correctamente');
        setSnackbarOpen(true);
      }, 1000);
    }
  }, [borradoExitoso]); 

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar/>
      <Grid container spacing={2} style={{ flexGrow: 1 }}>
        <Grid item xs={12} lg={8}>
          <div className='tabla'>
            <h1>Tabla de Proveedores</h1>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Proveedor</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
              {isLoadingSkeleton ? (
                    <tr>
                      <td><Skeleton animation="wave" variant="rounded" width={210} height={30} /></td>
                      <td><Skeleton animation="wave" variant="rounded" width={210} height={30} /></td>
                      <td><Skeleton animation="wave" variant="rounded" width={210} height={30} /></td>
                    </tr>
                  ) : (
                proveedores.map((proveedor => (
                  <tr key={proveedor.id}>
                    <td>{proveedor.id}</td>
                    <td>{proveedor.nombre}</td>
                    <td>
                      <div className='botonera'>
                        <button className='modificar' onClick={() => modificarProveedor(proveedor.id)}><TiEdit/></button>
                        <button className='borrar' onClick={() => abrirModalBorrar(proveedor.id, proveedor.nombre)}><TiUserDelete/></button>
                      </div>
                    </td>
                  </tr>
                ))))
              }
              </tbody>
            </table>
          </div>
        </Grid>
        <Grid item xs={12} lg={4}>
          <div className='tabla'>
            <h1>{modoEdicion ? `Modificar Proveedor ${idProveedorEditar}` : 'Agregar Proveedor'}</h1>
            <form>
              <div className='formAgregar'>
                <div style={{display:'flex', flexDirection:'column', justifyContent:'center',textAlign:'center', marginBottom:'10px', color:'red'}}>
                {error && <Alert severity="error"><strong>{error} </strong></Alert>}
                </div>
                <TextField label="Proveedor" name="nombre" value={nuevoProveedor.nombre} onChange={handleNuevoProveedorChange}/>
              </div>
              <div className='btnAgregar'>
              <button className='agregarProv' type="button" onClick={agregarOEditarProveedor}>
                {modoEdicion ? 'Modificar proveedor' : 'Agregar proveedor'} <br />
                {isLoading && <LinearProgress />}
              </button>
              </div>
            </form>
          </div>
        </Grid>
      </Grid>
      <Footer style={{ flexShrink: 0 }}/>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle style={{ backgroundColor: '#006989', color: 'white', marginBottom: '5px' }} id="alert-dialog-title">Confirmación de borrado proveedor</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Está seguro de que quiere borrar el proveedor "{proveedorAEliminar ? proveedorAEliminar.nombre : ''}"? 
            <br/>
            Se borrarán todos los pagos relacionados
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
          <Button onClick={() => setModalOpen(false)} variant='outlined' color='primary'>
            Cancelar
          </Button>
          <Button onClick={() => borrarProveedor(proveedorAEliminar.id)} autoFocus color='primary' variant='contained'>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <EstadoServicio/>

      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleCloseSnackbar} anchorOrigin={isMobileScreen ? { vertical: 'top', horizontal: 'center' } : { vertical: 'bottom', horizontal: 'left' }}>
        <Alert variant='filled' severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </div>
  );
};

export default Proveedores;
