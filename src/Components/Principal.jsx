import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Container from '@mui/material/Container';
import Chart from 'chart.js/auto';
import '../Styles/principal.css';
import { Typography, Paper } from '@mui/material';
import useAuthorization from '../Functions/useAuthorization';
import { useTimeout } from '../Functions/timeOut';
import Alert from '@mui/material/Alert';

const Principal = () => {
  useAuthorization();

  const nombreDelUsuario  = localStorage.getItem("userName");
  const [chartData, setChartData] = useState(null);
  const [fechadesde, setFechaDesde] = useState('');
  const [fechahasta, setFechaHasta] = useState('');
  const [errorMsg, setErrorMensaje] = useState('');
  const [blue, setBlue] = useState({
    value_avg: null,
    value_sell: null,
    value_buy: null,
  });

  useTimeout();

  useEffect(() => {
    fetch('https://api.bluelytics.com.ar/v2/latest')
      .then(response => response.json())
      .then(data => {
        const blueData = data.blue;

        setBlue({
          value_avg: blueData.value_avg,
          value_sell: blueData.value_sell,
          value_buy: blueData.value_buy,
        });
      })
      .catch(error => console.error('Error al obtener los datos: ', error));
  }, []);

  //VER BIEN EL MANEJO ACA CUANDO SE CAE EL SERVIDOR
  const obtenerDatos = () => {
    fetch(`https://apifolledo.onrender.com/calculos/ingresosyegresos?fechadesde=${fechadesde}&fechahasta=${fechahasta}`)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            setErrorMensaje('Parametros mal ingresados');
          } else if (response.status === 503) {
            setErrorMensaje('Error de conexion con el servidor');
          }
          throw new Error(`Error ${response.status}`);
        } else {
          setErrorMensaje('');
        }
        return response.json();
      })
      .then((data) => {
        const ingresos = data.Ingresos;
        const egresos = data.Egresos;
  
        const chartData = {
          labels: ['Ingresos', 'Egresos'],
          datasets: [
            {
              data: [ingresos, egresos],
              backgroundColor: ['green', 'red'],
            },
          ],
        };
  
        setChartData(chartData);
      })
      .catch((error) => {
        console.error('Error al obtener los datos de ingresos y egresos: ', error);
      });
  };  

  useEffect(() => {
    if (chartData) {
      const ctx = document.getElementById('miGrafico').getContext('2d');
      
      if (window.myDoughnutChart) {
        window.myDoughnutChart.destroy();
      }
  
      window.myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
      });
    }
  }, [chartData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className='todo'>
        <Container maxWidth="sm" className='primercontainer shadow-2xl'>
          <div className='saludo' style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center', marginBottom:'15px'}}>
            <h1 style={{ textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}>Bienvenido <p style={{fontWeight:'bold'}}>{nombreDelUsuario}</p></h1>
            <h1 style={{ textAlign: 'center', marginBottom:'5px' }}>Gráfico de Pagos por fecha seleccionada</h1>
            {errorMsg &&  <Alert style={{marginBottom:'5px'}} severity="error">{errorMsg}</Alert>}
            <div className='ingresodatos' style={{ justifyContent: 'flex-start', marginBottom: '10px', flexDirection: 'column', display: 'flex', gap: '5px' }}>
              <div className="date-input-container">
                <h4 style={{ fontWeight: 'bold' }}>Desde</h4>
                <input className="date-input" type="date" placeholder="FechaDesde" value={fechadesde} onChange={(e) => setFechaDesde(e.target.value)} />
              </div>
              <div className="date-input-container">
                <h4 style={{ fontWeight: 'bold' }}>Hasta</h4>
                <input className="date-input" type="date" placeholder="FechaHasta" value={fechahasta} onChange={(e) => setFechaHasta(e.target.value)} />
              </div>
            </div>
            <button className='botondatos' onClick={obtenerDatos}>Obtener Datos</button>
            <canvas id="miGrafico" width="400" height="400"></canvas>
          </div>
        </Container>
        <Container maxWidth="lg">
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Paper elevation={3} style={{ padding: '30px', margin: '20px', textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={'bold'}>Valores del Dolar Blue</Typography>
              <Typography variant="body1">Valor promedio: {blue.value_avg}</Typography>
              <Typography variant="body1">Valor de venta: {blue.value_sell}</Typography>
              <Typography variant="body1">Valor de compra: {blue.value_buy}</Typography>
            </Paper>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Principal;
