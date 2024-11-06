import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { AccountBalance } from '@mui/icons-material';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const TransferenciaResultados = ({ transferencias, numeroCuenta, onLimpiarFiltro }) => {
  const [expandedPanel, setExpandedPanel] = useState(null);
  const [transferenciasGrouped, setTransferenciasGrouped] = useState({});

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

  useEffect(() => {
    const grouped = groupByMonthYear(transferencias);
    setTransferenciasGrouped(grouped);

    if (transferencias.length > 0) {
      const currentDate = new Date();
      const currentMonthYear = `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
      if (grouped[currentMonthYear]) {
        setExpandedPanel(currentMonthYear);
      }
    }
  }, [transferencias]);

  const sortedMonthYearKeys = Object.keys(transferenciasGrouped).sort((a, b) => {
    const [mesA, anioA] = a.split("-");
    const [mesB, anioB] = b.split("-");
    const dateA = new Date(anioA, mesA - 1);
    const dateB = new Date(anioB, mesB - 1);
    return dateB - dateA;
  });

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
    <Box>
      {sortedMonthYearKeys.map((mesAnio) => {
        const [mes, anio] = mesAnio.split("-");
        const fecha = new Date(anio, mes - 1);

        return (
          <Accordion
            key={mesAnio}
            sx={{ mb: 2 }}
            expanded={expandedPanel === mesAnio}
            onChange={() => setExpandedPanel(expandedPanel === mesAnio ? null : mesAnio)}
          >
            <AccordionSummary expandIcon={<ArrowDownwardIcon />} id={`panel-${mesAnio}`}>
              <Typography variant="h6">{`${fecha.toLocaleString('default', { month: 'long' })} ${anio}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {transferenciasGrouped[mesAnio].map((transferencia) => {
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
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default TransferenciaResultados;