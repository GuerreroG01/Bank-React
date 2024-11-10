import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CuentaService from '../../Services/CuentaService';
import ClienteService from '../../Services/ClienteService';
import {
  Box,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Skeleton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

const DetallesCuenta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cuenta, setCuenta] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [mensajeError, setMensajeError] = useState('');
  const [monedaSeleccionada, setMonedaSeleccionada] = useState('');
  const [saldoOriginal, setSaldoOriginal] = useState(0);
  const [monedaOriginal, setMonedaOriginal] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        const cuentaResponse = await CuentaService.getCuentaById(id);
        setCuenta(cuentaResponse.data);

        const clienteResponse = await ClienteService.getClienteById(cuentaResponse.data.clienteId);
        setCliente(clienteResponse.data);

        setMonedaSeleccionada(cuentaResponse.data.moneda);
        setSaldoOriginal(cuentaResponse.data.saldo);
        setMonedaOriginal(cuentaResponse.data.moneda);

        setTimeout(() => {
          setIsLoading(false);
        }, 100);
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
  const formatDate = (date) => {
    if (!date) return 'No disponible';
    return format(new Date(date), 'dd MMMM yyyy', { locale: es });
  };

  if (mensajeError) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {mensajeError}
      </Alert>
    );
  }

  if (isLoading || !cuenta || !cliente) {
    return (
      <Box sx={{ padding: 3, marginTop: 9.4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Skeleton variant="circular" width={100} height={100} sx={{ marginTop: 2, marginLeft: 50 }} />
            <Skeleton variant="rectangular" width="32.5%" height={135} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
            <Skeleton variant="rectangular" width="41%" height={167} />
        </Box>
    </Box>
    );
  }

  const obtenerNombreMoneda = (moneda) => {
    switch (moneda) {
      case 'NIO':
        return 'Córdobas';
      case 'USD':
        return 'Dólares';
      case 'EUR':
        return 'Euros';
      default:
        return 'Desconocido';
    }
  };

  const tasasCambio = {
    EUR: {
      USD: 1.08,
      NIO: 36.15
    },
    USD: {
      EUR: 0.93,
      NIO: 33.54
    },
    NIO: {
      EUR: 0.028,
      USD: 0.029
    },
  };

  const convertirSaldo = (saldoOriginal, monedaOriginal, monedaObjetivo) => {
    if (monedaOriginal === monedaObjetivo) {
      return saldoOriginal;
    }

    const tasaCambio = tasasCambio[monedaOriginal][monedaObjetivo];
    return saldoOriginal * tasaCambio;
  };

  const saldoConvertido = convertirSaldo(saldoOriginal, monedaOriginal, monedaSeleccionada);

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h5" gutterBottom>
          Detalles de la Cuenta
        </Typography>
        
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Convertidor</InputLabel>
          <Select
            value={monedaSeleccionada}
            onChange={(e) => setMonedaSeleccionada(e.target.value)}
            label="Seleccionar Moneda"
          >
            <MenuItem value="EUR">Euros</MenuItem>
            <MenuItem value="USD">Dólares</MenuItem>
            <MenuItem value="NIO">Córdobas</MenuItem>
          </Select>
        </FormControl>
      </Box>

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
        {cliente.foto ? (
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
        ) : (
          <Skeleton variant="circular" width={100} height={100} sx={{ marginRight: 2 }} />
        )}
        <Box>
          {cliente ? (
            <>
              <Typography variant="h6" sx={{ marginBottom: 0.5 }}>
                Cliente: {cliente.nombre}
              </Typography>
              <Typography variant="body1">
                Teléfono: {cliente.telefono || 'N/A'}
              </Typography>
            </>
          ) : (
            <>
              <Skeleton variant="text" width="80%" height={24} />
              <Skeleton variant="text" width="60%" height={24} />
            </>
          )}
        </Box>
      </Box>

      <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h6" gutterBottom>
          Información de la Cuenta
        </Typography>
        {cuenta ? (
          <>
            <Typography variant="body1">Tipo de Cuenta: {cuenta.tipo}</Typography>
            <Typography variant="body1">
              Saldo: {monedaSeleccionada === 'NIO' ? `C$${saldoConvertido.toFixed(2)}` : monedaSeleccionada === 'USD' ? `$${saldoConvertido.toFixed(2)}` : `€${saldoConvertido.toFixed(2)}`}
            </Typography>
            <Typography variant="body1">Moneda: {obtenerNombreMoneda(cuenta.moneda)}</Typography>
            <Typography variant="body1">Beneficiario: {cuenta.beneficiarios || 'N/A'}</Typography>
            <Typography variant="body1">Apertura de la cuenta: {formatDate(cuenta.aperturacuenta)}</Typography>
          </>
        ) : (
          <>
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="50%" height={24} />
          </>
        )}
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
            onClick={() => navigate(`/cuentas/editar/${id}`)}
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
