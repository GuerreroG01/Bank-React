import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Index_Clientes from './Components/Index_Clientes';
import ErrorPage from './Pages/ErrorPage';
import DetalleCliente from './Components/DetalleCliente';
import FormularioCliente from './Components/FormularioCliente';

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
        path: '/clientes/detalle/:id',
        element: <DetalleCliente />
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
