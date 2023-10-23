import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Grid from '@mui/material/Grid';

const Usuarios = () => {
  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Grid container spacing={1} style={{ flexGrow: 1 }}>
        <Grid item xs={12} lg={12}>
          <h1>Usuarios</h1>
        </Grid>
      </Grid>
      <Footer style={{ flexShrink: 0 }}/>
    </div>

    </>
  )
}

export default Usuarios