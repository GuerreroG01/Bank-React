import React, { useState, useEffect } from 'react';
import {
  Box, TextField, MenuItem, FormControlLabel, Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

const FiltroCuentas = ({ filters, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    if (!showFilters) {
      setTempFilters(filters);
    }
  }, [showFilters, filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...tempFilters, [name]: value };
    setTempFilters(newFilters);

    if (showFilters) {
      onFilterChange(newFilters);
    }
  };

  const handleSwitchChange = (e) => {
    const isChecked = e.target.checked;
    setShowFilters(isChecked);

    if (!isChecked) {
      onFilterChange({ moneda: '', tipo: '', minSaldo: '', maxSaldo: '' });
    } else {
      onFilterChange(tempFilters);
    }
  };

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

  return (
    <Box mb={2} 
         display="flex" 
         flexDirection="column" 
         sx={showFilters ? { p: 2, bgcolor: "#f5f5f5", borderRadius: 2, boxShadow: 1 } : {}}
    >
      <FormControlLabel
        control={<Android12Switch checked={showFilters} onChange={handleSwitchChange} />}
        label={showFilters ? "Filtro Activado" : "Filtro Desactivado"}
      />
      {showFilters && (
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Tipo de Moneda"
              name="moneda"
              value={tempFilters.moneda}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              sx={{ backgroundColor: showFilters ? '#ffffff' : 'transparent' }}
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="NIO">Córdobas</MenuItem>
              <MenuItem value="USD">Dólares</MenuItem>
              <MenuItem value="EUR">Euros</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Tipo de Cuenta"
              name="tipo"
              value={tempFilters.tipo}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              sx={{ backgroundColor: showFilters ? '#ffffff' : 'transparent' }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Saldo Mínimo"
              type="number"
              name="minSaldo"
              value={tempFilters.minSaldo}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              sx={{ backgroundColor: showFilters ? '#ffffff' : 'transparent' }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Saldo Máximo"
              type="number"
              name="maxSaldo"
              value={tempFilters.maxSaldo}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              sx={{ backgroundColor: showFilters ? '#ffffff' : 'transparent' }}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default FiltroCuentas;