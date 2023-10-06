import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Principal from '../Components/Principal';
import Proveedores from './Proveedores';
import Pagos from './Pagos';
import Calculos from './Calculos';
import Login from './Login';
import SignUp from './SignUp';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* VER BIEN COMO MANEJAR EL LOGIN DE REGRESO*/}
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/principal/:userId" element={<Principal />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/calculos/:userId" element={<Calculos />} />
        <Route path="/pagos/:userId" element={<Pagos />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
