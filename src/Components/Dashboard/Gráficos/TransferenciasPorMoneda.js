import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const TransferenciasPorMoneda = ({ transferenciasPorMoneda }) => {
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

  const transferenciasPorMonedaConVerificacion = transferenciasPorMoneda.map((item) => ({
    ...item,
    transferenciasConvertidas: convertir(item.totalTransferencias, item.moneda, monedaSeleccionada),
    transferenciasOriginales: item.totalTransferencias,
  }));

  useEffect(() => {
    const totalTransferencias = transferenciasPorMoneda.reduce((acc, item) => acc + item.totalTransferencias, 0);
    console.log('Total de todas las transferencias:', totalTransferencias);
  }, [transferenciasPorMoneda]);

  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  return (
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.secondary' }}>
        Transferencias Totales
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
        <PieChart>
          <Pie
            data={transferenciasPorMonedaConVerificacion}
            dataKey="transferenciasConvertidas"
            nameKey="moneda"
            cx="50%"
            cy="50%"
            outerRadius={80}
            labelLine={false}
            label={({ value }) => `${monedaSeleccionada}: ${formatNumber(value)}`}
          >
            {
              transferenciasPorMonedaConVerificacion.map((item, index) => (
                <Cell key={`cell-${index}`} fill={coloresMonedas[item.moneda]} />
              ))
            }
          </Pie>
          <Tooltip
            formatter={(value, name, props) => {
              const item = transferenciasPorMonedaConVerificacion.find((item) => item.moneda === name);
              const saldoOriginal = item ? item.transferenciasOriginales : 0;
              return [`${name}: ${formatNumber(saldoOriginal)}`];
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default TransferenciasPorMoneda;