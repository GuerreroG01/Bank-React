import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CuentaService from '../../Services/CuentaService';
import ClienteService from '../../Services/ClienteService';
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
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';

function Row({ cuenta, onEdit, onDelete, onViewDetails, clientes }) {
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
        <TableCell>{cuenta.tipo}</TableCell>
        <TableCell>{cuenta.saldo}</TableCell>
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
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" noWrap component="div" sx={{ fontFamily: 'Roboto, sans-serif' }}>
                Información Adicional
              </Typography>
              <Typography variant="body1">
                Beneficiario: {cuenta.beneficiarios || 'N/A'}
              </Typography>
              <Typography variant="body1">
                Cliente: {clientes.find(cliente => cliente.id === cuenta.clienteId)?.nombre || 'N/A'}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  cuenta: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  clientes: PropTypes.array.isRequired,
};

const Index_Cuentas = () => {
  const [cuentas, setCuentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCuentaId, setSelectedCuentaId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCuentas();
    fetchClientes();
  }, []);

  const fetchCuentas = async () => {
    try {
      const response = await CuentaService.getCuentas();
      const cuentasOrdenadas = response.data.sort((a, b) =>
        a.tipo.localeCompare(b.tipo)
      );
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

  const exportToExcel = () => {
    const filteredCuentas = cuentas.map(({ clienteId, ...rest }) => ({
      ...rest,
      clienteId: clienteId
    }));

    const worksheet = XLSX.utils.json_to_sheet(filteredCuentas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cuentas');

    const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        font: {
          bold: true,
          color: { rgb: "FFFFFF" }
        },
        fill: {
          fgColor: { rgb: "4F81BD" }
        },
        alignment: {
          horizontal: "center"
        }
      };
    }

    for (let row = 0; row <= filteredCuentas.length; row++) {
      for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          alignment: {
            horizontal: "center"
          }
        };
      }
    }

    const columnWidths = [
      { wch: 5 },
      { wch: 30 },
      { wch: 15 },
      { wch: 20 },
      { wch: 10 }
    ];
    worksheet['!cols'] = columnWidths;

    XLSX.writeFile(workbook, 'cuentas.xlsx');
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
          <Tooltip title="Exportar a Excel">
            <IconButton color="success" onClick={exportToExcel}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
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
              cuentas.map(cuenta => (
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