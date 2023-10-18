import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import TextField from '@mui/material/TextField';
import { MdOutlineMoneyOffCsred } from "react-icons/md";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { MdExpandMore } from "react-icons/md";
import '../Styles/mediosdepago.css';

const MediosPago = () => {
  const [mediopago, setMedioPago] = useState([]);
  const [nuevoMedioPago, setNuevoMedioPago] = useState('');
  const [medioPagoSeleccionado, setMedioPagoSeleccionado] = useState('');
  
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    fetch('https://apifolledo.onrender.com/mediodepago/nombremediopago')
      .then(response => response.json())
      .then(data => setMedioPago(data))
      .catch(error => console.error('Error al cargar los nombres de los medios de pago', error));
  };

  const handleBorrar = (nombreMedioPago) => {
    fetch(`https://apifolledo.onrender.com/mediodepago/borrarmediopago/${nombreMedioPago}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          console.log(`Medio de pago con nombre ${nombreMedioPago} borrado exitosamente.`);
          cargarDatos(); // Recargar la lista de medios de pago después de borrar uno
        } else {
          throw new Error('Error al borrar el medio de pago');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleAgregar = () => {
    fetch('https://apifolledo.onrender.com/mediodepago/agregarmediopago', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombreMedioPago: nuevoMedioPago }),
    })
    .then(response => {
      if (response.ok) {
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
    fetch(`https://apifolledo.onrender.com/mediodepago/actualizarmediopago/${medioPagoSeleccionado}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nuevoNombreMedioPago: nuevoMedioPago }),
    })
      .then(response => {
        if (response.ok) {
          console.log(`Medio de pago con nombre ${medioPagoSeleccionado} actualizado exitosamente.`);
          cargarDatos();
          setMedioPagoSeleccionado(null);
          setNuevoMedioPago('');
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
                    <button type="button" onClick={handleAgregar}>Agregar</button>
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
                {mediopago.map(pagomedio => (
                  <tr key={pagomedio.idMedioPago}>
                    <td>{pagomedio.nombreMedioPago}</td>
                    <td>
                      <div className='botonera'>
                        <button className='borrar' onClick={() => handleBorrar(pagomedio.nombreMedioPago)}>
                          <MdOutlineMoneyOffCsred />
                        </button>
                        <button className='editar' onClick={() => setMedioPagoSeleccionado(pagomedio.nombreMedioPago)}>
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {medioPagoSeleccionado && (
              <div className='editar-medio-pago'>
                <TextField  label={`Actualizar ${medioPagoSeleccionado}`}  name="nuevoMedioPago" value={nuevoMedioPago} onChange={(e) => setNuevoMedioPago(e.target.value)}/>
                <div style={{gap:'10px', display:'flex', flexDirection:'row'}}>
                  <button className='guardar' onClick={handleActualizar}>Guardar</button>
                  <button className='borrar' onClick={handleCancelar}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </Grid>

      </Grid>

      <Footer />
    </div>
  );
};

export default MediosPago;
