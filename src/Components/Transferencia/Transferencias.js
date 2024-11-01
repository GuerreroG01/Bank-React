import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import TransferenciaService from '../../Services/TransferenciaService';
import { AccountBalance } from '@mui/icons-material';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';

const Transferencias = () => {
  const [transferencias, setTransferencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransferencias = async () => {
      try {
        const response = await TransferenciaService.getTransferencias();
        setTransferencias(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransferencias();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, flexGrow: 1, ml: 8 }}>
      <Typography variant="h4" gutterBottom>
        Transferencias
      </Typography>
      <Grid container spacing={3}>
        {transferencias.map((transferencia) => (
          <Grid item xs={12} sm={6} md={4} key={transferencia.id}>
            <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <CurrencyExchangeOutlinedIcon sx={{ width: 56, height: 56, mr: 2 }} />
                <Typography variant="h6">Transferencia #{transferencia.id}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1" color="textSecondary">
                  <AccountBalance /> Cuenta Origen: {transferencia.cuentaOrigenId}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  <AccountBalance /> Cuenta Destino: {transferencia.cuentaDestinoId}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="h6" color={transferencia.monto > 0 ? 'green' : 'red'}>
                  Monto: {transferencia.monto} {transferencia.moneda}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {new Date(transferencia.fechaTransferencia).toLocaleDateString()}
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary" mt={1}>
                {transferencia.descripcion || 'Sin descripción'}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Transferencias;