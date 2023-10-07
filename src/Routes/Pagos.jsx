import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import '../Styles/pagos.css'
import { Button, Grid } from '@mui/material'
import { format } from 'date-fns';
import Snackbar from '@mui/material/Snackbar';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate } from 'react-router-dom';
import useAuthorization from '../Functions/useAuthorization';
import { useTimeout } from '../Functions/timeOut';
import BotonEliminarPago from '../Components/BotonEliminarPago';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';

const Pagos = () => {
  useAuthorization();

  const [pagos, setPagos] = useState([]);
  const [nombreproveedores, setNombreProveedores] = useState([]);
  const [agregadaExitosa, setAgregadaExitosa] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [nombreProveedorFiltro, setNombreProveedorFiltro] = useState("");

  const [error, setError] = useState('');

  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth <= 600);
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    nombre: "",
    monto: "",
    medioPago: "",
    fecha: "",
    usdDelDia: ""
  });
  const rolUsuario = localStorage.getItem("userRole");
  const userId = localStorage.getItem('userId');

  const [esPositivo, setEsPositivo] = useState(false);
  const [esNegativo, setEsNegativo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cargandoForm, setCargandoForm] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleEsPositivoChange = (e) => {
    setEsPositivo(e.target.checked);
    setEsNegativo(false); 
  };

  const handleEsNegativoChange = (e) => {
    setEsNegativo(e.target.checked);
    setEsPositivo(false);
  };

  const navigate = useNavigate();

  useTimeout();

  const handleFechaDesdeChange = (event) => {
    setFechaDesde(event.target.value);
  };
  
  const handleFechaHastaChange = (event) => {
    setFechaHasta(event.target.value);
  };
  
  const handleNombreProveedorFiltroChange = (event) => {
    setNombreProveedorFiltro(event.target.value);
  };
  
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

  const [formErrors, setFormErrors] = useState({
    nombre: false,
    monto: false,
    medioPago: false,
    fecha: false,
    usdDelDia: false
  });
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Eliminamos el error del campo cuando el usuario comienza a escribir en él
    setFormErrors({
      ...formErrors,
      [name]: false,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const errors = {};
    let hasErrors = false;

    for (const key in formData) {
      if (!formData[key]) {
        errors[key] = true;
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setFormErrors(errors);
      return;
    }

    const monto = parseFloat(formData.monto);
    if (esPositivo) {
    } else if (esNegativo) {
      formData.monto = `-${monto}`;
    }

    const token = localStorage.getItem('token');
    const userId = JSON.parse(atob(token.split('.')[1])).userId;

    setCargandoForm(true);

    fetch(`https://apifolledo.onrender.com/pagos/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Respuesta del servidor:", data);
        setAgregadaExitosa(true);
        setCargandoForm(false);
        setSnackbarMessage('Pago agregado correctamente');
        setSnackbarOpen(true);
        setSnackbarSeverity('success');
      })
      .catch(error => {
        console.error("Error al enviar el formulario:", error)
        setSnackbarOpen(true)
        setSnackbarSeverity('error');
        setCargandoForm(false);
        setSnackbarMessage('Error con la conexión del servidor, intente nuevamente');
    });
  };

  useEffect(() => {
    if (agregadaExitosa) {
      setTimeout(() => {
        setSnackbarOpen(true);
        setTimeout(() => {
          setAgregadaExitosa(false);
          window.location.reload();
        }, 1000);
      }, 1000);
    }
  }, [agregadaExitosa]); 

  useEffect(() => {
    let apiUrl = `https://apifolledo.onrender.com/pagos/${userId}`;

    if (rolUsuario === 'Administrador') {
      apiUrl = 'https://apifolledo.onrender.com/pagos';
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  
    const timeoutId = setTimeout(() => {
      localStorage.removeItem('token');
      navigate('/');
    }, 300000);

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setPagos(data))
      .catch((error) => console.error('Error al cargar los pagos', error));  
      return () => clearTimeout(timeoutId);
  }, [navigate, rolUsuario, userId]);
  
  useEffect(() => {
    fetch('https://apifolledo.onrender.com/proveedores/nombreprov')
      .then(response => response.json())
      .then(data => setNombreProveedores(data))
      .catch(error => console.error('Error al cargar los nombres de los proveedores', error));
  }, []);

  useEffect(() => {
    fetch('https://api.bluelytics.com.ar/v2/latest')
      .then(response => response.json())
      .then(data => {
        const blueData = data.blue;

        setFormData({
          usdDelDia: blueData.value_sell,
        });
      })
      .catch(error => console.error('Error al obtener los datos: ', error));
  }, []);

  const aplicarFiltros = () => {
  if (fechaDesde > fechaHasta) {
    setError('Error: La fecha desde es mayor que la fecha hasta');
    return;
  } else if ( !fechaDesde && !fechaHasta && !nombreProveedorFiltro) {
    setError('Error: Debe ingresar los datos para filtrar')
    return;
  }

  let apiUrl = `https://apifolledo.onrender.com/pagos/filtrando/${userId}?fechadesde=${fechaDesde}&fechahasta=${fechaHasta}&nombreProveedor=${nombreProveedorFiltro}`;

  if (rolUsuario === 'Administrador') {
    apiUrl = `https://apifolledo.onrender.com/pagos/filtrando?fechadesde=${fechaDesde}&fechahasta=${fechaHasta}&nombreProveedor=${nombreProveedorFiltro}`;
  }

  setIsLoading(true);

  fetch(apiUrl)
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
      setPagos(data);
      setError('');
      setIsLoading(false);
      console.log(data);
    })
    .catch((error) => {
      setError('Error de conexion con el servidor, intente nuevamente');
      setIsLoading(false);
    });
  };

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const totalPages = Math.ceil(pagos.length / ITEMS_PER_PAGE);

  const paginatedPagos = pagos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <Navbar/>
        <div className="filtros" style={{textAlign:'center', marginTop:'10px'}}>
            <div className='inputfiltro'>
            <h1>Filtros</h1>
              <label htmlFor="fechaDesde">Fecha Desde:</label>
              <input type="date" id="fechaDesde" value={fechaDesde} onChange={handleFechaDesdeChange} />
              <label htmlFor="fechaHasta">Fecha Hasta:</label>
              <input type="date" id="fechaHasta" value={fechaHasta} onChange={handleFechaHastaChange} />
              <label htmlFor="nombreProveedorFiltro">Nombre del Proveedor:</label>
                <select
                  id="nombreProveedorFiltro"
                  value={nombreProveedorFiltro}
                  onChange={handleNombreProveedorFiltroChange}
                >
                  <option value="">Seleccione</option>
                  {nombreproveedores.map((proveedor) => (
                    <option key={proveedor.nombre} value={proveedor.nombre}>
                      {proveedor.nombre}
                    </option>
                  ))}
                </select>
              <button onClick={aplicarFiltros}>Aplicar Filtros <br />{isLoading && <LinearProgress />}</button>            
            </div>
            <div className='alerta' style={{display:'flex', flexDirection:'column', justifyContent:'center', marginTop:'5px', marginBottom:'5px', color:'red'}}>
              {error && <Alert severity="error">{error}</Alert>}
            </div>
        </div>

        <div className='divTotal'>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={4}>
              <div className='tabla'>
                <h1>Agregar pago</h1>
                <form style={{display:'flex', flexDirection:'column', justifyContent:'center'}} onSubmit={handleFormSubmit}>
                  <label htmlFor="nombre">Nombre del Proveedor</label>
                  <select id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required>
                    <option value="" disabled>Seleccione</option>
                    {nombreproveedores.map(proveedor => (
                      <option key={proveedor.nombre} value={proveedor.nombre}>
                        {proveedor.nombre}
                      </option>
                    ))}
                  </select>
                  {formErrors.nombre && <span className="error-message">Este campo es obligatorio</span>}
                  <br />

                  <InputLabel htmlFor="outlined-adornment-amount">Monto</InputLabel>
                  <OutlinedInput type='number' id="monto" name='monto' value={formData.monto} onChange={handleInputChange} required startAdornment={<InputAdornment position="start">$</InputAdornment>}/>
                  {formErrors.monto && <span className="error-message">Este campo es obligatorio</span>}
                  <br/>
                  
                  <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                    <label>Valor del monto:</label>
                    <label>
                      <input type="checkbox" name="esPositivo" checked={esPositivo} onChange={handleEsPositivoChange} />
                      Positivo
                    </label>

                    <label>
                      <input type="checkbox" name="esNegativo" checked={esNegativo} onChange={handleEsNegativoChange} />
                      Negativo
                    </label>
                  </div>
                  <br/>

                  <label htmlFor="medioPago">Medio de Pago</label>
                  <select id="medioPago" name="medioPago" value={formData.medioPago} onChange={handleInputChange} required>
                    <option value="" disabled>Seleccione</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cuenta corriente">Cuenta corriente</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Erni">Erni</option>
                    <option value="A/D">A/D</option>
                    <option value="Tomy">Tomy</option>
                  </select>
                  {formErrors.medioPago && <span className="error-message">Este campo es obligatorio</span>}
                  <br/>

                  <label htmlFor="fecha">Fecha</label>
                  <input type="date" id="fecha" name="fecha" value={formData.fecha} onChange={handleInputChange} required/>
                  {formErrors.fecha && <span className="error-message">Este campo es obligatorio</span>}
                  <br/>

                  <InputLabel htmlFor="outlined-adornment-amount">Dolar del dia</InputLabel>
                  <OutlinedInput type='number' id="usdDelDia" name='usdDelDia' value={formData.usdDelDia} onChange={handleInputChange} required startAdornment={<InputAdornment position="start">$</InputAdornment>}/>
                  {formErrors.usdDelDia && <span className="error-message">Este campo es obligatorio</span>}
                  <br />

                  <div className='botonera' style={{display:'flex', justifyContent:'center'}}>
                    <button type="submit">Agregar Pago  <br />{cargandoForm && <LinearProgress />}</button>
                  </div>
                </form>
              </div>
            </Grid> 
            <Grid item xs={12} lg={8}>
              <div className='tabla'>
                <h1>Tabla de Pagos</h1>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Proveedor</th>
                      <th>Monto</th>
                      <th>Monto USD</th>
                      <th>Precio USD</th>
                      <th>Medio de pago</th>
                      <th>Fecha</th>
                      <th>Acción</th>
                      {rolUsuario === 'Administrador' && (
                        <>
                          <th>Usuario</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPagos.map(pago => (
                      <tr key={pago.idPago}>
                        <td>{pago.idPago}</td>
                        <td>{pago.nombre}</td>
                        <td>{pago.monto}</td>
                        <td>{pago.montoUSD}</td>
                        <td>{pago.usdDelDia}</td>
                        <td>{pago.medioPago}</td>
                        <td>{format(new Date(pago.fecha), 'yyyy-MM-dd')}</td>
                        <td><BotonEliminarPago pago={pago} /></td>
                        {rolUsuario === 'Administrador' && (
                        <>
                          <td>{pago.username}</td>
                        </>
                      )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className='botonera boton1'>
                  <Button variant="contained" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Anterior
                  </Button>
                  <h5 variant="caption">Página {currentPage} de {totalPages}</h5>
                  <Button variant="contained" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage * ITEMS_PER_PAGE >= pagos.length}>
                    Siguiente
                  </Button>
                </div>
              </div>
            </Grid>           
          </Grid>
        </div>
        
      <Footer/>

      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleCloseSnackbar} anchorOrigin={isMobileScreen ? { vertical: 'top', horizontal: 'center' } : { vertical: 'bottom', horizontal: 'left' }}>
        <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Pagos