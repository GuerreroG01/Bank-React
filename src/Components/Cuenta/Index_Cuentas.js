import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CuentaService from '../../Services/CuentaService';
import ClienteService from '../../Services/ClienteService';
import ReportService from '../../Services/ReportService';
import PropTypes from 'prop-types';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Tooltip, Box, Skeleton,
  Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle, Button,
  Pagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import FiltroCuentas from './FiltroCuentas';
import { useTheme } from '@mui/material/styles';

const Row = ({ cuenta, onEdit, onDelete, onViewDetails, clientes }) => {
  const { saldo, moneda } = cuenta;
  const formattedSaldo = moneda === 'NIO'
    ? `C$${saldo.toFixed(2)}`
    : moneda === 'USD'
      ? `$${saldo.toFixed(2)}`
      : `€${saldo.toFixed(2)}`;
  return (
    <TableRow>
      <TableCell>{clientes.find(cliente => cliente.id === cuenta.clienteId)?.nombre || 'N/A'}</TableCell>
      <TableCell>{cuenta.no_Cuenta}</TableCell>
      <TableCell>{cuenta.tipo}</TableCell>
      <TableCell>{formattedSaldo}</TableCell>
      <TableCell>
        <Tooltip title="Ver detalles">
          <IconButton color="info" onClick={() => onViewDetails(cuenta.no_Cuenta)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar">
          <IconButton color="primary" onClick={() => onEdit(cuenta.no_Cuenta)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton color="secondary" onClick={() => onDelete(cuenta.no_Cuenta)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

Row.propTypes = {
  cuenta: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  clientes: PropTypes.array.isRequired,
};

const Index_Cuentas = () => {
  const theme = useTheme();
  const [cuentas, setCuentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCuentaId, setSelectedCuentaId] = useState(null);
  const [filters, setFilters] = useState({ moneda: '', tipo: '', minSaldo: '', maxSaldo: '' });
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCuentas();
    fetchClientes();
  }, []);

  const fetchCuentas = async () => {
    try {
      const response = await CuentaService.getCuentas();
      const cuentasOrdenadas = response.data.sort((a, b) => a.tipo.localeCompare(b.tipo));
      setCuentas(cuentasOrdenadas);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching accounts:', error);
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

  const handleEdit = (id) => {
    navigate(`/cuentas/editar/${id}`);
  };

  const handleDelete = (id) => {
    setSelectedCuentaId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await CuentaService.deleteCuenta(selectedCuentaId);
      fetchCuentas();
      setSnackbarMessage('Cuenta eliminada exitosamente.');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error deleting account:', error);
      setSnackbarMessage('Error al eliminar la cuenta. Por favor, inténtelo de nuevo.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
    setOpenDialog(false);
  };

  const handleViewDetails = (id) => {
    navigate(`/cuentas/detalle/${id}`);
  };

  const handleCreateNew = () => {
    navigate('/cuentas/nueva');
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredCuentas = cuentas.filter(cuenta => {
    const { moneda, tipo, minSaldo, maxSaldo } = filters;
    const saldo = cuenta.saldo || 0;

    const isMonedaMatch = !moneda || cuenta.moneda === moneda;
    const isTipoMatch = !tipo || cuenta.tipo === tipo;
    const isMinSaldoMatch = minSaldo === '' || saldo >= minSaldo;
    const isMaxSaldoMatch = maxSaldo === '' || saldo <= maxSaldo;

    return isMonedaMatch && isTipoMatch && isMinSaldoMatch && isMaxSaldoMatch;
  });

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const paginatedCuentas = filteredCuentas.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleExportRanking = async () => {
    try {
      await ReportService.exportarRankingClientesPorSaldo();
      console.log('Reporte de ranking exportado con éxito');
    } catch (error) {
      console.error('Error al exportar el reporte', error);
    }
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Cuentas
        </Typography>
        <Box>
          <Tooltip title="Nueva Cuenta">
            <IconButton color="primary" onClick={handleCreateNew}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Ranking De Cuentas Por Saldo">
            <IconButton color="success" onClick={handleExportRanking}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <FiltroCuentas filters={filters} onFilterChange={handleFilterChange} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Número de Cuenta</TableCell>
              <TableCell>Tipo de Cuenta</TableCell>
              <TableCell>Saldo</TableCell>
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
              paginatedCuentas.map(cuenta => (
                <Row
                  key={cuenta.no_Cuenta}
                  cuenta={cuenta}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewDetails={handleViewDetails}
                  clientes={clientes}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Pagination
          count={Math.ceil(filteredCuentas.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          shape="rounded"
          color="primary"
          sx={{
            bgcolor: theme.palette.background.default,
            '& .MuiPaginationItem-root': {
              color: 'black',
            },
            '& .MuiPaginationItem-ellipsis': {
              color: 'black',
            },
            '& .Mui-selected': {
              bgcolor: '#81c784',
              color: 'white',
            },
          }}
        />
      </Box>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar esta cuenta?</Typography>
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

export default Index_Cuentas;