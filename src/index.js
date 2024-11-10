import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ErrorPage from "./Pages/ErrorPage";
import IndexClientes from "./Components/Cliente/Index_Clientes";
import FormularioCliente from "./Components/Cliente/FormularioCliente";
import DetalleCliente from "./Components/Cliente/DetalleCliente";
import IndexTarjetas from "./Components/Tarjeta/Index_Tarjetas";
import FormularioTarjeta from "./Components/Tarjeta/FormularioTarjeta";
import DetalleTarjeta from "./Components/Tarjeta/DetalleTarjeta";
import IndexCuentas from "./Components/Cuenta/Index_Cuentas";
import FormularioCuentas from "./Components/Cuenta/FormularioCuenta";
import DetalleCuenta from "./Pages/Cuentas/DetalleAccountPage";
import Login from "./Components/Auth/Login";
import SignUp from "./Components/Auth/SignUp";
import PrivateRoute from './Components/Auth/PrivateRoute';
import Transferir from './Pages/Transferencia/TransferenciaPage';
import Transferencias from './Pages/Transferencia/Index';
import Backup from './Pages/Backup/Index';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/clientes",
        element: <PrivateRoute element={<IndexClientes />} />,
      },
      {
        path: "/clientes/formulario",
        element: <PrivateRoute element={<FormularioCliente />} />,
      },
      {
        path: "/clientes/editar/:id",
        element: <PrivateRoute element={<FormularioCliente />} />,
      },
      {
        path: "/clientes/detalle/:id",
        element: <PrivateRoute element={<DetalleCliente />} />,
      },
      {
        path: "/tarjetas",
        element: <PrivateRoute element={<IndexTarjetas />} />,
      },
      {
        path: "/tarjetas/formulario",
        element: <PrivateRoute element={<FormularioTarjeta />} />,
      },
      {
        path: "/tarjetas/editar/:id",
        element: <PrivateRoute element={<FormularioTarjeta />} />,
      },
      {
        path: "/tarjetas/detalle/:id",
        element: <PrivateRoute element={<DetalleTarjeta />} />,
      },
      {
        path: "/cuentas",
        element: <PrivateRoute element={<IndexCuentas />} />,
      },
      {
        path: "/cuentas/nueva",
        element: <PrivateRoute element={<FormularioCuentas />} />,
      },
      {
        path: "/cuentas/editar/:id",
        element: <PrivateRoute element={<FormularioCuentas />} />,
      },
      {
        path: "/cuentas/detalle/:id",
        element: <PrivateRoute element={<DetalleCuenta />} />,
      },
      {
        path: "/auth/iniciar_sesion/:token?",
        element: <Login />,
      },
      {
        path: "/auth/registrarse",
        element: <SignUp />,
      },
      {
        path: '/transferir',
        element: <PrivateRoute element={<Transferir />} />,
      },
      {
        path: '/transferencias',
        element: <PrivateRoute element={<Transferencias />} />,
      },
      {
        path: '/backup',
        element: <Backup />
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();