import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClienteService from '../Services/ClienteService';
import PropTypes from 'prop-types';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Tooltip, Box, Collapse, Skeleton,
  Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle, Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function Row({ cliente, onEdit, onDelete, onViewDetails }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{cliente.nombre}</TableCell>
        <TableCell>{cliente.telefono}</TableCell>
        <TableCell>
          <Tooltip title="Ver detalles">
            <IconButton color="info" onClick={() => onViewDetails(cliente.id)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton color="primary" onClick={() => onEdit(cliente.id)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton color="secondary" onClick={() => onDelete(cliente.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" noWrap component="div" sx={{ fontFamily: 'Roboto, sans-serif' }}>
                Información Adicional
              </Typography>
              <Typography variant="body1">
                Fecha de Nacimiento: {cliente.nacimiento ? format(new Date(cliente.nacimiento), 'dd MMM yyyy', { locale: es }) : 'N/A'}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  cliente: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

const Index_Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await ClienteService.getClientes();
      const clientesOrdenados = response.data.sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );
      setClientes(clientesOrdenados);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/cliente/editar/${id}`);
  };

  const handleDelete = (id) => {
    setSelectedClienteId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await ClienteService.deleteCliente(selectedClienteId);
      fetchClientes();
      setSnackbarMessage('Cliente eliminado exitosamente.');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error deleting client:', error);
      setSnackbarMessage('Error al eliminar el cliente. Por favor, inténtelo de nuevo.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
    setOpenDialog(false);
  };

  const handleViewDetails = (id) => {
    navigate(`/clientes/detalle/${id}`);
  };

  const handleCreateNew = () => {
    navigate('/clientes/formulario');
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Clientes
        </Typography>
        <Tooltip title="Nuevo Cliente">
          <IconButton color="primary" onClick={handleCreateNew}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Nombre</TableCell>
              <TableCell>Teléfono</TableCell>
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
                  <TableCell>
                    <Skeleton variant="rectangular" width={150} height={40} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              clientes.map(cliente => (
                <Row
                  key={cliente.id}
                  cliente={cliente}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewDetails={handleViewDetails}
                />
              ))
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
          <Typography>¿Estás seguro de que deseas eliminar este cliente?</Typography>
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

export default Index_Clientes;
