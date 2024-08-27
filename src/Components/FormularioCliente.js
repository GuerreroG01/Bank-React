import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClienteService from '../Services/ClienteService';
import { Box, Typography, Button, FormControl, TextField, FormGroup, FormControlLabel, Checkbox, Alert, AlertTitle } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const FormularioCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState({
    nombre: '',
    telefono: '',
    nacimiento: '',
    foto: null,
  });
  const [fileName, setFileName] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [mensajeError, setMensajeError] = useState('');
  const [exitocreacion, setExitocreacion] = useState('');

  useEffect(() => {
    if (id) {
      ClienteService.getClienteById(id)
        .then(response => {
          setCliente(response.data);
          if (response.data.foto) {
            const API_URL = 'http://localhost:5011';
            setImagePreview(`${API_URL}/images/${response.data.foto}`);
          }
        })
        .catch(error => {
          console.error('Error fetching client:', error);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCliente(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCliente(prevState => ({
      ...prevState,
      foto: file
    }));
    setFileName(file ? file.name : '');
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!cliente.nombre || !cliente.telefono || !cliente.nacimiento) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }
  
    const formData = new FormData();
formData.append('nombre', cliente.nombre);
formData.append('telefono', cliente.telefono);
formData.append('nacimiento', cliente.nacimiento);
if (cliente.foto) {
  formData.append('foto', cliente.foto);
}

  
    try {
      if (id) {
        await ClienteService.updateCliente(id, formData);
        setExitocreacion('Cliente actualizado exitosamente');
      } else {
        await ClienteService.createCliente(formData);
        setExitocreacion('Cliente creado exitosamente');
      }
  
      setTimeout(() => {
        navigate('/clientes');
      }, 1500);
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      setMensajeError('Error al guardar cliente. Inténtalo de nuevo.');
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
        {id ? 'Actualizar Cliente' : 'Crear Cliente'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormControl margin="normal" fullWidth>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              component="label"
              color="primary"
              startIcon={<CameraAltIcon />}
              style={{ marginTop: '8px', textTransform: 'none', display: 'flex', alignItems: 'center' }}
            >
              {fileName || 'Seleccionar Foto'}
              <input
                type="file"
                hidden
                id="file-upload"
                onChange={handleFileChange}
              />
            </Button>
            {imagePreview && (
              <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                <img src={imagePreview} alt="Preview" style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }} />
              </Box>
            )}
          </FormControl>
          <FormControl margin="normal" fullWidth>
            <TextField
              label="Nombre Completo"
              name="nombre"
              value={cliente.nombre}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </FormControl>
          <FormControl margin="normal" fullWidth>
            <TextField
              label="Teléfono"
              name="telefono"
              value={cliente.telefono}
              onChange={handleChange}
              variant="outlined"
              required
              type="number"
            />
          </FormControl>
          <FormControl margin="normal" fullWidth>
            <TextField
              label="Fecha de Nacimiento"
              name="nacimiento"
              type="date"
              value={cliente.nacimiento ? new Date(cliente.nacimiento).toISOString().split('T')[0] : ''}
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
            {id ? 'Actualizar Cliente' : 'Crear Cliente'}
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

export default FormularioCliente;
