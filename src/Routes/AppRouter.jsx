import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Proveedores from './Proveedores';
import Pagos from './Pagos';
import Calculos from './Calculos';
import MediosPago from './MediosPago.jsx'
import PruebaLogin from './PruebaLogin.jsx'
import Usuarios from './Usuarios';
import ProbandoPrincipal from './ProbandoPrincipal.jsx'

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PruebaLogin/>} />
        <Route path="/usuarios/:userId" element={<Usuarios/>} />
        <Route path="/proveedores/:userId" element={<Proveedores/>} />
        <Route path="/calculos/:userId" element={<Calculos/>} />
        <Route path="/pagos/:userId" element={<Pagos/>} />
        <Route path="/medios/:userId" element={<MediosPago/>} />
        <Route path="/probandoprincipal/:userId" element={<ProbandoPrincipal/>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
