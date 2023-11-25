import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Grid from '@mui/material/Grid';
import { GiMoneyStack } from "react-icons/gi";
import { FaUserTie } from "react-icons/fa6";
import { MdPendingActions } from "react-icons/md";
import { LuBadgeDollarSign } from "react-icons/lu";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { MdOutlineExpandCircleDown } from "react-icons/md";
import { AiFillFilter } from "react-icons/ai";
import Alert from '@mui/material/Alert';
import "../Styles/probandoppal.css"
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';

const ProbandoPrincipal = () => {
  // Obtén la fecha actual
  const fechaActual = new Date();

  // Obtiene el número del día actual
  const diaActual = fechaActual.getDate();

  // Calcula el número del mes anterior
  const mesAnterior = fechaActual.getMonth();

  // Obtiene el número del año actual
  const añoActual = fechaActual.getFullYear();

  //-----------------------------------Parametros-------------------------------------
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth <= 600);
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const [usdBlue, setUsdBlue] = useState(0);
  const [blueMes, setBlueMes] = useState(0);
  const [fechadesde, setFechaDesde] = useState('');
  const [fechahasta, setFechaHasta] = useState('');
  const [añoFiltrado, setAñoFiltrado] = useState(new Date().getFullYear().toString());
  const [error, setError] = useState('');
  const [endpointDesdeHasta, setEndpointDesdeHasta] = useState([]);
  const [pagosTotalesPorAño, setTodosPagosPorAño] = useState([]);
  const [pagosTotalesPorAñoFiltrado, setTodosPagosPorAñoFiltrado] = useState([]);
  const [condicion1, setCondicion1] = useState(true);
  const [condicion2, setCondicion2] = useState(false);
  const [condicion3, setCondicion3] = useState(false);

  const [pagosTotal, setPagosTotal] = useState([]);
  const [cantidadDelAñoFiltrado, setCantidadDelAñoFiltrado] = useState([]);
  const [cantidadFechasDesdeHasta, setCantidadFechasDesdeHasta] = useState([]);

    //Logica para hacer un breakpoint para el tamaño de la pantalla de celular
    const handleWindowResize = () => {
      setIsMobileScreen(window.innerWidth <= 600);
    };

    useEffect(() => {
      window.addEventListener('resize', handleWindowResize);
      return () => {
        window.removeEventListener('resize', handleWindowResize);
      };
    }, []);
    //-------------------------------------------------------------------------//

    // Logica para agregar un array de años para un select
    const años = [];
    for (let año = 2022; año <= 2035; año++) {
      años.push(año.toString());
    }

    // Primer grafico
    useEffect(() => {
      const initChart1 = () => {
        if (chart1Ref.current) {
          if (chart1Ref.current.chart) {
            chart1Ref.current.chart.destroy();
          }
    
          const ctx = chart1Ref.current.getContext('2d');     

          let labels = [];
          let datos = [];

          if (condicion1 === true) {
            labels = pagosTotalesPorAño.map(item => item.nombre_mes);
            datos = pagosTotalesPorAño.map(item => item.cantidad_pagos);

          } else if (condicion2 === true) {
            labels = pagosTotalesPorAñoFiltrado.map(item => item.nombre_mes);
            datos = pagosTotalesPorAñoFiltrado.map(item => item.cantidad_pagos);

          } else if (condicion3 === true) {
            labels = endpointDesdeHasta.map(item => { const parts = item.fecha.split('-'); return parts[2].substring(0, 2);});
            datos = endpointDesdeHasta.map(item => item.cantidad_pagos);
            
          }

          const data = {
            labels: labels,
            datasets: [{
              label: 'Cantidad de pagos',
              data: datos,
              backgroundColor: 'rgb(59 130 246)',
              hoverBackgroundColor: 'rgb(3 105 161)',
              borderColor: 'rgb(23 37 84)',
              borderWidth: 1,
            }],
          };
    
          chart1Ref.current.chart = new Chart(ctx, {
            type: 'bar',
            data: data,
          });
        }
      };
    
      initChart1();
    }, [endpointDesdeHasta, condicion1, condicion2, condicion3, pagosTotalesPorAño, pagosTotalesPorAñoFiltrado]); 

    // Segundo grafico
    useEffect(() => {
      const initChart2 = () => {
        if (chart2Ref.current) {
          if (chart2Ref.current.chart) {
            chart2Ref.current.chart.destroy();
          }
      
          const ctx = chart2Ref.current.getContext('2d');
          const data = {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            datasets: [
              {
                label: 'Ingresos',
                data: [300, 200, 400, 500],
                backgroundColor: 'rgb(59 130 246)',
                borderColor: 'rgb(59 130 246)',
                borderWidth: 2,
                pointBackgroundColor: 'rgb(96 165 250)',
                pointBorderColor: 'rgb(7 89 133)',
                pointHoverBackgroundColor: 'rgb(37 99 235)',
                pointHoverBorderColor: 'rgb(96 165 250)',
              },
              {
                label: 'Egresos',
                data: [200, 550, 200, 100],
                backgroundColor: 'rgb(220 38 38)',
                borderColor: 'rgb(220 38 38)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                pointBorderColor: 'rgb(153 27 27)',
                pointHoverBackgroundColor: 'rgb(220 38 38)',
                pointHoverBorderColor: 'rgb(220 38 38)',
              },
            ],
          };

          const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)',
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
              },
            },
          };
      
          chart2Ref.current.chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options,
          });
        }
      };

      initChart2();
    }, []);

    // Valor USD BLUE
    useEffect(() => {
      fetch('https://api.bluelytics.com.ar/v2/latest')
        .then(response => response.json())
        .then(data => {
          const blueData = data.blue;
          setUsdBlue(blueData.value_sell);
        })
        .catch(error => console.error('Error al obtener los datos: ', error));
    }, []);

    // Actualizacion USD BLUE comparacion de hace un mes
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`https://api.bluelytics.com.ar/v2/historical?day=${añoActual}-${mesAnterior}-${diaActual}`);
          const data = await response.json();
          const blueData = data.blue;
          setBlueMes(blueData.value_sell);
        } catch (error) {
          console.error('Error al obtener los datos: ', error);
        }
      };
    
      fetchData();
    }, [añoActual, mesAnterior, diaActual, blueMes]);
    
    const porcentaje = (((usdBlue - blueMes) / usdBlue) * 100).toFixed(2);

    // Endpoint consumido para fechadesde y fechahasta
    const filtroDesdeHasta = () => {
      if (fechadesde > fechahasta) {
        setError('Error: La fecha desde es mayor que la fecha hasta');
        return;
      } else if ( !fechadesde && !fechahasta) {
        setError('Error: Debe ingresar los datos para filtrar')
        return;
      }

      let endpointFiltroDesdeHasta =  `https://apifolledo.onrender.com/principal/filtrando?fechadesde=${fechadesde}&fechahasta=${fechahasta}`;

      let endpointCantidadPagosDesdeHasta =  `https://apifolledo.onrender.com/principal/filtrandocantidad?fechadesde=${fechadesde}&fechahasta=${fechahasta}`; 

      fetch(endpointFiltroDesdeHasta)
      .then((response) => {
        if (!response.ok) {
          if (response.status >= 500 && response.status <= 503) {
            throw new Error('Error: Conexión con el servidor perdida, intente nuevamente');
          } else {
            throw new Error('Error en la solicitud');
          }
        }
        return response.json();
      })
      .then((data) => {
        setEndpointDesdeHasta(data);
        setCondicion1(false);
        setCondicion2(false);
        setCondicion3(true);
        setError('');
      })
      .catch((error) => {
        setError('Error de conexion con el servidor, intente nuevamente');
      });

      fetch(endpointCantidadPagosDesdeHasta)
      .then((response) => {
        if (!response.ok) {
          if (response.status >= 500 && response.status <= 503) {
            throw new Error('Error: Conexión con el servidor perdida, intente nuevamente');
          } else {
            throw new Error('Error en la solicitud');
          }
        }
        return response.json();
      })
      .then((data) => {
        setCantidadFechasDesdeHasta(data);
        setCondicion1(false);
        setCondicion2(false);
        setCondicion3(true);
        setError('');
      })
      .catch((error) => {
        setError('Error de conexion con el servidor, intente nuevamente');
      });
    }

    // Endpoint consumido para cantidad de pagos
    useEffect(() => {
      fetch('https://apifolledo.onrender.com/principal/contando')
        .then(response => response.json())
        .then(data => {
          setPagosTotal(data);
        })
        .catch(error => console.error('Error al obtener los datos: ', error));
    }, []);

    // Endpoint para consumir por canvas para cantidad de pagos por año actual
    useEffect(() => {
      fetch('https://apifolledo.onrender.com/principal/pagosporanio')
        .then(response => response.json())
        .then(data => {
          setTodosPagosPorAño(data);
          setCondicion1(true);
          setCondicion2(false);
          setCondicion3(false);
        })
        .catch(error => console.error('Error al obtener los datos: ', error));
    }, []);

    // Endpoint para consumir por canvas para cantidad de pagos por año filtrado
    const filtroPagosPorAño = () => {
      if (!añoFiltrado) {
        setError('Error: Debe ingresar el año para filtrar')
        return;
      }

      let endpointFiltroPagosPorAño =  `https://apifolledo.onrender.com/principal/pagosporaniofiltrado?añoFiltrado=${añoFiltrado}`;

      let endpointCantidadPorAño =  `https://apifolledo.onrender.com/principal/totalpagofiltradoporanio?añoFiltrado=${añoFiltrado}`;

      fetch(endpointFiltroPagosPorAño)
      .then((response) => {
        if (!response.ok) {
          if (response.status >= 500 && response.status <= 503) {
            throw new Error('Error: Conexión con el servidor perdida, intente nuevamente');
          } else {
            throw new Error('Error en la solicitud');
          }
        }
        return response.json();
      })
      .then((data) => {
        setTodosPagosPorAñoFiltrado(data);
        setError('');
        setCondicion1(false);
        setCondicion2(true);
        setCondicion3(false);
      })
      .catch((error) => {
        setError('Error de conexion con el servidor, intente nuevamente');
      });
 
      fetch(endpointCantidadPorAño)
      .then((response) => {
        if (!response.ok) {
          if (response.status >= 500 && response.status <= 503) {
            throw new Error('Error: Conexión con el servidor perdida, intente nuevamente');
          } else {
            throw new Error('Error en la solicitud');
          }
        }
        return response.json();
      })
      .then((data) => {
        setCantidadDelAñoFiltrado(data);
        setError('');
        setCondicion1(false);
        setCondicion2(true);
        setCondicion3(false);
      })
      .catch((error) => {
        setError('Error de conexion con el servidor, intente nuevamente');
      });
    }

    //------------------------------------------------------------------------------------------------------------------------------//
    let cantidadDePagos = "";

    if (condicion1 === true) {
      cantidadDePagos = pagosTotal.map(item => item.total_pagos);

    } else if (condicion2 === true) {
      cantidadDePagos = cantidadDelAñoFiltrado.map(item => item.totalPagos);

    } else if (condicion3 === true) {
      cantidadDePagos = cantidadFechasDesdeHasta.map(item => item.cantidad_pagos);

    }

    //--------------------------------------------------------DRAWER------------------------------------------------------------------//
    const [state, setState] = React.useState({
      bottom: false,
    });
  
    const toggleDrawer = (anchor, open) => (event) => {
      if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
  
      setState({ ...state, [anchor]: open });
    };
  
    const list = (anchor) => (
        <>
        <List>
          <Accordion>
            <AccordionSummary expandIcon={<MdOutlineExpandCircleDown style={{color:'#004E66', backgroundColor:'#EAEBED', borderRadius:'50px'}}/>} aria-controls="panel1a-content" id="panel1a-header" style={{ textAlign: 'center', backgroundColor:'#006989 '}}>
                  <h5 className="text-blueGray-400 uppercase font-bold text-xs" style={{color:'#EAEBED'}}>Filtrar</h5>
                  </AccordionSummary>
            <AccordionDetails>
                <div className="date-input-container my-2 primerdiv">
                  <h4 className="text-blueGray-400 uppercase font-bold text-xs">desde</h4>
                  <input className="date-input" type="date" placeholder="FechaDesde" value={fechadesde} onChange={(e) => setFechaDesde(e.target.value)} />
                </div>
                <div className="date-input-container my-2 segundodiv">
                  <h4 className="text-blueGray-400 uppercase font-bold text-xs">hasta</h4>
                  <input className="date-input" type="date" placeholder="FechaHasta" value={fechahasta} onChange={(e) => setFechaHasta(e.target.value)} />
                </div> 
                <div className='primerbotondiv'>
                  <button className='text-blueGray-400 uppercase font-bold text-xs' onClick={filtroDesdeHasta}>Filtrar desde/hasta</button>
                </div>
            </AccordionDetails>
          </Accordion> 
        </List>
        <Divider/>
        <List>
        <Accordion>
            <AccordionSummary expandIcon={<MdOutlineExpandCircleDown style={{color:'#004E66', backgroundColor:'#EAEBED', borderRadius:'50px'}}/>} aria-controls="panel1a-content" id="panel1a-header" style={{ textAlign: 'center', backgroundColor:'#006989 '}}>
              <h5 className="text-blueGray-400 uppercase font-bold text-xs" style={{color:'#EAEBED'}}>Filtrar por año</h5>
            </AccordionSummary>
            <AccordionDetails>
              <div className="date-input-container tercerdiv">
                <h4 className="text-blueGray-400 uppercase font-bold text-xs">Año</h4>
                <select className="date-input" value={añoFiltrado} onChange={(e) => setAñoFiltrado(e.target.value)}>
                    {años.map((año) => (
                      <option key={año} value={año}>
                        {año}
                      </option>
                    ))}
                </select>
              </div>
              <div className='primerbotondiv'>
                <button className='text-blueGray-400 uppercase font-bold text-xs' onClick={filtroPagosPorAño}>Filtrar por año</button>
              </div>
            </AccordionDetails>
        </Accordion>    
        </List>
        </>
    );
    //-------------------------------------------------------------------------------------------------------------------------------//

  return (
    <>
        <div className='bg-blue-200' style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar/>
            <div className='alerta p-4' style={{display:'flex', flexDirection:'column', justifyContent:'center', marginTop:'5px', marginBottom:'5px', color:'red'}}>
              {error && <Alert severity="error"><strong>{error} </strong></Alert>}
            </div>

            <Grid className='mb-4' container spacing={1} style={{ flexGrow: 1 }}>
              <Grid item xs={12} lg={12}>
              <div className="flex flex-wrap">
                <div className="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5 mb-4">
                <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
                    <div className="flex-auto p-4">
                    <div className="flex flex-wrap">
                        <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                        <h5 className="text-blueGray-400 uppercase font-bold text-xs"> Pagos</h5>
                          <span className="font-semibold text-xl text-blueGray-700">{cantidadDePagos}</span>
                        </div>
                        <div className="relative w-auto pl-4 flex-initial">
                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-blue-500">
                            <i className="fas fa-chart-bar"><GiMoneyStack style={{width:'37px', height:'37px'}}/></i>
                        </div>
                        </div>
                    </div>
                    <p className="text-sm text-blueGray-400 mt-4">
                        <span className="text-emerald-500 mr-2"><i className="fas fa-arrow-up"></i> 2,99% </span>
                        <span className="whitespace-nowrap"> Since last month </span></p>
                    </div>
                </div>
                </div>

                <div className=" mt-4 w-full lg:w-6/12 xl:w-3/12 px-5">
                <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-4 xl:mb-0 shadow-lg">
                    <div className="flex-auto p-4">
                    <div className="flex flex-wrap">
                        <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                        <h5 className="text-blueGray-400 uppercase font-bold text-xs">Usuarios</h5>
                        <span className="font-semibold text-xl text-blueGray-700">5</span>
                        </div>
                        <div className="relative w-auto pl-4 flex-initial">
                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-blue-500">
                            <i className="fas fa-chart-pie"><FaUserTie style={{width:'30px', height:'30px'}}/></i>
                        </div>
                        </div>
                    </div>
                    <p className="text-sm text-blueGray-400 mt-4">
                        <span className="text-red-500 mr-2"><i className="fas fa-arrow-down"></i> Porcentaje %</span>
                        <span className="whitespace-nowrap"> Desde... </span></p>
                    </div>
                </div>
                </div>

                <div className="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5">
                <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
                    <div className="flex-auto p-4">
                    <div className="flex flex-wrap">
                        <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                        <h5 className="text-blueGray-400 uppercase font-bold text-xs">Pagos pendientes</h5>
                        <span className="font-semibold text-xl text-blueGray-700">901</span>
                        </div>
                        <div className="relative w-auto pl-4 flex-initial">
                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-blue-500">
                            <i className="fas fa-users"><MdPendingActions style={{width:'33px', height:'33px'}}/></i>
                        </div>
                        </div>
                    </div>
                    <p className="text-sm text-blueGray-400 mt-4">
                        <span className="text-red-500 mr-2"><i className="fas fa-arrow-down"></i> 1,25% </span>
                        <span className="whitespace-nowrap"> Since yesterday </span></p>
                    </div>
                </div>
                </div>

                <div className="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5">
                <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
                    <div className="flex-auto p-4">
                    <div className="flex flex-wrap">
                        <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                        <h5 className="text-blueGray-400 uppercase font-bold text-xs">Valor dolar blue</h5>
                        <span className="font-semibold text-xl text-blueGray-700">${usdBlue} </span>
                        </div>
                        <div className="relative w-auto pl-4 flex-initial">
                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-blue-500">
                            <i className="fas fa-percent"><LuBadgeDollarSign style={{width:'33px', height:'33px'}}/></i>
                        </div>
                        </div>
                    </div>
                    <p className="text-sm text-blueGray-400 mt-4">
                        <span className={porcentaje >= 0 ? 'text-red-500 mr-2' : 'text-emerald-500 mr-2'}>
                          <i className={`fas fa-arrow-${porcentaje >= 0 ? 'up' : 'down'}`}></i> {porcentaje}%
                        </span>
                        <span className="whitespace-nowrap">Desde hace un mes</span>
                    </p>
                    </div>
                </div>
                </div>
              </div>
              
              <div className='mt-4 divfiltros'>
                <div style={{display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center'}}>
                  <button className="text-blueGray-400 uppercase font-bold text-xs" onClick={toggleDrawer('bottom', true)}>Filtros <AiFillFilter style={{color:'white', width:'17px', height:'17px'}}/></button>
                </div>
                <SwipeableDrawer anchor="bottom" open={state.bottom} onClose={toggleDrawer('bottom', false)} onOpen={toggleDrawer('bottom', true)}>
                    {list('bottom')}
                </SwipeableDrawer>
              </div>

              </Grid>
            </Grid>

            <Grid className='mb-4' container spacing={2}>
              <Grid item xs={12} lg={6}>
                <div className='bg-white mx-2 p-2 rounded-lg'>
                  <canvas ref={chart1Ref} width={300} height={isMobileScreen ? 270 : 150}></canvas>
                </div>
              </Grid>
              <Grid item xs={12} lg={6}>
                <div className='bg-white mx-2 p-2 rounded-lg'>
                  <canvas ref={chart2Ref} width={300} height={315}></canvas>
                </div>
              </Grid>
            </Grid>
          <Footer style={{ flexShrink: 0 }}/>
      </div>
    </>
  )
}

export default ProbandoPrincipal