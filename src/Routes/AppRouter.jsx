import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Principal from '../Components/Principal';
import Proveedores from './Proveedores';
import Pagos from './Pagos';
import Calculos from './Calculos';
import MediosPago from './MediosPago.jsx'
import PruebaLogin from './PruebaLogin.jsx'
import Usuarios from './Usuarios';
import ProbandoTabla from './ProbandoTabla.jsx'

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* VER BIEN COMO MANEJAR EL LOGIN DE REGRESO*/}
        <Route path="/" element={<PruebaLogin/>} />
        <Route path="/usuarios/:userId" element={<Usuarios/>} />
        <Route path="/principal/:userId" element={<Principal/>} />
        <Route path="/proveedores/:userId" element={<Proveedores/>} />
        <Route path="/calculos/:userId" element={<Calculos/>} />
        <Route path="/pagos/:userId" element={<Pagos/>} />
        <Route path="/medios/:userId" element={<MediosPago/>} />
        <Route path="/probandotabla" element={<ProbandoTabla/>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
