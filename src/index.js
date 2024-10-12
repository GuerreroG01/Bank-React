import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Index_Clientes from './Components/Index_Clientes';
import Index_Tarjetas from './Components/Index_Tarjetas';
import ErrorPage from './Pages/ErrorPage';
import DetalleCliente from './Components/DetalleCliente';
import FormularioCliente from './Components/FormularioCliente';
import FormularioTarjeta from './Components/FormularioTarjeta';
import DetalleTarjeta from './Components/DetalleTarjeta';
import CuentaList from './Components/CuentaList';
import CreateEditCuenta from './Components/CreateEditCuenta';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/clientes',
        element: <Index_Clientes />
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
        element: <Index_Tarjetas />
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
      // Rutas para Cuentas
      {
        path: '/cuentas',
        element: <CuentaList />
      },
      {
        path: '/cuentas/nueva',
        element: <CreateEditCuenta />
      },
      {
        path: '/cuentas/editar/:id',
        element: <CreateEditCuenta />
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
