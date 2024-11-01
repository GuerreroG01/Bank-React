import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ErrorPage from './Pages/ErrorPage';
import IndexClientes from './Components/Cliente/Index_Clientes';
import FormularioCliente from './Components/Cliente/FormularioCliente';
import DetalleCliente from './Components/Cliente/DetalleCliente';
import IndexTarjetas from './Components/Tarjeta/Index_Tarjetas';
import FormularioTarjeta from './Components/Tarjeta/FormularioTarjeta';
import DetalleTarjeta from './Components/Tarjeta/DetalleTarjeta';
import IndexCuentas from './Components/Cuenta/Index_Cuentas';
import FormularioCuentas from './Components/Cuenta/FormularioCuenta';
import DetalleCuenta from './Pages/Cuentas/DetalleAccountPage';
import Transferir from './Pages/Transferencia/TransferenciaPage';
import Transferencias from './Pages/Transferencia/Index';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/clientes',
        element: <IndexClientes />
      },
      {
        path: '/clientes/formulario',
        element: <FormularioCliente />
      },
      {
        path: '/clientes/editar/:id',
        element: <FormularioCliente />
      },
      {
        path: '/clientes/detalle/:id',
        element: <DetalleCliente />
      },
      {
        path: '/tarjetas',
        element: <IndexTarjetas />
      },
      {
        path: '/tarjetas/formulario',
        element: <FormularioTarjeta />
      },
      {
        path: '/tarjetas/editar/:id',
        element: <FormularioTarjeta />
      },
      {
        path: '/tarjetas/detalle/:id',
        element: <DetalleTarjeta />
      },
      {
        path: '/cuentas',
        element: <IndexCuentas />
      },
      {
        path: '/cuentas/nueva',
        element: <FormularioCuentas />
      },
      {
        path: '/cuentas/editar/:id',
        element: <FormularioCuentas />
      },
      {
        path: '/cuentas/detalle/:id',
        element: <DetalleCuenta />
      },
      {
        path: '/transferir',
        element: <Transferir />
      },
      {
        path: '/transferencias',
        element: <Transferencias />
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
