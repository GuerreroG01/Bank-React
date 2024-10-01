import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TarjetaService from '../Services/TarjetaService';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Card, CardContent, CardMedia, Grid, Divider, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const DetalleTarjeta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tarjeta, setTarjeta] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tarjetaResponse = await TarjetaService.getTarjetasById(id);
        setTarjeta(tarjetaResponse.data);
      } catch (error) {
        setSnackbar({ open: true, message: 'Error al obtener los datos del cliente', severity: 'error' });
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleDeleteTarjeta = async () => {
    try {
      await TarjetaService.deleteTarjeta(id);
      setSnackbar({ open: true, message: 'Tarjeta eliminada correctamente', severity: 'success' });
      navigate('/tarjetas');
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al eliminar la tarjeta', severity: 'error' });
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

  if (!tarjeta) return <div>Loading...</div>;

  return (
    <Box sx={{ padding: 3, marginLeft: 6 }}>
      <Typography variant="h4" gutterBottom>
        Detalle de la tarjeta
      </Typography>

      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 3 }}>
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h5" gutterBottom>
            <strong>No. Tarjeta:</strong> {tarjeta.no_Tarjeta}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Marca de tarjeta:</strong> {tarjeta.marca_Tarjeta}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Tipo de tarjeta:</strong> {(tarjeta.tipo_Tarjeta).toUpperCase()}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Límite de crédito:</strong> {tarjeta.limite_Credito} 
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Fecha de vencimiento:</strong> {formatDate(tarjeta.vencimiento)} 
          </Typography>
          <Divider sx={{ my: 2 }} />
        </CardContent>
      </Card>

      <Grid container spacing={2} mb={2}>
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/tarjetas/editar/${id}`)}
            startIcon={<EditIcon />}
          >
            Editar tarjeta
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setOpenDialog(true)}
            startIcon={<DeleteIcon />}
          >
            Eliminar tarjeta
          </Button>
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar esta tarjeta?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleDeleteTarjeta} color="error">Eliminar</Button>
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

export default DetalleTarjeta;
