import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CuentaService from '../../Services/CuentaService';
import ClienteService from '../../Services/ClienteService';
import { Box, Typography, Button, Alert, AlertTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const DetallesCuenta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cuenta, setCuenta] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        const cuentaResponse = await CuentaService.getCuentaById(id);
        setCuenta(cuentaResponse.data);

        // Obtener el cliente asociado a la cuenta
        const clienteResponse = await ClienteService.getClienteById(cuentaResponse.data.clienteId);
        setCliente(clienteResponse.data);
      } catch (error) {
        console.error('Error fetching cuenta o cliente:', error);
        setMensajeError('Hubo un error al cargar los detalles de la cuenta. Por favor, inténtalo de nuevo.');
      }
    };

    if (id) {
      fetchDetalles();
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cuenta?')) {
      try {
        await CuentaService.deleteCuenta(id);
        navigate('/cuentas');
      } catch (error) {
        console.error('Error al eliminar la cuenta:', error);
        setMensajeError('Hubo un error al eliminar la cuenta. Por favor, inténtalo de nuevo.');
      }
    }
  };

  if (mensajeError) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {mensajeError}
      </Alert>
    );
  }

  if (!cuenta || !cliente) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Box
      sx={{
        maxWidth: '600px',
        margin: '20px auto',
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: '#fff',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Detalles de la Cuenta
      </Typography>

      {/* Mostrar detalles del cliente */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 3,
          padding: 2,
          border: '1px solid #ccc',
          borderRadius: 2,
          backgroundColor: '#f9f9f9',
        }}
      >
        {cliente.foto && (
          <img
            src={`${process.env.REACT_APP_API_URL}/Images/${cliente.foto}`}
            alt={`Foto de ${cliente.nombre}`}
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'contain',
              borderRadius: '50%',
              marginRight: 2,
              boxShadow: 2,
            }}
          />
        )}
        <Box>
          <Typography variant="h6" sx={{ marginBottom: 0.5 }}>
            Cliente: {cliente.nombre}
          </Typography>
          <Typography variant="body1">
            Teléfono: {cliente.telefono || 'N/A'}
          </Typography>
        </Box>
      </Box>

      {/* Mostrar detalles de la cuenta */}
      <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h6" gutterBottom>
          Información de la Cuenta
        </Typography>
        <Typography variant="body1">Tipo de Cuenta: {cuenta.tipo}</Typography>
        <Typography variant="body1">Saldo: ${cuenta.saldo}</Typography>
        <Typography variant="body1">Beneficiario: {cuenta.beneficiarios || 'N/A'}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/cuentas')}
        >
          Atrás
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/cuentas/editar/${id}`)} // Reemplaza con la ruta correcta de edición
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Borrar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default DetallesCuenta;