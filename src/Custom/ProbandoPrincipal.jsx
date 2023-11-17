import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Grid from '@mui/material/Grid';
import { GiMoneyStack } from "react-icons/gi";
import { FaUserTie } from "react-icons/fa6";
import { MdPendingActions } from "react-icons/md";
import { LuBadgeDollarSign } from "react-icons/lu";
import "../Styles/probandoppal.css"

const ProbandoPrincipal = () => {
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const [usdBlue, setUsdBlue] = useState(0);
  const [blueMes, setBlueMes] = useState(0);
  const [fechadesde, setFechaDesde] = useState('');
  const [fechahasta, setFechaHasta] = useState('');

  useEffect(() => {
    const initChart1 = () => {
      if (chart1Ref.current) {
        if (chart1Ref.current.chart) {
          chart1Ref.current.chart.destroy();
        }

        const ctx = chart1Ref.current.getContext('2d');
        const data = {
          labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
          datasets: [{
            label: 'Cantidad de pagos',
            data: [10, 15, 8, 12],
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
  }, []); // La dependencia vacía asegura que la función se ejecute solo una vez al montar el componente

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

  useEffect(() => {
    fetch('https://api.bluelytics.com.ar/v2/latest')
      .then(response => response.json())
      .then(data => {
        const blueData = data.blue;
        setUsdBlue(blueData.value_sell);
      })
      .catch(error => console.error('Error al obtener los datos: ', error));
  }, []);

    // Obtén la fecha actual
    const fechaActual = new Date();

    // Obtiene el número del día actual
    const diaActual = fechaActual.getDate();

    // Calcula el número del mes anterior
    const mesAnterior = fechaActual.getMonth();

    // Obtiene el número del año actual
    const añoActual = fechaActual.getFullYear();

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

  return (
    <>
        <div className='bg-blue-200' style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar/>

            <div style={{display:'flex', justifyContent:'center'}} className='mt-4'>
              <div className='bg-white p-2 rounded-lg' style={{display:'flex', flexDirection:'row', gap:'5px', justifyContent:'center', alignItems:'center'}}>
                <h5 className="text-blueGray-400 uppercase font-bold text-xs">Filtrar</h5>
                <div className="date-input-container">
                  <h4 className="text-blueGray-400 uppercase font-bold text-xs">desde</h4>
                  <input className="date-input" type="date" placeholder="FechaDesde" value={fechadesde} onChange={(e) => setFechaDesde(e.target.value)} />
                </div>
                <div className="date-input-container">
                  <h4 className="text-blueGray-400 uppercase font-bold text-xs">hasta</h4>
                  <input className="date-input" type="date" placeholder="FechaHasta" value={fechahasta} onChange={(e) => setFechaHasta(e.target.value)} />
                </div>             
              </div>
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
                        <span className="font-semibold text-xl text-blueGray-700">334,100</span>
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
                        <h5 className="text-blueGray-400 uppercase font-bold text-xs">Ver que le ponemos acá como metrica</h5>
                        <span className="font-semibold text-xl text-blueGray-700">Numero</span>
                        </div>
                        <div className="relative w-auto pl-4 flex-initial">
                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-blue-500">
                            <i className="fas fa-chart-pie"><FaUserTie style={{width:'30px', height:'30px'}}/></i>
                        </div>
                        </div>
                    </div>
                    <p className="text-sm text-blueGray-400 mt-4">
                        <span className="text-red-500 mr-2"><i className="fas fa-arrow-down"></i> Porcentaje%</span>
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
              </Grid>
            </Grid>

            <Grid className='mb-4' container spacing={2}>
              <Grid item xs={12} lg={6}>
                <div className='bg-white mx-2 p-2 rounded-lg'>
                  <canvas ref={chart1Ref}></canvas>
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