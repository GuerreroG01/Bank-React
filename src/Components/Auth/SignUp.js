// src/components/Register.js
import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthService from "../../Services/AuthService";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Las contraseñas no coinciden" });
      return;
    }
    else if (!password) {
      setErrors({ ...errors, password: "La contraseña es obligatoria" });
      return;
    }
    else if (!email) {
      setErrors({ ...errors, email: "El email es obligatorio" });
      return;
    }

    await AuthService.register(email, password)
    .then(response => {
      setSuccessMessage("Usuario creado exitosamente");
      setTimeout(() => {
        navigate('/auth/iniciar_sesion');
      }, 2000);
    })
    .catch(error => {
      console.error('Error creando usuario:', error);
      setErrors({ summary: "Error al crear usuario" });
    });

  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Registrarse
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 1 }}
        display={"flex"}
        flexDirection={"column"}
      >
        <Typography variant="h6" component="h2">
          Crear una nueva cuenta
        </Typography>
        <hr />
        {errors.summary && <Alert severity="error">{errors.summary}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        <TextField
          margin="normal"
          required
          id="email"
          label="Correo Electrónico"
          name="email"
          autoComplete="username"
          autoFocus
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          sx={{ width: "50%" }}
        />
        <TextField
          margin="normal"
          required
          name="password"
          label="Contraseña"
          type="password"
          id="password"
          autoComplete="new-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          sx={{ width: "50%" }}
        />
        <TextField
          margin="normal"
          required
          name="confirmPassword"
          label="Confirmar Contraseña"
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          sx={{ width: "50%" }}
        />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={"50%"}
          mt={2}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            // sx={{ width: "20%" }}
          >
            Registrarse
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
