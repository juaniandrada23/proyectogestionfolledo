import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { MdDelete } from "react-icons/md";

const BotonEliminarPago = ({ pago, actualizarPagos }) => {

  const [modalOpen, setModalOpen] = useState(false);
  const [pagoAEliminar, setPagoAEliminar] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
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

  const abrirModalBorrar = (idPago) => {
    setModalOpen(true);
    setPagoAEliminar({ idPago });
  }; 

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  }; 

  const borrarPago = (idPago) => {
    setModalOpen(false);
    setSnackbarOpen(false);
  
    fetch(`https://apifolledo.onrender.com/pagos/${idPago}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          actualizarPagos();
          setSnackbarMessage('Pago borrado correctamente');
          setSnackbarOpen(true);
        } else {
          console.error('Error al borrar el pago');
        }
      })
      .catch(error => console.error('Error al borrar el pago', error));
  };

  return (
  <>
      <button style={{ backgroundColor: '#ff3d00', borderRadius: '20px', padding: '10px 20px',  color: '#fff', border: 'none',  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',  cursor: 'pointer', transition: 'background-color 0.3s ease'}} className='borrar' onClick={() => abrirModalBorrar(pago.idPago)}>
        <MdDelete />
      </button>

    <Dialog open={modalOpen} onClose={() => setModalOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle style={{ backgroundColor: '#006989', color: 'white', marginBottom: '5px' }} id="alert-dialog-title">Confirmar borrado de pago</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          ¿Está seguro de que quiere borrar el pago "{pagoAEliminar ? pagoAEliminar.idPago : ''}"? 
          <br/>
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
        <Button onClick={() => setModalOpen(false)} variant='outlined' color='primary'>
          Cancelar
        </Button>
        <Button onClick={() => borrarPago(pagoAEliminar.idPago)} autoFocus color='primary' variant='contained'>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>

    <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleCloseSnackbar} anchorOrigin={isMobileScreen ? { vertical: 'top', horizontal: 'center' } : { vertical: 'bottom', horizontal: 'left' }}>
      <Alert variant='filled' severity="success" sx={{ width: '100%' }}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
  </>
    )
}

export default BotonEliminarPago