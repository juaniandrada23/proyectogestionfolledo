import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { PiWarningOctagonFill } from "react-icons/pi";

const EstadoServicio = () => {
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('https://apifolledo.onrender.com/servidor/estado');
            const data = await response.json();
            setErrorSnackbarOpen(false);
            console.log("Usuarios disponibles:", data)
          } catch (error) {
            console.error('Error: servidor caído, inténtelo nuevamente', error);
            setErrorSnackbarOpen(true);
          }
        };
    
        fetchData();
    
        const intervalId = setInterval(() => {
          fetchData();
        }, 3000);
    
        return () => clearInterval(intervalId);
      }, []);

  return (
    <Snackbar anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      direction="left" open={errorSnackbarOpen} autoHideDuration={null} onClose={() => setErrorSnackbarOpen(false)}>

      <Alert icon={<PiWarningOctagonFill fontSize="inherit" />} variant="filled" severity="error" sx={{ width: '100%' }}>
        Error: Servidor caído, inténtelo nuevamente más tarde.
      </Alert>
    </Snackbar>  
    )
}

export default EstadoServicio