import React from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { AccountBalance } from '@mui/icons-material';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

const TransferenciaResultados = ({ transferencias, numeroCuenta, onLimpiarFiltro }) => {
  if (transferencias.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          textAlign: 'center',
          border: '1px dashed #ccc',
          borderRadius: 2,
          p: 3,
          bgcolor: '#f9f9f9',
        }}
      >
        <SearchOffIcon sx={{ fontSize: 60, color: '#f44336' }} />
        <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
          No se encontraron transferencias para la cuenta {numeroCuenta}.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Asegúrate de que el número de cuenta sea correcto o intenta con otra cuenta.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={onLimpiarFiltro}
        >
          Limpiar Filtro
        </Button>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {transferencias.map((transferencia) => {
        const cuentaDestinoStr = String(transferencia.cuentaDestinoId).trim();
        const numeroCuentaStr = String(numeroCuenta).trim();
        
        return (
          <Grid item xs={12} sm={6} md={4} key={transferencia.id}>
            <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <CurrencyExchangeOutlinedIcon sx={{ width: 56, height: 56, mr: 2 }} />
                <Typography variant="h6">Transferencia #{transferencia.id}</Typography>
                <Box sx={{ marginLeft: 'auto' }}>
                  {String(transferencia.cuentaOrigenId).trim() === numeroCuentaStr && (
                    <KeyboardDoubleArrowUpIcon sx={{ color: 'red' }} />
                  )}
                  {cuentaDestinoStr === numeroCuentaStr && (
                    <KeyboardDoubleArrowDownIcon sx={{ color: 'blue' }} />
                  )}
                </Box>
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
        );
      })}
    </Grid>
  );
};

export default TransferenciaResultados;