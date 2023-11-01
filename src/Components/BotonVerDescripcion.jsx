import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { BsFileTextFill } from "react-icons/bs";
import { GrClose } from "react-icons/gr";

const BotonVerDescripcion = ({ pago }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [descripcionDepago, setDescripcionDePago] = useState(null);
  
    const abrirModalDescripcion = (idPago, descripcion) => {
        console.log("idPago:", idPago);
        console.log("descripcion:", descripcion);
        setModalOpen(true);
        setDescripcionDePago({ idPago, descripcion });
      }; 
      

    return (
    <>
        <button style={{ backgroundColor: 'blue', borderRadius: '20px', padding: '10px 20px',  color: '#fff', border: 'none',  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',  cursor: 'pointer', transition: 'background-color 0.3s ease'}} className='ver' onClick={() => abrirModalDescripcion(pago.idPago, pago.descripcion)}>
            <BsFileTextFill />
        </button>

        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
            <DialogTitle style={{ backgroundColor: '#006989', color: 'white', marginBottom: '5px' }} id="alert-dialog-title">Descripción del pago <button className='ml-8' style={{ backgroundColor: 'white', padding: '6px', borderRadius: '50px' }} onClick={() => setModalOpen(false)}> <GrClose></GrClose> </button></DialogTitle>
          </div>
        <DialogContent>
        <h1 id="alert-dialog-description" className='text-slate-950 font-medium'>
        {descripcionDepago && descripcionDepago.descripcion ? descripcionDepago.descripcion : 'Este pago no posee descripción'}
        <br/>
        </h1>
        </DialogContent>
        </Dialog>
    </>
  )
}

export default BotonVerDescripcion