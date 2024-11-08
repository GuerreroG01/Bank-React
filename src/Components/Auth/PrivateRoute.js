import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem("token");

  return token ? element : <Navigate to="/auth/iniciar_sesion/no_token" />;
};

export default PrivateRoute;