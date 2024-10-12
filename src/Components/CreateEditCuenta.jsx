import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, IconButton, MenuItem, Select, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import CuentaService from '../Services/CuentaService'; // Servicio de cuentas

const CreateEditCuenta = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [cuenta, setCuenta] = useState({
        no_Cuenta: '',
        tipo: '',
        saldo: '',
        clienteId: ''
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (id) {
            // Cargar datos de la cuenta si es edición
            CuentaService.getCuentaById(id)
                .then(response => setCuenta(response.data))
                .catch(error => {
                    console.error('Error cargando la cuenta:', error);
                    mostrarNotificacion('Error al cargar la cuenta', 'error');
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCuenta({ ...cuenta, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                // Actualizar cuenta
                await CuentaService.updateCuenta(id, cuenta);
                mostrarNotificacion('Cuenta actualizada exitosamente.', 'success');
            } else {
                // Crear nueva cuenta
                await CuentaService.createCuenta(cuenta);
                mostrarNotificacion('Cuenta creada exitosamente.', 'success');
            }
            navigate('/cuentas'); // Redirigir después de la acción
        } catch (error) {
            console.error('Error al guardar la cuenta:', error);
            mostrarNotificacion('Error al guardar la cuenta. Por favor, inténtelo de nuevo.', 'error');
        }
    };

    const mostrarNotificacion = (mensaje, tipo) => {
        setSnackbarMessage(mensaje);
        setSnackbarSeverity(tipo);
        setOpenSnackbar(true);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    padding: 4,
                    borderRadius: '16px',
                    boxShadow: 3,
                    marginTop: 4,
                    backgroundColor: '#fff',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    {id ? 'Editar Cuenta' : 'Crear Nueva Cuenta'}
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="No. Cuenta"
                        name="no_Cuenta"
                        value={cuenta.no_Cuenta}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        disabled={!!id}
                        InputProps={{ style: { borderRadius: '10px' } }} // Bordes redondeados
                    />

                    {/* Campo Tipo como Select */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="tipo-label">Tipo</InputLabel>
                        <Select
                            labelId="tipo-label"
                            name="tipo"
                            value={cuenta.tipo}
                            onChange={handleChange}
                            fullWidth
                            InputProps={{ style: { borderRadius: '10px' } }} // Bordes redondeados
                        >
                            <MenuItem value="corriente">Corriente</MenuItem>
                            <MenuItem value="ahorro">Ahorro</MenuItem>
                            <MenuItem value="nomina">Nómina</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Saldo"
                        name="saldo"
                        type="number"
                        value={cuenta.saldo}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputProps={{ style: { borderRadius: '10px' } }} // Bordes redondeados
                    />
                    <TextField
                        label="ID Cliente"
                        name="clienteId"
                        type="number"
                        value={cuenta.clienteId}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputProps={{ style: { borderRadius: '10px' } }} // Bordes redondeados
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        sx={{
                            marginTop: 2,
                            padding: '12px',
                            borderRadius: '10px',
                            backgroundColor: '#007bff', // Color azul como en la imagen
                            '&:hover': {
                                backgroundColor: '#0056b3',
                            },
                        }}
                    >
                        {id ? 'Actualizar Cuenta' : 'Crear Cuenta'}
                    </Button>
                </Box>

                <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    sx={{
                        marginTop: 2,
                        padding: '12px',
                        borderRadius: '10px',
                        color: '#6c757d',
                        borderColor: '#6c757d', // Color de borde gris
                        '&:hover': {
                            backgroundColor: '#f8f9fa',
                            borderColor: '#6c757d',
                        },
                    }}
                    onClick={() => navigate('/cuentas')} // Redirigir a la lista de cuentas
                >
                    ATRÁS
                </Button>
            </Box>

            {/* Snackbar para notificaciones */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CreateEditCuenta;
