import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const MediosPago = () => {
  const [mediopago, setNombreMedioPago] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [nuevoPago, setNuevoPago] = useState('');

  useEffect(() => {
    fetch('https://apifolledo.onrender.com/mediodepago/nombremediopago')
      .then(response => response.json())
      .then(data => setNombreMedioPago(data))
      .catch(error => console.error('Error al cargar los nombres de los medios de pago', error));
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAgregarPago = () => {
    // Lógica para enviar el nuevo pago al backend
    // ...

    // Cerrar el modal después de agregar el pago
    handleCloseModal();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Grid container spacing={1} style={{ flexGrow: 1, padding: 20 }}>
        <Grid item xs={12} lg={12} style={{textAlign:'center', alignItems:'center', justifyContent:'center'}}>
          <h1 style={{ textAlign: 'center' }}>Tabla para medios de pagos</h1>
          <ul>
            {mediopago.map((item, index) => (
              <li key={index}>{item.nombreMedioPago}</li>
            ))}
          </ul>
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Agregar Medio de Pago
          </Button>
        </Grid>
      </Grid>
      <Footer />

      {/* Modal para agregar medio de pago */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="div" gutterBottom>
            Agregar Medio de Pago
          </Typography>
          <TextField
            label="Nombre del nuevo medio de pago"
            variant="outlined"
            fullWidth
            value={nuevoPago}
            onChange={e => setNuevoPago(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <Button variant="contained" color="primary" onClick={handleAgregarPago}>
            Agregar
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default MediosPago;
