import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TarjetaService from '../Services/TarjetaService';
import { Box, Typography, Button, FormControl, TextField, FormGroup, Alert, AlertTitle, Select, MenuItem, InputLabel, ListItemIcon, ListItemText } from '@mui/material';
import { FaCcMastercard } from "react-icons/fa";
import { FaCcAmex } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa";

const FormularioTarjeta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tarjeta, setTarjeta] = useState({
    tipo_tarjeta: '',
    marca_tarjeta: '',
    no_tarjeta: '',
    no_cuenta: '',
    fecha_vencimiento: '',
    codigo_seguridad: '',
    limite_credito: '',
  });


  const [mensajeError, setMensajeError] = useState('');
  const [exitocreacion, setExitocreacion] = useState('');

  useEffect(() => {
    if (id) {
      TarjetaService.getTarjetasById(id)
        .then(response => {
          setTarjeta(response.data);
        })
        .catch(error => {
          console.error('Error fetching card:', error);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTarjeta(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tarjeta.tipo_tarjeta || !tarjeta.marca_tarjeta || !tarjeta.no_tarjeta || !tarjeta.no_cuenta || !tarjeta.codigo_seguridad || !tarjeta.fecha_vencimiento || !tarjeta.limite_credito ) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    try {
      if (id) {
        await TarjetaService.updateTarjeta(id, tarjeta);
        setExitocreacion('Tarjeta actualizada exitosamente');
      } else {
        await TarjetaService.createTarjeta(tarjeta);
        setExitocreacion('Tarjeta creada exitosamente');
      }

      setTimeout(() => {
        setExitocreacion('');
        navigate('/tarjetas');
      }, 2000);

    } catch (error) {
      console.error('Error al guardar tarjeta:', error);
      setMensajeError('Hubo un error al guardar la tarjeta. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: 'auto',
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: '#fff',
        position: 'relative'
      }}
    >
      <Typography variant="h5" gutterBottom>
        {id ? 'Actualizar tarjeta' : 'Crear tarjeta'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormGroup>

          <FormControl sx={{ width: '50%' }} margin="normal">
            <InputLabel id="tipo_tarjeta">Tipo de tarjeta</InputLabel>
            <Select
              labelId="tipo_tarjeta"
              id="tipo_tarjeta_select"
              value={tarjeta.tipo_tarjeta || ''}
              name="tipo_tarjeta"
              label="Tipo de tarjeta"
              onChange={handleChange}
              required
            >
                <MenuItem value=""><em>Seleccione un tipo</em></MenuItem>
                <MenuItem value={'Crédito'}>Crédito</MenuItem>
                <MenuItem value={'Débito'}>Débito</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ width: '50%' }} margin="normal">
            <InputLabel id="marca_tarjeta">Marca de la tarjeta</InputLabel>
            <Select
              labelId="marca_tarjeta"
              id="marca_tarjeta_select"
              value={tarjeta.marca_tarjeta || ''}
              name="marca_tarjeta"
              label="Marca de la tarjeta"
              onChange={handleChange}
              required
            >
              <MenuItem value=""><em>Seleccione una marca:</em></MenuItem>

              <MenuItem value={'mastercard'}>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                  <ListItemText primary="MasterCard" />
                  <ListItemIcon>
                    <FaCcMastercard />
                  </ListItemIcon>
                </Box>
              </MenuItem>

              <MenuItem value={'visa'}>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                  <ListItemText primary="VISA" />
                  <ListItemIcon>
                    <FaCcVisa />
                  </ListItemIcon>
                </Box>
              </MenuItem>

              <MenuItem value={'amex'}>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                  <ListItemText primary="American Express" />
                  <ListItemIcon>
                    <FaCcAmex />
                  </ListItemIcon>
                </Box>
              </MenuItem>

            </Select>
          </FormControl>

          <FormControl  margin="normal" fullWidth>
            <TextField
              label="No. tarjeta"
              name="no_tarjeta"
              value={tarjeta.no_tarjeta}
              onChange={handleChange}
              variant="outlined"
              required
              type="text"
            />
          </FormControl>

          <FormControl margin="normal" fullWidth>
            <TextField
              label="No. cuenta"
              name="no_cuenta"
              value={tarjeta.no_cuenta}
              onChange={handleChange}
              variant="outlined"
              required
              type="text"
            />
          </FormControl>

          <FormControl margin="normal" fullWidth>
            <TextField
              label="Código de seguridad"
              name="codigo_seguridad"
              value={tarjeta.codigo_seguridad}
              onChange={handleChange}
              variant="outlined"
              required
              type="number"
            />
          </FormControl>

          <FormControl margin="normal" fullWidth>
            <TextField
              label="Límite de crédito"
              name="limite_credito"
              value={tarjeta.limite_credito}
              onChange={handleChange}
              variant="outlined"
              required
              type="number"
            />
          </FormControl>


          <FormControl margin="normal" fullWidth>
            <TextField
              label="Fecha de vencimiento"
              name="fecha_vencimiento"
              type="date"
              value={tarjeta.fecha_vencimiento ? new Date(tarjeta.fecha_vencimiento).toISOString().split('T')[0] : ''}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>


          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: 16 }}
          >
            {id ? 'Actualizar Tarjeta' : 'Crear Tarjeta'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            style={{ marginTop: 16 }}
            onClick={() => navigate(-1)}
          >
            Atrás
          </Button>
        </FormGroup>
      </form>
      {exitocreacion && (
        <Alert severity="success" sx={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
          <AlertTitle>Operación Exitosa</AlertTitle>
          {exitocreacion}
        </Alert>
      )}
      {mensajeError && (
        <Alert severity="error" sx={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
          <AlertTitle>Error</AlertTitle>
          {mensajeError}
        </Alert>
      )}
    </Box>
  );
};

export default FormularioTarjeta;
