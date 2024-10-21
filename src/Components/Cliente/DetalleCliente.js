import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClienteService from '../../Services/ClienteService';
import CuentaService from '../../Services/CuentaService';
import TarjetaService from '../../Services/TarjetaService';
import { Box, Typography, Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel, Card, CardContent, CardMedia } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import Cuentas from './Grids/Cuentas';
import Tarjetas from './Grids/Tarjetas';

const DetalleCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [cuentas, setCuentas] = useState([]);
  const [tarjetas, setTarjetas] = useState([]);
  const [selectedCuenta, setSelectedCuenta] = useState('Todas');
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clienteResponse = await ClienteService.getClienteById(id);
        setCliente(clienteResponse.data);
        const cuentasResponse = await CuentaService.getCuentas();
        const clienteId = Number(id);
        const cuentasFiltradas = cuentasResponse.data.filter(c => c.clienteId === clienteId);
        setCuentas(cuentasFiltradas);
        const tarjetasResponse = await TarjetaService.getTarjetas(id);
        setTarjetas(tarjetasResponse.data);
        
        const response = await ClienteService.getClientes();
        setClientes(response.data);
      } catch (error) {
        setSnackbar({ open: true, message: 'Error al obtener los datos del cliente', severity: 'error' });
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleDeleteCliente = async () => {
    try {
      await ClienteService.deleteCliente(id);
      setSnackbar({ open: true, message: 'Cliente eliminado correctamente', severity: 'success' });
      navigate('/clientes');
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al eliminar el cliente', severity: 'error' });
    }
    setOpenDialog(false);
  };

  const handleCuentaChange = (event) => {
    setSelectedCuenta(event.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!cliente) return <div>Loading...</div>;

  const filteredCuentas = selectedCuenta === "Todas" ? cuentas : cuentas.filter(cuenta => cuenta.no_Cuenta === selectedCuenta);
  const filteredTarjetas = selectedCuenta === "Todas" ? tarjetas : tarjetas.filter(tarjeta => tarjeta.no_Cuenta === selectedCuenta);

  return (
    <Box sx={{ padding: "2rem", marginLeft: 6, marginTop: -6 }}>
      <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <Grid container spacing={3}>
          {/* Solo mostrar el cliente seleccionado */}
          <Grid item xs={12} key={cliente.id}>
            <Card sx={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'space-between' }}>
              <CardMedia
                component="img"
                alt={`Foto de ${cliente.nombre}`}
                height="140"
                image={`${process.env.REACT_APP_API_URL}/Images/${cliente.foto}`}
                sx={{ width: 140, objectFit: 'cover' }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">Cliente: {cliente.nombre}</Typography>
                <Typography variant="subtitle1">Teléfono: {cliente.telefono}</Typography>
                <Typography variant="subtitle1">Fecha de Nacimiento: {cliente.nacimiento}</Typography>
                <Typography variant="subtitle1">Edad: {cliente.edad} años</Typography>
              </CardContent>
              <FormControl sx={{ minWidth: 150, margin: 2 }} variant="standard">
                <InputLabel id="cuenta-label" sx={{ fontFamily: 'Arial, sans-serif' }}>Tipos de Cuenta</InputLabel>
                <Select
                  labelId="cuenta-label"
                  value={selectedCuenta}
                  onChange={handleCuentaChange}
                  inputProps={{
                    'aria-label': 'Tipos de Cuenta',
                  }}
                  sx={{ fontFamily: 'Arial, sans-serif' }}
                >
                  <MenuItem value="Todas">
                    <Typography component="span" variant="body2" sx={{ fontFamily: 'Arial, sans-serif' }}>
                      Todas
                    </Typography>
                  </MenuItem>
                  {cuentas.map(cuenta => (
                    <MenuItem key={cuenta.no_Cuenta} value={cuenta.no_Cuenta}>
                      {cuenta.no_Cuenta} - {cuenta.tipo} - {cuenta.saldo} {cuenta.moneda}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2} sx={{ marginTop: 3, marginLeft: -1 }}>
        {filteredCuentas.map(cuenta => (
          <Grid container item xs={12} spacing={2} key={cuenta.no_Cuenta}>
            <Grid item xs={12} sm={6}>
              <Cuentas cuentas={[cuenta]} />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ marginTop: -1 }}>
              <Tarjetas tarjetas={filteredTarjetas.filter(tarjeta => tarjeta.no_Cuenta === cuenta.no_Cuenta)} />
            </Grid>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} mb={2} sx={{ marginTop: 1 }}>
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/clientes/editar/${id}`)}
            startIcon={<EditIcon />}
          >
            Editar Cliente
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setOpenDialog(true)}
            startIcon={<DeleteIcon />}
          >
            Eliminar Cliente
          </Button>
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar este cliente?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleDeleteCliente} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        action={
          <IconButton color="inherit" onClick={handleSnackbarClose}>
            <CloseIcon />
          </IconButton>
        }
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DetalleCliente;