import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import '../Styles/pagos.css'
import { Grid } from '@mui/material'
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
import EstadoServicio from '../Components/EstadoServicio.jsx'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Skeleton from '@mui/material/Skeleton';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { MdExpandMore } from "react-icons/md";
import BotonVerDescripcion from '../Components/BotonVerDescripcion';

const Pagos = () => {
  useAuthorization();

  const [pagos, setPagos] = useState([]);
  const [nombreproveedores, setNombreProveedores] = useState([]);
  const [mediodepago, setMedioDePago] = useState([]);
  const [agregadaExitosa, setAgregadaExitosa] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [nombreProveedorFiltro, setNombreProveedorFiltro] = useState("");

  const [nombreusuarios, setNombreUsuarios] = useState([]);
  const [nombreUsuarioFiltro, setNombreUsuarioFiltro] = useState("");

  const [error, setError] = useState('');

  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth <= 600);
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    nombre: "",
    monto: "",
    medioPago: "",
    fecha: "",
    usdDelDia: "",
    descripcion: "",
  });

  const resetForm = () => {
    setFormData({
      nombre: "",
      monto: "",
      medioPago: "",
      fecha: "",
      usdDelDia: "",
      descripcion: ""
    });
  };

  const rolUsuario = localStorage.getItem("userRole");
  const userId = localStorage.getItem('userId');

  const [esPositivo, setEsPositivo] = useState(false);
  const [esNegativo, setEsNegativo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);
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

  const handleNombreUsuarioFiltroChange = (event) => {
    setNombreUsuarioFiltro(event.target.value);
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
  
  //---------------------------------------------FORM------------------------------------------------------------------------------
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
        resetForm();
      })
      .catch(error => {
        console.error("Error al enviar el formulario:", error)
        setSnackbarOpen(true)
        setSnackbarSeverity('error');
        setCargandoForm(false);
        setSnackbarMessage('Error con la conexión del servidor, intente nuevamente');
    });
  };

  //MANEJO PARA HACER EL REFRESH DE LA TABLA
  useEffect(() => {
    if (agregadaExitosa) {
      let apiUrl = `https://apifolledo.onrender.com/pagos/${userId}`;
  
      if (rolUsuario === 'Administrador') {
        apiUrl = 'https://apifolledo.onrender.com/pagos';
      }
  
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          setPagos(data);
          setSnackbarOpen(true);
          setSnackbarSeverity('success');
          setIsLoadingSkeleton(false);
          setSnackbarMessage('Pago agregado correctamente');
        })
        .catch((error) => {
          console.error('Error al cargar los pagos', error);
          setSnackbarOpen(true);
          setSnackbarSeverity('error');
          setSnackbarMessage(
            'Error con la conexión del servidor, intente nuevamente'
          );
        });
      
      setAgregadaExitosa(false);
    }
  }, [agregadaExitosa, userId, rolUsuario]);

  //MANEJO PARA LA CARGA DE LOS DATOS EN LA TABLA
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
      .then((data) => {
        setPagos(data);
        setIsLoadingSkeleton(false);
      })
      .catch((error) => console.error('Error al cargar los pagos', error));  
      return () => clearTimeout(timeoutId);
  }, [navigate, rolUsuario, userId]);

  const actualizarPagos = () => {
    let apiUrl = `https://apifolledo.onrender.com/pagos/${userId}`;
  
    if (rolUsuario === 'Administrador') {
      apiUrl = 'https://apifolledo.onrender.com/pagos';
    }
  
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setPagos(data);
      })
      .catch((error) => {
        console.error('Error al cargar los pagos', error);
      });
  };  
  //----------------------------------------------------------------------------------------//
  useEffect(() => {
    fetch('https://apifolledo.onrender.com/proveedores/nombreprov')
      .then(response => response.json())
      .then(data => setNombreProveedores(data))
      .catch(error => console.error('Error al cargar los nombres de los proveedores', error));
  }, []);

  useEffect(() => {
    fetch('https://apifolledo.onrender.com/usuarios/nombres')
      .then(response => response.json())
      .then(data => setNombreUsuarios(data))
      .catch(error => console.error('Error al cargar los nombres de los proveedores', error));
  }, []);

  useEffect(() => {
    fetch('https://apifolledo.onrender.com/mediodepago/nombremediopago')
      .then(response => response.json())
      .then(data => setMedioDePago(data))
      .catch(error => console.error('Error al cargar los nombres de los medios de pago', error));
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
  } else if ( !fechaDesde && !fechaHasta && !nombreProveedorFiltro && !nombreUsuarioFiltro) {
    setError('Error: Debe ingresar los datos para filtrar')
    return;
  }

  let apiUrl = `https://apifolledo.onrender.com/pagos/filtrando/${userId}?fechadesde=${fechaDesde}&fechahasta=${fechaHasta}&nombreProveedor=${nombreProveedorFiltro}`;

  if (rolUsuario === 'Administrador') {
    apiUrl = `https://apifolledo.onrender.com/pagos/filtrando?fechadesde=${fechaDesde}&fechahasta=${fechaHasta}&nombreProveedor=${nombreProveedorFiltro}&usuarioFiltrado=${nombreUsuarioFiltro}`;
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar/>
      <div style={{ flexGrow: 1 }}>
        <div className="filtros" style={{textAlign:'center', marginTop:'10px'}}>
            <div className='inputfiltro'>
            <Accordion style={{ textAlign: 'center', marginTop: '10px', marginBottom:'10px', backgroundColor:'#006989 '}}>
              <AccordionSummary expandIcon={< MdExpandMore style={{color:'#004E66', backgroundColor:'#EAEBED', borderRadius:'50px'}}/>} aria-controls="panel1a-content" id="panel1a-header">
                <h1 style={{color:'#EAEBED'}}>Filtros</h1>
              </AccordionSummary>
              <AccordionDetails className='inputfiltro'>
              <div className='date-input-container'>
                        <label htmlFor="fechaDesde">Fecha Desde:</label>
                        <input className='date-input' type="date" id="fechaDesde" value={fechaDesde} onChange={handleFechaDesdeChange} />
                      </div>
                      <div className='date-input-container'>
                        <label htmlFor="fechaHasta">Fecha Hasta:</label>
                        <input className='date-input' type="date" id="fechaHasta" value={fechaHasta} onChange={handleFechaHastaChange} />
                      </div>
                      <div className='nombreproveedor date-input-container'>
                        <label htmlFor="nombreProveedorFiltro">Proveedor:</label>
                        <select
                          className='date-input'
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
                      </div>
                      
                      {rolUsuario === 'Administrador' && (
                        <div className='usuarios date-input-container'>
                          <label htmlFor="nombreUsuarioFiltro">Usuario:</label>
                          <select
                            className='date-input'
                            id="nombreUsuarioFiltro"
                            value={nombreUsuarioFiltro}
                            onChange={handleNombreUsuarioFiltroChange}
                          >
                            <option value="">Seleccione</option>
                            {nombreusuarios.map((usuario) => (
                              <option key={usuario.username} value={usuario.username}>
                                {usuario.username}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <button className='font-semibold' onClick={aplicarFiltros}>Aplicar Filtros <br />{isLoading && <LinearProgress />}</button>   
              </AccordionDetails>
            </Accordion>
            </div>

            <div className='alerta' style={{display:'flex', flexDirection:'column', justifyContent:'center', marginTop:'5px', marginBottom:'5px', color:'red'}}>
              {error && <Alert severity="error"><strong>{error} </strong></Alert>}
            </div>
        </div>

        <div className='divTotal' style={{marginBottom:'10px'}}>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={4}>
              <div className='tabla' style={{marginBottom:'10px'}}>
                <Accordion style={{ textAlign: 'center', marginTop:'10px', marginBottom:'10px', backgroundColor:'#006989'}}>
                  <AccordionSummary expandIcon={< MdExpandMore style={{color:'#004E66', backgroundColor:'#EAEBED', borderRadius:'50px'}}/>} aria-controls="panel1a-content" id="panel1a-header">
                    <h1 style={{color:'#EAEBED'}}>Agregar pago</h1>
                  </AccordionSummary>
                  <AccordionDetails style={{backgroundColor:'white'}}>                
                    <form className='formulario' style={{display:'flex', flexDirection:'column', justifyContent:'center'}} onSubmit={handleFormSubmit}>
                      <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
                        
                        <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start', gap:'5px'}}>
                          <label htmlFor="nombre">Proveedor</label>
                          <select className='date-input' id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required>
                            <option value="" disabled>Seleccione</option>
                            {nombreproveedores.map(proveedor => (
                              <option key={proveedor.nombre} value={proveedor.nombre}>
                                {proveedor.nombre}
                              </option>
                            ))}
                          </select>
                          {formErrors.nombre && <span className="error-message">Este campo es obligatorio</span>}
                        </div>
                        <br />

                        <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start', gap:'5px'}}>
                          <InputLabel htmlFor="outlined-adornment-amount">Monto</InputLabel>
                          <OutlinedInput type='number' id="monto" name='monto' value={formData.monto} onChange={handleInputChange} required startAdornment={<InputAdornment position="start">$</InputAdornment>}/>
                          {formErrors.monto && <span className="error-message">Este campo es obligatorio</span>}
                        </div>
                        <br/>
                        
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', gap:'20px'}}>
                          <label>Valor del monto</label>
                          <label>
                            <input type="checkbox" name="esPositivo" checked={esPositivo} onChange={handleEsPositivoChange} />
                            Ingreso
                          </label>

                          <label>
                            <input type="checkbox" name="esNegativo" checked={esNegativo} onChange={handleEsNegativoChange} />
                            Egreso
                          </label>
                        </div>
                        <br/>

                        <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start', gap:'5px'}}>
                          <label htmlFor="medioPago">Medio de Pago</label>
                          <select className='date-input' id="medioPago" name="medioPago" value={formData.medioPago} onChange={handleInputChange} required>
                            <option value="" disabled>Seleccione</option>
                              {mediodepago.map(pagomedio => (
                                <option key={pagomedio.nombreMedioPago} value={pagomedio.nombreMedioPago}>
                                  {pagomedio.nombreMedioPago}
                                </option>
                              ))}
                          </select>
                          {formErrors.medioPago && <span className="error-message">Este campo es obligatorio</span>}
                        </div>
                        <br/>

                        <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start', gap:'5px'}}>
                        <label htmlFor="fecha">Fecha</label>
                        <input className='date-input' type="date" id="fecha" name="fecha" value={formData.fecha} onChange={handleInputChange} required/>
                        {formErrors.fecha && <span className="error-message">Este campo es obligatorio</span>}
                        </div>
                        <br/>

                        <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start', gap:'5px'}}>
                          <InputLabel htmlFor="outlined-adornment-amount">Dolar del dia</InputLabel>
                          <OutlinedInput type='number' id="usdDelDia" name='usdDelDia' value={formData.usdDelDia} onChange={handleInputChange} required startAdornment={<InputAdornment position="start">$</InputAdornment>}/>
                          {formErrors.usdDelDia && <span className="error-message">Este campo es obligatorio</span>}
                        </div>
                        <br />

                        <div className='inputdescripcion' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Descripción 'Opcional'</InputLabel>
                            <TextareaAutosize
                                minRows={3}
                                className="w-full md:w-96 h-32 px-4 py-2 border rounded-md focus:outline-none focus:ring"
                                style={{ borderColor: '#B3ADA8',
                                }}
                                type='text' id="descripcion" name='descripcion' value={formData.descripcion} onChange={handleInputChange}
                            />
                        </div>
                        <br />
                      
                      </div>

                      <div className='botonera' style={{display:'flex', justifyContent:'center'}}>
                        <button className='font-semibold' type="submit">Agregar Pago  <br />{cargandoForm && <LinearProgress />}</button>
                      </div>
                    </form>
                  </AccordionDetails>
                </Accordion>
              </div>
            </Grid> 
            <Grid item xs={12} lg={8}>
              <div className='tabla'>
                <h1>Tabla de Pagos</h1>
                <table>
                  <thead>
                    <tr>
                      <th>Proveedor</th>
                      <th>Monto</th>
                      <th>Monto USD</th>
                      <th>Precio USD</th>
                      <th>Medio de pago</th>
                      <th>Fecha</th>
                      <th style={{textAlign:'center'}}>Acción</th>
                      {rolUsuario === 'Administrador' && (
                        <>
                          <th>Usuario</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                  {isLoadingSkeleton ? (
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
                    paginatedPagos.map((pago => (
                      <tr key={pago.idPago}>
                        <td>{pago.nombre}</td>
                        <td>{pago.monto}</td>
                        <td>{pago.montoUSD}</td>
                        <td>{pago.usdDelDia}</td>
                        <td>{pago.nombreMedioPago}</td>
                        <td>{pago.fecha.slice(0, 10)}</td>
                        <td style={{display:'flex', flexDirection:'row', gap:'3px'}}><BotonVerDescripcion pago={pago}/> <BotonEliminarPago pago={pago} actualizarPagos={actualizarPagos}/></td>
                        {rolUsuario === 'Administrador' && (
                        <>
                          <td>{pago.username}</td>
                        </>
                      )}
                      </tr>
                    ))))
                }
                  </tbody>
                </table>
                <div className='botonera boton1'>
                  <button style={{backgroundColor:'#006989', borderRadius:'10px'}} className='font-semibold text-white transition ease-in-out delay-150 bg-[#006989] hover:bg-[#053F61] duration-300' onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Anterior
                  </button>
                  <h5 variant="caption">Página {currentPage} de {totalPages}</h5>
                  <button style={{backgroundColor:'#006989', borderRadius:'10px'}} className='font-semibold text-white transition ease-in-out delay-150 bg-[#006989] hover:bg-[#053F61] duration-300' onClick={() => onPageChange(currentPage + 1)} disabled={currentPage * ITEMS_PER_PAGE >= pagos.length}>
                    Siguiente
                  </button>
                </div>
              </div>
            </Grid>           
          </Grid>
        </div>
      </div>
      <Footer style={{ flexShrink: 0 }}/>

      <EstadoServicio/>

      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleCloseSnackbar} anchorOrigin={isMobileScreen ? { vertical: 'top', horizontal: 'center' } : { vertical: 'bottom', horizontal: 'left' }}>
        <Alert variant='filled' severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Pagos