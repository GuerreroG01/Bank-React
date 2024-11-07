import React, { useState, useEffect } from 'react';
import {
  Box, FormControlLabel, Grid, TextField, Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import AccountCircle from '@mui/icons-material/AccountCircle';

const TarjetaFilter = ({ nombreCliente, setNombreCliente, fechaInicio, setFechaInicio, fechaFin, setFechaFin }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [tempNombreCliente, setTempNombreCliente] = useState(nombreCliente);
  const [tempFechaInicio, setTempFechaInicio] = useState(fechaInicio);
  const [tempFechaFin, setTempFechaFin] = useState(fechaFin);

  useEffect(() => {
    if (!showFilters) {
      setTempNombreCliente(nombreCliente);
      setTempFechaInicio(fechaInicio);
      setTempFechaFin(fechaFin);
    }
  }, [showFilters, nombreCliente, fechaInicio, fechaFin]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nombreCliente") {
      setTempNombreCliente(value);
      setNombreCliente(value);
    } else if (name === "fechaInicio") {
      setTempFechaInicio(value);
      setFechaInicio(value);
    } else if (name === "fechaFin") {
      setTempFechaFin(value);
      setFechaFin(value);
    }
  };

  const handleSwitchChange = (e) => {
    const isChecked = e.target.checked;
    setShowFilters(isChecked);

    if (!isChecked) {
      setNombreCliente('');
      setFechaInicio('');
      setFechaFin('');
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
    <Box mb={2} display="flex" flexDirection="column" sx={showFilters ? { p: 2, bgcolor: "#f5f5f5", borderRadius: 2, boxShadow: 1 } : {}}>
      <FormControlLabel
        control={<Android12Switch checked={showFilters} onChange={handleSwitchChange} />}
        label={showFilters ? "Filtro Activado" : "Filtro Desactivado"}
      />
      {showFilters && (
        <Grid container spacing={2} mt={2} alignItems="flex-end">
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField
                label="Nombre del Cliente"
                name="nombreCliente"
                variant="standard"
                value={tempNombreCliente}
                onChange={handleChange}
                fullWidth
                sx={{ backgroundColor: '#ffffff' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <TextField
              label="Rango Inicial"
              name="fechaInicio"
              type="date"
              value={tempFechaInicio ? new Date(tempFechaInicio).toISOString().split("T")[0] : ''}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ backgroundColor: '#ffffff' }}
            />
          </Grid>
          <Grid item xs={12} sm={3} md={2} container justifyContent="center" alignItems="center">
            <Typography variant="h6" align="center" sx={{ mt: -1 }}>
              Vencimiento de Tarjetas
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <TextField
              label="Rango Final"
              name="fechaFin"
              type="date"
              value={tempFechaFin ? new Date(tempFechaFin).toISOString().split("T")[0] : ''}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ backgroundColor: '#ffffff' }}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default TarjetaFilter;