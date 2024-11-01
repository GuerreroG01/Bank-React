import React, { useEffect, useState } from 'react';
import CuentaService from '../../Services/CuentaService';
import TransferenciaService from '../../Services/TransferenciaService';
import { Box, Typography, Skeleton, Button, FormControl, Snackbar, InputLabel, Input, TextField, InputAdornment, Card, Grid, Select, MenuItem } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import CircularProgress from '@mui/material/CircularProgress';
import ClienteService from '../../Services/ClienteService';

const TransferenciaForm = () => {
  const [cuentas, setCuentas] = useState([]);
  const [transferencia, setTransferencia] = useState({
    CuentaOrigenId: '',
    CuentaDestinoId: '',
    Monto: '',
    Moneda: 'NIO',
    Descripcion: ''
  });
  const [cuentaOrigen, setCuentaOrigen] = useState(null);
  const [cuentaDestino, setCuentaDestino] = useState(null);
  const [clienteOrigen, setClienteOrigen] = useState(null);
  const [clienteDestino, setClienteDestino] = useState(null);
  const [error, setError] = useState(null);
  const [buscandoOrigen, setBuscandoOrigen] = useState(false);
  const [buscandoDestino, setBuscandoDestino] = useState(false);
  const [sinCoincidenciaOrigen, setSinCoincidenciaOrigen] = useState(false);
  const [sinCoincidenciaDestino, setSinCoincidenciaDestino] = useState(false);
  const [coincidenciaEncontradaOrigen, setCoincidenciaEncontradaOrigen] = useState(false);
  const [coincidenciaEncontradaDestino, setCoincidenciaEncontradaDestino] = useState(false);
  const [mismaCuentaError, setMismaCuentaError] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [montoConvertido, setMontoConvertido] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const response = await CuentaService.getCuentas();
        setCuentas(response.data);
      } catch (err) {
        console.error('Error al cargar las cuentas:', err);
        setError('Error al cargar las cuentas.');
      }
    };

    fetchCuentas();
  }, []);

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

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setTransferencia({ ...transferencia, [name]: value });

    if (name === "Moneda") {
      const monedaOrigen = transferencia.Moneda;
      const montoActual = parseFloat(transferencia.Monto) || 0;
      let nuevoMonto = montoActual;

      if (monedaOrigen && value && monedaOrigen !== value) {
        const tasa = tasasCambio[monedaOrigen][value];
        if (tasa) {
          nuevoMonto = (montoActual * tasa).toFixed(2);
        }
      }

      setTransferencia({ ...transferencia, [name]: value, Monto: nuevoMonto });
      setMontoConvertido(nuevoMonto);
    } else {
      setTransferencia({ ...transferencia, [name]: value });
    }

    if (name === "CuentaOrigenId") {
      setBuscandoOrigen(true);
      setCuentaOrigen(null);
      setCoincidenciaEncontradaOrigen(false);
      setSinCoincidenciaOrigen(false);
    } else if (name === "CuentaDestinoId") {
      setBuscandoDestino(true);
      setCuentaDestino(null);
      setCoincidenciaEncontradaDestino(false);
      setSinCoincidenciaDestino(false);
    }

    if (value.length === 10) {
      const cuenta = cuentas.find(c => c.no_Cuenta.toString() === value);
      if (name === "CuentaOrigenId") {
        setCuentaOrigen(cuenta || null);
        setCoincidenciaEncontradaOrigen(!!cuenta);
        setSinCoincidenciaOrigen(!cuenta);
        setBuscandoOrigen(false);
        if (cuenta) {
          const clienteResponse = await ClienteService.getClienteById(cuenta.clienteId);
          setClienteOrigen(clienteResponse.data);
        }
      } else if (name === "CuentaDestinoId") {
        setCuentaDestino(cuenta || null);
        setCoincidenciaEncontradaDestino(!!cuenta);
        setSinCoincidenciaDestino(!cuenta);
        setBuscandoDestino(false);
        if (cuenta) {
          const clienteResponse = await ClienteService.getClienteById(cuenta.clienteId);
          setClienteDestino(clienteResponse.data);
        }
      }
    } else {
      if (name === "CuentaOrigenId") {
        setBuscandoOrigen(true);
        setSinCoincidenciaOrigen(false);
      } else if (name === "CuentaDestinoId") {
        setBuscandoDestino(true);
        setSinCoincidenciaDestino(false);
      }
    }

    if (!value) {
      if (name === "CuentaOrigenId") {
        setBuscandoOrigen(false);
        setCuentaOrigen(null);
        setCoincidenciaEncontradaOrigen(false);
        setSinCoincidenciaOrigen(false);
      } else if (name === "CuentaDestinoId") {
        setBuscandoDestino(false);
        setCuentaDestino(null);
        setCoincidenciaEncontradaDestino(false);
        setSinCoincidenciaDestino(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMismaCuentaError(false);

    if (transferencia.CuentaOrigenId === transferencia.CuentaDestinoId) {
      setMismaCuentaError(true);
      return;
    }

    const Moneda = transferencia.Moneda;
    const montoOriginal = transferencia.Monto;
    const tasadestino = tasasCambio[Moneda][cuentaDestino.moneda];
    const tasaorigen = tasasCambio[Moneda][cuentaOrigen.moneda];
    const montoConvertidocredito = (parseFloat(montoOriginal) * (tasadestino || 1)).toFixed(2);
    const montoConvertidodedito = (parseFloat(montoOriginal) * (tasaorigen || 1)).toFixed(2);

    try {
      await TransferenciaService.createTransferencia(transferencia);
      await CuentaService.modificarSaldo(transferencia.CuentaOrigenId, -montoConvertidodedito);
      await CuentaService.modificarSaldo(transferencia.CuentaDestinoId, montoConvertidocredito);
      
      setSnackbarMessage('Transferencia creada con éxito');
      setSnackbarOpen(true);
      setTransferencia({ CuentaOrigenId: '', CuentaDestinoId: '', Monto: '', Moneda: 'NIO', Descripcion: '' });
      setCuentaOrigen(null);
      setCuentaDestino(null);
      setClienteOrigen(null);
      setClienteDestino(null);
      setBuscandoOrigen(false);
      setBuscandoDestino(false);
      setSinCoincidenciaOrigen(false);
      setSinCoincidenciaDestino(false);
      setCoincidenciaEncontradaOrigen(false);
      setCoincidenciaEncontradaDestino(false);
      setMontoConvertido('');
    } catch (err) {
      setError('Error al crear la transferencia o modificar los saldos. Verifica los datos.');
    }
  };

  const mostrarCardCoincidencias = () => {
    if (!transferencia.CuentaOrigenId && !transferencia.CuentaDestinoId) {
      return null;
    }
    return (
      <Card variant="outlined" sx={{ padding: 2, boxShadow: 2 }}>
        {mismaCuentaError && (
          <Typography color="error">
            <CancelIcon fontSize="small" /> No se permiten transferencias a la misma cuenta.
            {error && <Typography color="error">{error}</Typography>}
          </Typography>
        )}
        {buscandoOrigen && (
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={20} sx={{ marginRight: 1 }} />
            Buscando coincidencias para Cuenta de Origen...
          </Typography>
        )}
        {coincidenciaEncontradaOrigen && !buscandoOrigen && (
          <Typography variant="body1" color="success.main">
            <CheckCircleIcon fontSize="small" /> Coincidencias encontradas para Cuenta de Origen!
          </Typography>
        )}
        {sinCoincidenciaOrigen && !buscandoOrigen && (
          <Typography variant="body1" color="error">
            <CancelIcon fontSize="small" /> Sin coincidencias para Cuenta de Origen
          </Typography>
        )}
        {buscandoDestino && (
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={20} sx={{ marginRight: 1 }} />
            Buscando coincidencias para Cuenta de Destino...
          </Typography>
        )}
        {coincidenciaEncontradaDestino && !buscandoDestino && (
          <Typography variant="body1" color="success.main">
            <CheckCircleIcon fontSize="small" /> Coincidencias encontradas para Cuenta de Destino!
          </Typography>
        )}
        {sinCoincidenciaDestino && !buscandoDestino && (
          <Typography variant="body1" color="error">
            <CancelIcon fontSize="small" /> Sin coincidencias para Cuenta de Destino
          </Typography>
        )}
      </Card>
    );
  };

  const getCurrencySymbol = () => {
    switch (transferencia.Moneda) {
      case 'USD':
        return '$';
      case 'NIO':
        return 'C$';
      case 'EUR':
        return '€';
      default:
        return 'C$';
    }
  };

  return (
    <Grid container spacing={3} sx={{ padding: 2 }}>
      <Grid item xs={12} sm={6} sx={{ marginLeft: { xs: 0, sm: 10 }, marginTop: 0, position: 'relative' }}>
        <Box sx={{ padding: 3, boxShadow: 2, borderRadius: 2, backgroundColor: '#fff' }}>
          <Typography variant="h5" gutterBottom sx={{ marginBottom: 14 }}>
            Transferir
          </Typography>

          <Box sx={{ position: 'absolute', top: 40, left: '77%', transform: 'translateX(-50%)', width: '260px' }}>
            {mostrarCardCoincidencias()}
          </Box>

          <FormControl sx={{ width: '50%', mt: -10 }} margin="normal">
            <TextField
              label="Cuenta de Origen"
              name="CuentaOrigenId"
              value={transferencia.CuentaOrigenId}
              onChange={handleChange}
              required
              inputProps={{ pattern: "[0-9]*", inputMode: "numeric" }}
            />
          </FormControl>

          <FormControl sx={{ width: '50%', ml: -38, mt: -1 }} margin="normal">
            <TextField
              label="Cuenta de Destino"
              name="CuentaDestinoId"
              value={transferencia.CuentaDestinoId}
              onChange={handleChange}
              required
              inputProps={{ pattern: "[0-9]*", inputMode: "numeric" }}
            />
          </FormControl>

          <FormControl sx={{ width: '50%', mt: 8, ml: -38 }} margin="normal">
            <TextField
              label="Descripción"
              name="Descripcion"
              value={transferencia.Descripcion}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </FormControl>

          <FormControl sx={{ width: '60%', mb: 2 }} variant="standard">
            <InputLabel htmlFor="standard-adornment-amount">Monto</InputLabel>
            <Input
              id="standard-adornment-amount"
              name="Monto"
              value={transferencia.Monto}
              onChange={handleChange}
              startAdornment={<InputAdornment position="start">{getCurrencySymbol()}</InputAdornment>}
              required
              inputProps={{ pattern: "^[0-9]*\\.?[0-9]*$", inputMode: "decimal" }}
              endAdornment={
                <InputAdornment position="end" sx={{ mt: -0.9 }}>
                  <FormControl variant="outlined" size="small">
                    <Select
                      value={transferencia.Moneda}
                      onChange={handleChange}
                      name="Moneda"
                      sx={{ ml: 1 }}
                    >
                      <MenuItem value="NIO">NIO</MenuItem>
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="EUR">EUR</MenuItem>
                    </Select>
                  </FormControl>
                </InputAdornment>
              }
            />
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="success"
            sx={{ marginTop: -1.5, width: '160px', height: '60px', marginLeft: 8 }}
            onClick={handleSubmit}
          >
            Realizar Transferencia
          </Button>
        </Box>
      </Grid>

      <Grid item xs={6} sm={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ml: 4, mt: 4 }}>
        {cuentaOrigen && (
          <Card variant="outlined" sx={{ padding: 2, boxShadow: 2, marginTop: 2, display: 'flex', alignItems: 'center', width: '350px' }}>
            {clienteOrigen && clienteOrigen.foto ? (
              <img
                src={`${process.env.REACT_APP_API_URL}/Images/${clienteOrigen.foto}`}
                alt={`Foto`}
                style={{ width: '100px', height: '100px', objectFit: 'contain', borderRadius: '50%', marginRight: 16 }}
              />
            ) : (
              <Skeleton variant="circular" width={100} height={100} sx={{ marginRight: 2 }} />
            )}
            <Box>
              <Typography variant="h6">Cuenta Origen</Typography>
              <Typography>Cliente: {clienteOrigen ? clienteOrigen.nombre : 'Sin nombre'}</Typography>
              <Typography>Cuenta: {cuentaOrigen.no_Cuenta}</Typography>
            </Box>
          </Card>
        )}

        {cuentaDestino && (
          <>
            {cuentaOrigen && (
              <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', left: '0px', top: '8px' }}>
                <KeyboardDoubleArrowDownIcon fontSize="large" />
              </Grid>
            )}
            <Card variant="outlined" sx={{ padding: 2, boxShadow: 2, marginTop: 2, display: 'flex', alignItems: 'center', width: '350px' }}>
              {clienteDestino && clienteDestino.foto ? (
                <img
                  src={`${process.env.REACT_APP_API_URL}/Images/${clienteDestino.foto}`}
                  alt={`Foto`}
                  style={{ width: '100px', height: '100px', objectFit: 'contain', borderRadius: '50%', marginRight: 16 }}
                />
              ) : (
                <Skeleton variant="circular" width={100} height={100} sx={{ marginRight: 2 }} />
              )}
              <Box>
                <Typography variant="h6">Cuenta Destino</Typography>
                <Typography>Cliente: {clienteDestino ? clienteDestino.nombre : 'Sin nombre'}</Typography>
                <Typography>Cuenta: {cuentaDestino.no_Cuenta}</Typography>
              </Box>
            </Card>
          </>
        )}
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Grid>
  );
};

export default TransferenciaForm;