import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TarjetaService from '../../Services/TarjetaService';
import ClienteService from '../../Services/ClienteService';
import PropTypes from 'prop-types';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Tooltip, Box, Skeleton,
  Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle, Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function Row({ tarjeta, onEdit, onDelete, onViewDetails, cliente }) {

  return (
    <>
      <TableRow>
        <TableCell>{cliente ? cliente.nombre : 'N/A'}</TableCell>
        <TableCell>{tarjeta.no_Tarjeta}</TableCell>
        <TableCell>{tarjeta.no_Cuenta}</TableCell>
        <TableCell>{tarjeta.vencimiento ? format(new Date(tarjeta.vencimiento), 'dd MMM yyyy', { locale: es }) : 'N/A'}</TableCell>
        <TableCell>
          <Tooltip title="Ver detalles">
            <IconButton color="info" onClick={() => onViewDetails(tarjeta.no_Tarjeta)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton color="primary" onClick={() => onEdit(tarjeta.no_Tarjeta)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton color="secondary" onClick={() => onDelete(tarjeta.no_Tarjeta)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  tarjeta: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  cliente: PropTypes.object,
};

const Index_Tarjetas = () => {
  const [tarjetas, setTarjetas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTarjetaId, setSelectedTarjetaId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTarjetas();
    fetchClientes();
  }, []);

  const fetchTarjetas = async () => {
    try {
      const response = await TarjetaService.getTarjetas();
      setTarjetas(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setLoading(false);
    }
  };  

  const fetchClientes = async () => {
    try {
      const response = await ClienteService.getClientes();
      setClientes(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleEdit = (no_Tarjeta) => {
    navigate(`/tarjetas/editar/${no_Tarjeta}`);
  };

  const handleDelete = (no_Tarjeta) => {
    setSelectedTarjetaId(no_Tarjeta);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await TarjetaService.deleteTarjeta(selectedTarjetaId);
      fetchTarjetas();
      setSnackbarMessage('Tarjeta eliminada exitosamente.');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error deleting card:', error);
      setSnackbarMessage('Error al eliminar la tarjeta. Por favor, inténtelo de nuevo.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
    setOpenDialog(false);
  };

  const handleViewDetails = (id) => {
    navigate(`/tarjetas/detalle/${id}`);
  };

  const handleCreateNew = () => {
    navigate('/tarjetas/formulario');
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Tarjetas
        </Typography>
        <Tooltip title="Nueva Tarjeta">
          <IconButton color="primary" onClick={handleCreateNew}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre del Cliente</TableCell>
              <TableCell>No. Tarjeta</TableCell>
              <TableCell>No. Cuenta</TableCell>
              <TableCell>Fecha de vencimiento</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="rectangular" width={40} height={40} />
                  </TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width={150} height={40} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              tarjetas.map(tarjeta => {
                const cliente = clientes.find(c => c.cuentas && c.cuentas.some(cuenta => cuenta.no_Cuenta === tarjeta.no_Cuenta));
                return (
                  <Row
                    key={tarjeta.no_Tarjeta}
                    tarjeta={tarjeta}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewDetails={handleViewDetails}
                    cliente={cliente}
                  />
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
          <Button onClick={confirmDelete} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        action={
          <IconButton color="inherit" onClick={handleSnackbarClose}>
            <CloseIcon />
          </IconButton>
        }
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Index_Tarjetas;