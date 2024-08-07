import React, { useState, useEffect, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import TextField from '@mui/material/TextField';
import { MdOutlineMoneyOffCsred } from "react-icons/md";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { MdExpandMore } from "react-icons/md";
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import useAuthorization from '../Functions/useAuthorization';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import { useTimeout } from '../Functions/timeOut';
import '../Styles/mediosdepago.css';
import { AlertTitle } from '@mui/material';

const MediosPago = () => {
  useAuthorization();
  useTimeout();
  const apiUrl = process.env.REACT_APP_APIURL;

  const [mediopago, setMedioPago] = useState([]);
  const [nuevoMedioPago, setNuevoMedioPago] = useState('');
  const [actualizarMedioPago, setActualizarMedioPago] = useState('');
  const [medioPagoSeleccionado, setMedioPagoSeleccionado] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [medioPagoToDelete, setMedioPagoToDelete] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [titleMessage, setTitleMessage] = useState('');
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth <= 600);

  const handleWindowResize = () => {
    setIsMobileScreen(window.innerWidth <= 600);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  }; 

  const cargarDatos = useCallback(() => {
    fetch(`${apiUrl}/mediodepago/nombremediopago`)
      .then(response => response.json())
      .then(data => {
        setMedioPago(data);
        setIsLoadingSkeleton(false);
      })
      .catch(error => console.error('Error al cargar los nombres de los medios de pago', error));
  }, [apiUrl]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleBorrarClick = (nombreMedioPago) => {
    setMedioPagoToDelete(nombreMedioPago);
    setShowModal(true);
  };

  const handleBorrar = () => {
    setIsLoadingDelete(true);

    fetch(`${apiUrl}/mediodepago/borrarmediopago/${medioPagoToDelete}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setIsLoadingDelete(false);
          console.log(`Medio de pago con nombre ${medioPagoToDelete} borrado exitosamente.`);
          setSnackbarMessage('Proveedor borrado correctamente');
          setTitleMessage('Borrado realizado');
          setSnackbarOpen(true);
          cargarDatos(); // Recargar la lista de medios de pago después de borrar uno
        } else {
          throw new Error('Error al borrar el medio de pago');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        setShowModal(false);
      });
  };

  const handleCancelarBorrar = () => {
    setShowModal(false);
  };

  const handleAgregar = () => {
    setIsLoading(true);

    fetch(`${apiUrl}/mediodepago/agregarmediopago`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombreMedioPago: nuevoMedioPago }),
    })
    .then(response => {
      if (response.ok) {
        setNuevoMedioPago('');
        setSnackbarMessage('Proveedor agregado correctamente');
        setTitleMessage('Agregado realizado');
        setSnackbarOpen(true);
        setIsLoading(false);
        return response.json();        
      }
      throw new Error('Error al agregar el medio de pago');
    })
    .then(data => {
      console.log(data.message); // Mensaje del servidor (por ejemplo, "Medio de pago agregado exitosamente")
      cargarDatos(); // Recargar la lista de medios de pago después de agregar uno nuevo
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleActualizar = () => {
    setIsLoadingEdit(true);

    fetch(`${apiUrl}/mediodepago/actualizarmediopago/${medioPagoSeleccionado}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nuevoNombreMedioPago: actualizarMedioPago }),
    })
      .then(response => {
        if (response.ok) {
          console.log(`Medio de pago con nombre ${medioPagoSeleccionado} actualizado exitosamente.`);
          cargarDatos();
          setMedioPagoSeleccionado(null);
          setActualizarMedioPago('');
          setSnackbarMessage('Proveedor modificado correctamente');
          setTitleMessage('Modificación realizada');
          setSnackbarOpen(true);
          setIsLoadingEdit(false);
        } else {
          throw new Error('Error al actualizar el medio de pago');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleCancelar = () => {
    setMedioPagoSeleccionado(null);
    setNuevoMedioPago('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#EAEBED' }}>
      <Navbar />

      <Grid container spacing={2} style={{ flexGrow: 1, padding: '20px', justifyContent: 'center' }}>
        <Grid item xs={12} lg={6}>
        <div className='tabla'>                
            <Accordion style={{ textAlign: 'center', marginTop:'10px', marginBottom:'10px', backgroundColor:'#006989'}}>
              <AccordionSummary expandIcon={< MdExpandMore style={{color:'#004E66', backgroundColor:'#EAEBED', borderRadius:'50px'}}/>} aria-controls="panel1a-content" id="panel1a-header">
                <h1 style={{color:'#EAEBED'}}>Agregar medio de pago</h1>
              </AccordionSummary>
              <AccordionDetails style={{backgroundColor:'white'}}>
                <form>
                  <div style={{display:'flex', justifyContent:'center', marginTop:'10px'}}>
                    <TextField  label="Medio de Pago"  name="medioDePago"  value={nuevoMedioPago} onChange={(e) => setNuevoMedioPago(e.target.value)}/>
                  </div>
                  <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'12px'}}>
                    <button className='font-semibold' type="button" onClick={handleAgregar}>Agregar {isLoading && <LinearProgress />}</button>
                  </div>
                </form>
              </AccordionDetails>
            </Accordion>
        </div>
        </Grid>

        <Grid item xs={12} lg={6} className="input-container">
          <div className='tabla'>
            <h1>Tabla de Medios de Pago</h1>
            <table>
              <thead>
                <tr>
                  <th>Medio de Pago</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
              {isLoadingSkeleton ? (
                    <tr>
                      <td><Skeleton animation="wave" variant="rounded" width={210} height={30} /></td>
                      <td><Skeleton animation="wave" variant="rounded" width={210} height={30} /></td>
                    </tr>
                  ) : (
                mediopago.map((pagomedio => (
                  <tr key={pagomedio.nombreMedioPago}>
                    <td>{pagomedio.nombreMedioPago}</td>
                    <td>
                      <div className='botonera'>
                        <button className='borrar' onClick={() => handleBorrarClick(pagomedio.nombreMedioPago)}>
                          <MdOutlineMoneyOffCsred />
                        </button>
                        <button className='editar font-semibold' onClick={() => setMedioPagoSeleccionado(pagomedio.nombreMedioPago)}>
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))))
              }
              </tbody>
            </table>
            
            {medioPagoSeleccionado && (
              <div className='editar-medio-pago'>
                <h2>Editar nombre de medio de pago</h2>
                <TextField label={`Actualizar ${medioPagoSeleccionado}`}  name="nuevoMedioPago" value={actualizarMedioPago} onChange={(e) => setActualizarMedioPago(e.target.value)}/>
                <div style={{display:'flex', flexDirection:'row'}} className='my-3 gap-2'>
                  <button className='guardar' onClick={handleActualizar}>Guardar <br />{isLoadingEdit && <LinearProgress />}</button>
                  <button className='cancelar' onClick={handleCancelar}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </Grid>

      </Grid>
      <Footer />


      <Dialog open={showModal} onClose={handleCancelarBorrar}>
        <DialogTitle style={{ backgroundColor: '#006989', color: 'white', marginBottom: '5px' }}>Confirmar borrado de medio de pago</DialogTitle>
        <DialogContent>
          <DialogContentText>
          ¿Está seguro que desea borrar el medio de pago '{medioPagoToDelete}'?
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{display:'flex', flexDirection:'row', justifyContent:'center', gap:'5px'}}>
            <Button style={{padding:'10px', borderRadius:'50px'}} onClick={handleCancelarBorrar} variant='outlined' color='primary'>
              Cancelar
            </Button>
            <Button style={{padding:'10px', borderRadius:'50px'}} onClick={handleBorrar} color='primary' variant='contained' disabled={isLoadingDelete}>
              {isLoadingDelete ? <CircularProgress color="inherit"/> : 'Borrar'}
            </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleCloseSnackbar} anchorOrigin={isMobileScreen ? { vertical: 'top', horizontal: 'center' } : { vertical: 'bottom', horizontal: 'left' }}>
        <Alert variant='filled' severity="success" sx={{ width: '100%' }}>
          <AlertTitle>{titleMessage}</AlertTitle>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MediosPago;
