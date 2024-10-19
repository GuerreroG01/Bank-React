import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CuentaService from '../../Services/CuentaService';
import ClienteService from '../../Services/ClienteService';
import { Box, Typography, Button, FormControl, FormGroup, MenuItem, InputLabel, Alert, AlertTitle, Select, TextField, InputAdornment } from '@mui/material';

const FormularioCuenta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cuenta, setCuenta] = useState({
    tipo: '',
    saldo: '',
    infoTarjeta: '',
    clienteId: '',
    moneda: 'NIO'
  });
  const [clientes, setClientes] = useState([]);
  const [mensajeError, setMensajeError] = useState('');
  const [exitocreacion, setExitocreacion] = useState('');
  const [fotoCliente, setFotoCliente] = useState('');
  const [saldoOriginal, setSaldoOriginal] = useState('');
  const [monedaOriginal, setMonedaOriginal] = useState('');

  const tasasCambio = {
    EUR: {
      USD: 1.09,
      NIO: 39.91
    },
    USD: {
      EUR: 0.92,
      NIO: 36.69
    },
    NIO: {
      EUR: 0.025,
      USD: 0.027
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesResponse = await ClienteService.getClientes();
        setClientes(clientesResponse.data);
        if (id) {
          const cuentaResponse = await CuentaService.getCuentaById(id);
          setCuenta(cuentaResponse.data);
          setSaldoOriginal(cuentaResponse.data.saldo);
          setMonedaOriginal(cuentaResponse.data.moneda);
          const clienteSeleccionado = clientesResponse.data.find(cliente => cliente.id === cuentaResponse.data.clienteId);
          setFotoCliente(clienteSeleccionado ? `${process.env.REACT_APP_API_URL}/Images/${clienteSeleccionado.foto}` : '');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCuenta(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'clienteId') {
      const clienteSeleccionado = clientes.find(cliente => cliente.id === value);
      setFotoCliente(clienteSeleccionado ? `${process.env.REACT_APP_API_URL}/Images/${clienteSeleccionado.foto}` : '');
    }
  };

  const handleCurrencyChange = (value) => {
    if (value === cuenta.moneda) {
      return;
    }

    if (value === monedaOriginal) {
      setCuenta(prevState => ({
        ...prevState,
        saldo: saldoOriginal,
        moneda: value
      }));
    } else {
      const saldoConvertido = convertirSaldo(cuenta.saldo, cuenta.moneda, value);
      setCuenta(prevState => ({
        ...prevState,
        moneda: value,
        saldo: saldoConvertido
      }));
    }
  };

  const convertirSaldo = (saldoOriginal, monedaOriginal, monedaObjetivo) => {
    if (monedaOriginal === monedaObjetivo) {
      return parseFloat(saldoOriginal).toFixed(2);
    }

    const tasaCambio = tasasCambio[monedaOriginal][monedaObjetivo];
    return (saldoOriginal * tasaCambio).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cuenta.tipo || !cuenta.saldo || !cuenta.clienteId) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }
    try {
      if (id) {
        await CuentaService.updateCuenta(id, cuenta);
        setExitocreacion('Cuenta actualizada exitosamente');
      } else {
        await CuentaService.createCuenta(cuenta);
        setExitocreacion('Cuenta creada exitosamente');
      }
      setTimeout(() => {
        setExitocreacion('');
        navigate('/cuentas');
      }, 2000);
    } catch (error) {
      console.error('Error al guardar cuenta:', error);
      setMensajeError('Hubo un error al guardar la cuenta. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        position: 'relative',
        maxWidth: '100%',
        padding: 3,
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      {fotoCliente && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 250,
            width: 200,
            height: 200,
            overflow: 'hidden',
            borderRadius: '20%',
            boxShadow: 1
          }}
        >
          <img
            src={fotoCliente}
            alt="Foto del Cliente"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </Box>
      )}
      <Box
        sx={{
          width: '200%',
          maxWidth: '600px',
          margin: '-40px 100px 100px',
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: '#fff',
          position: 'relative'
        }}
      >
        <Typography variant="h5" gutterBottom>
          {id ? 'Actualizar Cuenta' : 'Crear Cuenta'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="cliente-label">Cliente</InputLabel>
              <Select
                labelId="cliente-label"
                id="cliente-select"
                name="clienteId"
                value={cuenta.clienteId}
                onChange={handleChange}
                required
                label="Cliente"
              >
                {clientes.length === 0 ? (
                  <MenuItem disabled>No hay clientes disponibles</MenuItem>
                ) : (
                  clientes.map(cliente => (
                    <MenuItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </MenuItem>
                  ))
                )}
              </Select>
              {clientes.length === 0 && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  No hay clientes disponibles para seleccionar.
                </Typography>
              )}
            </FormControl>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="tipo-label">Tipo de Cuenta</InputLabel>
              <Select
                labelId="tipo-label"
                id="tipo-select"
                name="tipo"
                value={cuenta.tipo}
                onChange={handleChange}
                required
                label="Tipo de Cuenta"
              >
                <MenuItem value="Ahorro">Ahorro</MenuItem>
                <MenuItem value="Corriente">Corriente</MenuItem>
                <MenuItem value="Inversión">Inversión</MenuItem>
                <MenuItem value="Nómina">Nómina</MenuItem>
                <MenuItem value="Conjunta">Conjunta</MenuItem>
                <MenuItem value="Jubilación">Jubilación</MenuItem>
                <MenuItem value="Estudiante">Estudiante</MenuItem>
              </Select>
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <TextField
                label="Saldo"
                placeholder="Monto"
                value={cuenta.saldo}
                name="saldo"
                onChange={handleChange}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {cuenta.moneda === 'NIO' ? 'C$' : cuenta.moneda === 'USD' ? '$' : '€'}
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <FormControl variant="outlined" size="small">
                        <Select
                          value={cuenta.moneda}
                          onChange={(e) => handleCurrencyChange(e.target.value)}
                          variant="outlined"
                          sx={{ ml: 1 }}
                        >
                          <MenuItem value="NIO">Córdoba</MenuItem>
                          <MenuItem value="USD">US dollar</MenuItem>
                          <MenuItem value="EUR">Euro</MenuItem>
                        </Select>
                      </FormControl>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <TextField
                label="Beneficiario"
                name="beneficiarios"
                value={cuenta.beneficiarios || ''}
                onChange={handleChange}
                variant="outlined"
                required
                placeholder="Nombre del beneficiario"
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: 16 }}
            >
              {id ? 'Actualizar Cuenta' : 'Crear Cuenta'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              style={{ marginTop: 16 }}
              onClick={() => navigate(-1)}
            >
              Atrás
            </Button>
          </FormGroup>
        </form>
        {exitocreacion && (
          <Alert severity="success" sx={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
            <AlertTitle>Operación Exitosa</AlertTitle>
            {exitocreacion}
          </Alert>
        )}
        {mensajeError && (
          <Alert severity="error" sx={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
            <AlertTitle>Error</AlertTitle>
            {mensajeError}
          </Alert>
        )}
      </Box>
    </Box>
  );
};
export default FormularioCuenta;