import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Grid from '@mui/material/Grid';  

const MediosPago = () => {
  const [mediopago, setNombreMedioPago] = useState([]);

  useEffect(() => {
    fetch('https://apifolledo.onrender.com/mediodepago/nombremediopago')
      .then(response => response.json())
      .then(data => setNombreMedioPago(data))
      .catch(error => console.error('Error al cargar los nombres de los medios de pago', error));
  }, []);

  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar/>
      <Grid container spacing={1} style={{ flexGrow: 1 }}>
        <Grid item xs={12} lg={12}>
          <h1 style={{ textAlign: 'center' }}>Tabla para medios de pagos</h1>
          <ul>
            {mediopago.map((item, index) => (
              <li key={index}>{item.nombreMedioPago}</li>
            ))}
          </ul>
        </Grid>
      </Grid>
      <Footer/>
    </div>
  )
}

export default MediosPago