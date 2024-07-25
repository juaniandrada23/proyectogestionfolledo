import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { PiWarningOctagonFill } from "react-icons/pi";

const EstadoServicio = () => {
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const apiUrl = process.env.REACT_APP_APIURL;

    useEffect(() => {
      const fetchData = async () => {
        try {
          await fetch(`${apiUrl}/servidor/estado`);
          setErrorSnackbarOpen(false);
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
    }, [apiUrl]);

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