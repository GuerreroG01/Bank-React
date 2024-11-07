import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import AuthService from "../../Services/AuthService";

const Login = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    if (!email) {
      setErrors({ ...errors, email: "El email es obligatorio" });
      return;
    } else if (!password) {
      setErrors({ ...errors, password: "La contraseña es obligatoria" });
      return;
    }

    try {
      const response = await AuthService.login(email, password);
      console.log('Inicio de sesión exitoso:', response.data);

      localStorage.setItem("token", response.data.token);

      setSuccessMessage("Inicio de sesión exitoso");
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Error iniciando sesión:', error);
      setErrors({ summary: "Error al iniciar sesión" });
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Iniciar Sesión
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
          Iniciar sesión en tu cuenta
        </Typography>
        <hr />
        {token === 'no_token' && (
          <Alert severity="error">Debes iniciar sesión para acceder a esa página</Alert>
        )}
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
          onChange={(e) => setEmail(e.target.value)}
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
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
            //sx={{ width: "20%" }}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;