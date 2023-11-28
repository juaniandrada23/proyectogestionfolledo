import React, { useEffect, useState } from 'react';

const ProbandoDesarrollos = () => {

    const [mediosDepago, setMediosDePago] = useState([]);


    useEffect(() => {
        fetch('http://localhost:3001/mediodepago/nombremediopago')
          .then(response => response.json())
          .then(data => {
            setMediosDePago(data);
          })
          .catch(error => console.error('Error al obtener los datos: ', error));
      }, []);


  return (
    <>
        <div>
            <h1>{mediosDepago.map(item => item.nombreMedioPago)}</h1>
        </div>
    </>
  )
}

export default ProbandoDesarrollos