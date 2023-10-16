import React, { useState, useEffect } from 'react';
import '../Styles/calculos.css'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { Grid } from '@mui/material'
import useAuthorization from '../Functions/useAuthorization';
import { useTimeout } from '../Functions/timeOut';
import jsPDF from 'jspdf';
import Chart from 'chart.js/auto';
import 'jspdf-autotable';
import { FaRegFilePdf } from "react-icons/fa6";
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import EstadoServicio from '../Components/EstadoServicio.jsx'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { MdExpandMore } from "react-icons/md";
import Skeleton from '@mui/material/Skeleton';
  
const Calculos = () => {
  useAuthorization();

  const [chartData, setChartData] = useState(null);
  const [calculos, setCalculos] = useState([]);
  const [calculosTotales, setCalculosTotales] = useState([]);
  const [pagosTotales, setPagosTotales] = useState([]);
  const [nombreproveedores, setNombreProveedores] = useState([]);
  const [totales, setTotales] = useState([]);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [fechaDesdeTotal, setFechaDesdeTotal] = useState("");
  const [fechaHastaTotal, setFechaHastaTotal] = useState("");
  const [nombreProveedorFiltro, setNombreProveedorFiltro] = useState("");
  const [error, setError] = useState('');
  const [errorPDF, setErrorPDF] = useState('');
  const [errorTotal, setErrorTotal] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useTimeout();

  useEffect(() => {
    fetch('https://apifolledo.onrender.com/calculos/total')
      .then(response => response.json())
      .then(data => {setTotales(data); 
                    setIsLoading(false);})
      .catch(error => console.error('Error al cargar los nombres de los calculos', error));
  }, []);

  const aplicarFiltros = () => {  
    if (!nombreProveedorFiltro || !fechaDesde || !fechaHasta) {
      setError('Error: Datos deben ser requeridos para poder aplicar el filtrado');
      return;
    } else if (fechaDesde > fechaHasta) {
      setError('Error: La fecha desde es mayor que la fecha hasta');
      return;
    }    

    fetch(`https://apifolledo.onrender.com/calculos/filtrando?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}&nombreProveedor=${nombreProveedorFiltro}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCalculos(data);
          setError('');
        } else {
          console.error("La respuesta del servidor no es un arreglo:", data);
        }
      })
      .catch((error) => console.error("Error al aplicar filtros:", error));
  }; 

  const aplicarFiltroTotal = () => {  
    if (!fechaDesdeTotal || !fechaHastaTotal) {
      setErrorTotal('Error: Datos requeridos');
      return;
    } else if (fechaDesdeTotal > fechaHastaTotal) {
      setErrorTotal('Error: La fecha desde es mayor que la fecha hasta');
      return;
    } else {
      setErrorTotal('');
    }    

    fetch(`https://apifolledo.onrender.com/calculos/totalgeneral?fechaDesde=${fechaDesdeTotal}&fechaHasta=${fechaHastaTotal}`)
    .then(response => response.json())
    .then(data => setCalculosTotales(data))
    .catch(error => console.error('Error al cargar los nombres de los calculos', error));

    var apiUrl = `https://apifolledo.onrender.com/pagos/filtrando?fechadesde=${fechaDesdeTotal}&fechahasta=${fechaHastaTotal}&nombreProveedor=${nombreProveedorFiltro}`;

    fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      return response.json();
    })
    .then((data) => {
      setPagosTotales(data);
    })
    .catch((error) => {
      setError('Error al aplicar filtros: ' + error.message);
      console.error("Error al aplicar filtros:", error);
    });

    fetch(`https://apifolledo.onrender.com/calculos/ingresosyegresos?fechadesde=${fechaDesdeTotal}&fechahasta=${fechaHastaTotal}`)
      .then((response) => response.json())
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
        
        const chartOptions = {
          plugins: {
            title: {
              display: true,
              text: 'Grafico Semanal',
              font: {
                size: 18,
                weight: 'bold',
              },
            },
          },
        };
        
        setChartData({ data: chartData, options: chartOptions });
      })
      .catch((error) =>
        console.error('Error al obtener los datos de ingresos y egresos: ', error)
      );
  };

  useEffect(() => {
    fetch('https://apifolledo.onrender.com/proveedores/nombreprov')
      .then(response => response.json())
      .then(data => setNombreProveedores(data))
      .catch(error => console.error('Error al cargar los nombres de los proveedores', error));
  }, []);

  const handleFechaDesdeChange = (event) => {
    setFechaDesde(event.target.value);
  };
  
  const handleFechaHastaChange = (event) => {
    setFechaHasta(event.target.value);
  };

  const handlefechaDesdeTotalChange = (event) => {
    setFechaDesdeTotal(event.target.value);
  };
  
  const handlefechaHastaTotalChange = (event) => {
    setFechaHastaTotal(event.target.value);
  };
  
  const handleNombreProveedorFiltroChange = (event) => {
    setNombreProveedorFiltro(event.target.value);
  };

  useEffect(() => {
    if (chartData) {
      const ctx = document.getElementById('miGrafico').getContext('2d');

      if (window.myDoughnutChart) {
        window.myDoughnutChart.destroy();
      }

      window.myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: chartData.data,
        options: chartData.options,
      });

      document.getElementById('miGrafico').style.backgroundColor = '#FDFDFF';
    }
  }, [chartData]);

  //------------------------------------------------------------GENERACION DE PDF FINAL---------------------------------------------------------------------------//
  const generarPDF = async () => {
    if (!calculosTotales || calculosTotales.length === 0) {
      setErrorPDF('Error: No hay datos disponibles para generar el PDF.');
      return;
    } else {
      setErrorPDF('');
    }
  
    const chartCanvas = document.getElementById('miGrafico');

    const doc = new jsPDF();
  
    const logoImgUrl = "https://cdn-icons-png.flaticon.com/512/746/746859.png";
  
    try {
      const response = await fetch(logoImgUrl);
      const logoImgBlob = await response.blob();
  
      //------------------------------------------------//
      const chartImage = await html2canvas(chartCanvas, {
        scale: 3,
      });
      const chartImageData = chartImage.toDataURL('image/jpeg', 0.9); // 0.9 es la calidad (0 a 1)
      doc.addImage(chartImageData, 'JPEG', 130, 5, 65, 65);
      //-----------------------------------------------//
      const reader = new FileReader();
      reader.readAsDataURL(logoImgBlob);
  
      reader.onloadend = () => {
        const logoImgBase64 = reader.result;
  
        doc.addImage(logoImgBase64, 'PNG', 10, 10, 40, 40);
  
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0); // Color de texto en RGB (negro)
        doc.text('Informe de Cálculos', 60, 30);
  
        // Agregar fechas
        doc.setFontSize(12);
        doc.text(`Fecha desde: ${fechaDesdeTotal}`, 60, 40);
        doc.text(`Fecha hasta: ${fechaHastaTotal}`, 60, 50);
  
        // Crear una tabla para los datos
        const columns = ["Fecha desde", "Fecha hasta", "Ingresos", "Ingresos USD", "Egresos", "Egresos USD", "Monto Total", "Monto Total en USD"];
        const rows = calculosTotales.map(totalCalculado => [
          fechaDesdeTotal,
          fechaHastaTotal,
          totalCalculado.Ingresos,
          totalCalculado.IngresosUSD,
          totalCalculado.Egresos,
          totalCalculado.EgresosUSD,
          totalCalculado.MontoTotal,
          totalCalculado.MontoTotalUSD,
        ]);
  
        doc.autoTable({
          head: [columns],
          body: rows,
          startY: 74,
        });

        doc.setFontSize(18);
        doc.text('Pagos realizados:', 80, 102);

        const columnsPagos = ["Proveedor", "Monto", "Medio de Pago", "Monto en USD", "Dolar del día", "Fecha del pago", "Usuario que registró el pago"];
        const rowsPagos = pagosTotales.map(pago => [
          pago.nombre,
          pago.monto,
          pago.nombreMedioPago,
          pago.montoUSD,
          pago.usdDelDia,
          format(new Date(pago.fecha), 'yyyy-MM-dd'),
          pago.username,
        ]);

        doc.autoTable({
          head: [columnsPagos],
          body: rowsPagos,
          startY: 105,
          theme: 'grid',
          styles: {
            fontSize: 10,
            textColor: [33, 33, 33],
            cellPadding: 2,
          },
          columnStyles: {
            0: { fontStyle: 'bold' },
          },
        });
  
        doc.save(`Informe_Calculos_${fechaDesdeTotal}_${fechaHastaTotal}.pdf`);
      };
    } catch (error) {
      console.error('Error al descargar y agregar la imagen:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar/>
      <Grid container spacing={2} style={{ flexGrow: 1 }}>
            <Grid item xs={12} lg={4}>

              <div className='parametroscalculos'>
                <Accordion style={{ textAlign: 'center', marginTop: '10px', marginBottom:'10px', backgroundColor:'#006989', marginRight:'20px', marginLeft:'20px'}}>
                  <AccordionSummary expandIcon={< MdExpandMore style={{color:'#004E66', backgroundColor:'#EAEBED', borderRadius:'50px'}}/>} aria-controls="panel1a-content" id="panel1a-header">
                    <h1 style={{color:'#EAEBED'}}>Filtrar fechas para generación de PDF</h1>
                  </AccordionSummary>
                  <AccordionDetails style={{backgroundColor:'white'}}>
                    <div className='parametrostotal'>
                      <label htmlFor="fechaDesdeTotal">Fecha desde total:</label>
                      <input className='date-input' type="date" id="fechaDesdeTotal" value={fechaDesdeTotal} onChange={handlefechaDesdeTotalChange}/>
                      <label htmlFor="fechaHastaTotal">Fecha hasta total:</label>
                      <input className='date-input' type="date" id="fechaHastaTotal" value={fechaHastaTotal} onChange={handlefechaHastaTotalChange}/>
                      <button onClick={aplicarFiltroTotal}>Aplicar Calculos Totales</button>
                      {errorTotal && <p style={{marginBottom:'5px', color:'red'}} className="error-message">{errorTotal}</p>}
                      {errorPDF && <p style={{marginBottom:'5px', color:'red'}} className="error-message">{errorPDF}</p>}
                    </div>
                  </AccordionDetails>
                </Accordion>
                <br />

                <Accordion style={{ textAlign: 'center', marginTop: '10px', marginBottom:'10px', backgroundColor:'#006989', marginRight:'20px', marginLeft:'20px'}}>
                  <AccordionSummary expandIcon={< MdExpandMore style={{color:'#004E66', backgroundColor:'#EAEBED', borderRadius:'50px'}}/>} aria-controls="panel1a-content" id="panel1a-header">
                    <h1 style={{color:'#EAEBED'}}>Filtrar para montos totales por Proveedor</h1>
                  </AccordionSummary>
                  <AccordionDetails style={{backgroundColor:'white'}}>
                    <div className='todoslosparametros'>
                        <label htmlFor="fechaDesde">Fecha Desde:</label>
                        <input className='date-input' type="date" id="fechaDesde" value={fechaDesde} onChange={handleFechaDesdeChange} />
                        <label htmlFor="fechaHasta">Fecha Hasta:</label>
                        <input className='date-input' type="date" id="fechaHasta" value={fechaHasta} onChange={handleFechaHastaChange} />
                        <label htmlFor="nombreProveedorFiltro">Nombre del Proveedor:</label>
                        <select className='date-input' id="nombreProveedorFiltro" value={nombreProveedorFiltro} onChange={handleNombreProveedorFiltroChange}>
                          <option value="">Seleccione</option>
                          {nombreproveedores.map((proveedor) => (
                            <option key={proveedor.nombre} value={proveedor.nombre}>
                              {proveedor.nombre}
                            </option>
                          ))}
                        </select>
                      <button onClick={aplicarFiltros}>Aplicar Filtros</button>
                      {error && <p style={{marginBottom:'5px', color:'red'}} className="error-message">{error}</p>}
                    </div>
                  </AccordionDetails>
                </Accordion>  


                {/* VER BIEN ESTO!!!*/}
                <div style={{ position: 'absolute', left: '-9999px' }}>
                  <canvas id="miGrafico"></canvas>
                </div>

              </div>

            </Grid>
            <Grid item xs={12} lg={8}>
              <div className='tablamontototalfiltrado'>
                <h1>Tabla generada para el PDF</h1>
                <table>
                  <thead>
                    <tr>
                      <th>Fecha desde</th>
                      <th>Fecha hasta</th>
                      <th>Ingresos</th>
                      <th>Ingresos USD</th>
                      <th>Egresos</th>
                      <th>Egresos USD</th>
                      <th>Monto Total</th>
                      <th>Monto Total USD</th>
                    </tr>
                  </thead>
                  <tbody>
                  {calculosTotales.map((totalCalculado, index) => (
                      <tr key={index}>
                        <td>{fechaDesdeTotal}</td>
                        <td>{fechaHastaTotal}</td>
                        <td>{totalCalculado.Ingresos}</td>
                        <td>{totalCalculado.IngresosUSD}</td>
                        <td>{totalCalculado.Egresos}</td>
                        <td>{totalCalculado.EgresosUSD}</td>
                        <td>{totalCalculado.MontoTotal}</td>
                        <td>{totalCalculado.MontoTotalUSD}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={generarPDF}>Generar PDF <FaRegFilePdf style={{width:'20px', height:'20px'}}/></button>
              </div>
              <div className='tablacalculostotales'>
                <h1>Montos totales de proveedores</h1>
                <table>
                  <thead>
                    <tr>
                      <th>Nombre del Proveedor</th>
                      <th>Ingresos</th>
                      <th>Ingresos USD</th>
                      <th>Egresos</th>
                      <th>Egresos USD</th>
                      <th>Monto Total</th>
                      <th>Monto Total USD</th>
                    </tr>
                  </thead>
                  <tbody>
                  {isLoading ? (
                    <tr>
                      <td><Skeleton animation="wave" variant="rounded" width={210} height={30} /></td>
                      <td><Skeleton animation="wave" variant="rounded" width={210} height={30} /></td>
                      <td><Skeleton animation="wave" variant="rounded" width={210} height={30} /></td>
                      <td><Skeleton animation="wave" variant="rounded" width={210} height={30} /></td>
                      <td><Skeleton animation="wave" variant="rounded" width={210} height={30} /></td>
                      <td><Skeleton animation="wave" variant="rounded" width={210} height={30} /></td>
                      <td><Skeleton animation="wave" variant="rounded" width={210} height={30} /></td>
                    </tr>
                  ) : (
                    totales.map((total, index) => (
                      <tr key={index}>
                        <td>{total.NombreProveedor}</td>
                        <td>{total.Ingresos}</td>
                        <td>{total.IngresosUSD}</td>
                        <td>{total.Egresos}</td>
                        <td>{total.EgresosUSD}</td>
                        <td>{total.MontoTotalHastaElMomento}</td>
                        <td>{total.MontoTotalEnUSD}</td>
                      </tr>
                    ))
                    )}

                  </tbody>
                </table>
              </div>
              <div className='tablacalculos'>
                <h1>Monto total filtrados por proveedor</h1>
                <table>
                  <thead>
                    <tr>
                      <th>Nombre del Proveedor</th>
                      <th>Fecha desde</th>
                      <th>Fecha hasta</th>
                      <th>Monto Total</th>
                      <th>Monto Total USD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculos.map((calculo, index) => (
                      <tr key={index}>
                        <td>{calculo.NombreProveedor}</td>
                        <td>{fechaDesde}</td>
                        <td>{fechaHasta}</td>
                        <td>{calculo.MontoTotalEnRangoDeFechas}</td>
                        <td>{calculo.MontoTotalEnUSDEnRango}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Grid>
        </Grid>
        <Footer style={{ flexShrink: 0 }}/>
                      
        <EstadoServicio/>
    </div>
  )
}

export default Calculos;
