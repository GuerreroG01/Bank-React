import React, { useState, useEffect } from 'react';
import { Box, TextField, FormControlLabel, Switch, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const FiltrarTransferencias = ({ onFiltrar, numeroCuenta }) => {
  const [localCuenta, setLocalCuenta] = useState(numeroCuenta);
  const [isFilterEnabled, setIsFilterEnabled] = useState(false); // No activar el filtro inicialmente
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Actualizar el estado de la cuenta al recibir un cambio en el prop
  useEffect(() => {
    setLocalCuenta(numeroCuenta);
  }, [numeroCuenta]);

  // Manejar el cambio del switch
  const handleSwitchChange = (e) => {
    const isChecked = e.target.checked;
    setIsFilterEnabled(isChecked);

    if (!isChecked) {
      setLocalCuenta('');
      onFiltrar('', '', '');  // Limpiar filtros de cuenta y fechas
    } else if (localCuenta.length === 10) {
      onFiltrar(localCuenta, fechaInicio, fechaFin); // Filtros de cuenta y fechas
    }
  };

  const handleInputChange = (e) => {
    const cuenta = e.target.value;
    if (/^\d*$/.test(cuenta) && cuenta.length <= 10) {
      setLocalCuenta(cuenta);
      if (cuenta.length === 10) {
        onFiltrar(cuenta, fechaInicio, fechaFin); // Filtros de cuenta y fechas
      } else if (cuenta.length === 0) {
        onFiltrar('', '', '');  // Limpiar filtros
      }
    }
  };

  const handleFechaInicioChange = (e) => {
    const fecha = e.target.value;
    setFechaInicio(fecha);
    onFiltrar(localCuenta, fecha, fechaFin); // Actualizar filtros de fechas
  };

  const handleFechaFinChange = (e) => {
    const fecha = e.target.value;
    setFechaFin(fecha);
    onFiltrar(localCuenta, fechaInicio, fecha); // Actualizar filtros de fechas
  };

  return (
    <Box mb={2} display="flex" flexDirection="column" sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2, boxShadow: 1 }}>
      <FormControlLabel
        control={
          <Android12Switch 
            checked={isFilterEnabled}
            onChange={handleSwitchChange} 
          />
        }
        label={isFilterEnabled ? "Filtro Activado" : "Filtro Desactivado"}
      />
      
      {isFilterEnabled && (
        <Box component="form" display="flex" mb={2} mt={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Número de Cuenta"
                variant="outlined"
                value={localCuenta}
                onChange={handleInputChange}
                required
                inputProps={{ maxLength: 10 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Fecha de Inicio"
                type="date"
                variant="outlined"
                value={fechaInicio}
                onChange={handleFechaInicioChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Fecha de Fin"
                type="date"
                variant="outlined"
                value={fechaFin}
                onChange={handleFechaFinChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default FiltrarTransferencias;