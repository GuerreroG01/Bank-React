import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClienteService from '../Services/ClienteService';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Card, CardContent, CardMedia, Grid, Divider, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const DetalleCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clienteResponse = await ClienteService.getClienteById(id);
        setCliente(clienteResponse.data);
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

  const formatDate = (date) => {
    if (!date) return 'No disponible';
    return format(new Date(date), 'dd MMMM yyyy', { locale: es });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!cliente) return <div>Loading...</div>;

  const imageUrl = `http://localhost:5011/Images/${cliente.foto}`;

  return (
    <Box sx={{ padding: 3, marginLeft: 6 }}>
      <Typography variant="h4" gutterBottom>
        Detalle del Cliente
      </Typography>

      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 3 }}>
        <CardMedia
          component="img"
          sx={{ width: { xs: '100%', sm: '200px' }, height: { xs: 'auto', sm: '200px' }, objectFit: 'contain' }}
          image={imageUrl}
          alt="Foto del Cliente"
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h5" gutterBottom>
            <strong>Cliente:</strong> {cliente.nombre}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Teléfono:</strong> {cliente.telefono}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Fecha de Nacimiento:</strong> {formatDate(cliente.nacimiento)}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Edad:</strong> {cliente.edad} años
          </Typography>
          <Divider sx={{ my: 2 }} />
        </CardContent>
      </Card>

      <Grid container spacing={2} mb={2}>
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
