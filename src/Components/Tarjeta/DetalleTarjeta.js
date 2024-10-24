import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TarjetaService from '../../Services/TarjetaService';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Card,
  CardContent,
  Grid,
  Divider,
  Snackbar,
  Alert,
  Skeleton
} from '@mui/material';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tarjetaResponse = await TarjetaService.getTarjetasById(id);
        setTarjeta(tarjetaResponse.data);
        setTimeout(() => {
          setLoading(false);
        }, 100);
      } catch (error) {
        setSnackbar({ open: true, message: 'Error al obtener los datos de la tarjeta', severity: 'error' });
        setLoading(false);
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

  if (loading) {
    return (
      <Box sx={{ padding: 3, marginLeft: 6 }}>
        <Typography variant="h4" gutterBottom>
          Detalle de la tarjeta
        </Typography>
        <Card sx={{ maxWidth: '1300px', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 3, boxShadow: 3, height: '247px' }}>
          <CardContent sx={{ flex: 1 }}>
            <Skeleton variant="rectangular" height="40%" sx={{ marginBottom: 1 }} />
            <Skeleton variant="text" width="80%" height={30} sx={{ marginBottom: 1 }} />
            <Skeleton variant="text" width="60%" height={30} sx={{ marginBottom: 1 }} />
            <Skeleton variant="text" width="40%" height={30} />
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, marginLeft: 6 }}>
      <Typography variant="h4" gutterBottom>
        Detalle de la tarjeta
      </Typography>

      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 3, boxShadow: 3, borderRadius: 2 }}>
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h5" gutterBottom>
            <strong>No. Tarjeta:</strong> {tarjeta.no_Tarjeta}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Marca de tarjeta:</strong> {tarjeta.marca_Tarjeta.toUpperCase()}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Tipo de tarjeta:</strong> {tarjeta.tipo_Tarjeta.toUpperCase()}
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
            sx={{ borderRadius: 2 }}
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
            sx={{ borderRadius: 2 }}
          >
            Eliminar tarjeta
          </Button>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
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