import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Drawer from "./Components/Drawer";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && !['/auth/iniciar_sesion', '/auth/registrarse'].includes(location.pathname)) {
      navigate("/auth/iniciar_sesion/no_token");
    }
  }, [navigate, location.pathname]);

  return (
    <div>
      <Drawer />
      <Outlet />
    </div>
  );
}

export default App;