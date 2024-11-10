import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const SaldoPorMonedaChart = ({ saldoPorMoneda }) => {
  const coloresMonedas = {
    EUR: "#8884d8",
    NIO: "#82ca9d",
    USD: "#ff7300",
  };

  const tasasCambio = {
    EUR: {
      USD: 1.09,
      NIO: 39.91,
    },
    USD: {
      EUR: 0.92,
      NIO: 36.69,
    },
    NIO: {
      EUR: 0.025,
      USD: 0.027,
    },
  };

  const convertir = (monto, monedaOrigen, monedaDestino) => {
    if (monedaOrigen === monedaDestino) return monto;
    if (tasasCambio[monedaOrigen] && tasasCambio[monedaOrigen][monedaDestino]) {
      return monto * tasasCambio[monedaOrigen][monedaDestino];
    }
    return monto;
  };

  const [monedaSeleccionada, setMonedaSeleccionada] = useState('NIO');

  const saldoPorMonedaConVerificacion = saldoPorMoneda.map((item) => ({
    ...item,
    saldoConvertido: convertir(item.totalSaldo, item.moneda, monedaSeleccionada),
  }));

  useEffect(() => {
    const totalSaldo = saldoPorMoneda.reduce((acc, item) => acc + item.totalSaldo, 0);
    console.log('Total de todos los saldos:', totalSaldo);
  }, [saldoPorMoneda]);

  // Función para formatear los números
  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.secondary' }}>
        Saldo Total De Cuentas
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2, marginTop: -6 }}>
        <FormControl variant="filled" sx={{ minWidth: 120 }}>
          <InputLabel id="select-moneda-label">Moneda</InputLabel>
          <Select
            labelId="select-moneda-label"
            value={monedaSeleccionada}
            label="Moneda"
            onChange={(e) => setMonedaSeleccionada(e.target.value)}
          >
            <MenuItem value="EUR">EUR</MenuItem>
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="NIO">NIO</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={saldoPorMonedaConVerificacion} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="moneda" />
          <YAxis />
          <Tooltip formatter={(value) => formatNumber(value)} />
          <Legend />
          <Bar dataKey="saldoConvertido" name={`Saldo en ${monedaSeleccionada}`} barSize={40}>
            {
              saldoPorMonedaConVerificacion.map((item, index) => (
                <Cell key={`cell-${index}`} fill={coloresMonedas[item.moneda]} />
              ))
            }
            <LabelList 
              dataKey="totalSaldo" 
              position="top" 
              formatter={(value) => formatNumber(value)} 
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SaldoPorMonedaChart;