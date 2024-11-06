import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Skeleton, Alert } from '@mui/material';
import TransferenciaService from '../../Services/TransferenciaService';
import FiltrarTransferencias from './Filtrado/FiltrarTransferencias';
import TransferenciaResultados from './Filtrado/TransferenciaResultados';

const Transferencias = () => {
  const [transferencias, setTransferencias] = useState([]);
  const [allTransferencias, setAllTransferencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [expandedPanel, setExpandedPanel] = useState(null);

  const fetchTransferencias = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await TransferenciaService.getTransferencias();
      setTransferencias(response.data);
      setAllTransferencias(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransferencias();
  }, []);

  useEffect(() => {
    if (transferencias.length > 0) {
      const groupedByMonthYear = groupByMonthYear(transferencias);
      const firstPanel = Object.keys(groupedByMonthYear)[0];
      setExpandedPanel(firstPanel);
    } else {
      setExpandedPanel(null);
    }
  }, [transferencias]);

  const groupByMonthYear = (transferencias) => {
    return transferencias.reduce((acc, transferencia) => {
      const fecha = new Date(transferencia.fechaTransferencia);
      const mesAnio = `${fecha.getMonth() + 1}-${fecha.getFullYear()}`;

      if (!acc[mesAnio]) {
        acc[mesAnio] = [];
      }
      acc[mesAnio].push(transferencia);

      return acc;
    }, {});
  };

  const handleFiltrar = (cuenta, fechaInicio, fechaFin) => {
    setNumeroCuenta(cuenta);
    let transferenciasFiltradas = allTransferencias;
  
    if (cuenta.trim().length > 0) {
      const cuentaNormalizada = parseInt(cuenta.trim(), 10);
      transferenciasFiltradas = transferenciasFiltradas.filter((transferencia) => {
        const cuentaOrigen = Number(transferencia.cuentaOrigenId);
        const cuentaDestino = Number(transferencia.cuentaDestinoId);
        return cuentaOrigen === cuentaNormalizada || cuentaDestino === cuentaNormalizada;
      });
    }
  
    if (fechaInicio) {
      transferenciasFiltradas = transferenciasFiltradas.filter((transferencia) => {
        const fechaTransferencia = new Date(transferencia.fechaTransferencia);
        return fechaTransferencia >= new Date(fechaInicio);
      });
    }
    
    if (fechaFin) {
      transferenciasFiltradas = transferenciasFiltradas.filter((transferencia) => {
        const fechaTransferencia = new Date(transferencia.fechaTransferencia);
        return fechaTransferencia <= new Date(fechaFin);
      });
    }
  
    setTransferencias(transferenciasFiltradas);
  };

  const handleLimpiarFiltro = () => {
    setNumeroCuenta('');
    setTransferencias(allTransferencias);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="flex-start" alignItems="center" height="100vh" paddingLeft={4}>
        <Grid container spacing={3} sx={{ marginLeft: '50px', marginTop: '-153px' }}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Skeleton variant="rectangular" width="100%" height={150} />
              <Skeleton width="80%" />
              <Skeleton width="60%" />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-start',
          minHeight: '100vh',
          padding: 2 
        }}
      >
        <Alert severity="error" sx={{ fontSize: '1rem', fontWeight: '500', width: '80%' }}>
          <Typography variant="body1">
            <strong>Error:</strong> {error}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, flexGrow: 1, ml: 8 }}>
      <Typography variant="h4" gutterBottom>
        Transferencias
      </Typography>
      <FiltrarTransferencias onFiltrar={handleFiltrar} numeroCuenta={numeroCuenta} />
      <TransferenciaResultados 
        transferencias={transferencias}
        numeroCuenta={numeroCuenta}
        onLimpiarFiltro={handleLimpiarFiltro}
        expandedPanel={expandedPanel}
        setExpandedPanel={setExpandedPanel}
      />
    </Box>
  );
};

export default Transferencias;