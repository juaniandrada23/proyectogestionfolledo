import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import TextField from '@mui/material/TextField';
import { MdAttachMoney, MdOutlineMoneyOffCsred } from "react-icons/md";
import '../Styles/mediosdepago.css';

const MediosPago = () => {
  const [mediopago, setMedioPago] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    fetch('https://apifolledo.onrender.com/mediodepago/nombremediopago')
      .then(response => response.json())
      .then(data => setMedioPago(data))
      .catch(error => console.error('Error al cargar los nombres de los medios de pago', error));
  };

  const handleBorrar = (id) => {
    // Lógica para borrar el medio de pago con el ID proporcionado
    console.log(`Borrando medio de pago con ID: ${id}`);
  };

  const handleModificar = (id) => {
    // Lógica para modificar el medio de pago con el ID proporcionado
    console.log(`Modificando medio de pago con ID: ${id}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#EAEBED' }}>
      <Navbar />

      <Grid container spacing={1} style={{ flexGrow: 1, padding: '20px', justifyContent: 'center' }}>
        <Grid item xs={12} lg={12}>
          <div className='tabla'>
            <h1>Agregar/Modificar medio de pago</h1>
            <form>
              <div style={{display:'flex', justifyContent:'center'}}>
                <TextField label="Medio de Pago" name="medioDePago"/>
              </div>
              <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'12px'}}>
                <button>Agregar/Modificar medio de pago</button>
              </div>
            </form>
          </div>
        </Grid>

        <Grid item xs={12} lg={12} className="input-container">
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
                {mediopago.map(pagomedio => (
                  <tr key={pagomedio.idMedioPago}>
                    <td>{pagomedio.nombreMedioPago}</td>
                    <td>
                      <div className='botonera'>
                        <button className='modificar' onClick={() => handleModificar(pagomedio.idMedioPago)}><MdAttachMoney/></button>
                        <button className='borrar' onClick={() => handleBorrar(pagomedio.idMedioPago, pagomedio.nombreMedioPago)}><MdOutlineMoneyOffCsred/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Grid>
      </Grid>

      <Footer />
    </div>
  );
};

export default MediosPago;
