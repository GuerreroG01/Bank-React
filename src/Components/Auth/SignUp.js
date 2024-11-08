import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Avatar,
  Grid,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Las contraseñas no coinciden" });
      return;
    } else if (!password) {
      setErrors({ ...errors, password: "La contraseña es obligatoria" });
      return;
    } else if (!email) {
      setErrors({ ...errors, email: "El email es obligatorio" });
      return;
    }

    await AuthService.register(email, password)
      .then((response) => {
        setSuccessMessage("Usuario creado exitosamente");
        setTimeout(() => {
          navigate("/auth/iniciar_sesion");
        }, 2000);
      })
      .catch((error) => {
        console.error("Error creando usuario:", error);
        setErrors({ summary: "Error al crear usuario" });
      });
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem",
        backgroundColor: "#f4f7fc",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Avatar
        alt="Logo Banco"
        src="/Bank.png"
        sx={{
          width: 80,
          height: 80,
          mb: 2,
          borderRadius: "50%",
          border: "4px solid #3f51b5",
        }}
      />
      <Typography variant="h5" component="h1" gutterBottom sx={{ color: "#3f51b5" }}>
        Registrarse
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {errors.summary && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {errors.summary}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Grid container spacing={2} direction="column" sx={{ width: "100%" }}>
          <Grid item>
            <TextField
              required
              id="email"
              label="Correo Electrónico"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />
          </Grid>

          <Grid item>
            <TextField
              required
              id="password"
              label="Contraseña"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />
          </Grid>

          <Grid item>
            <TextField
              required
              id="confirmPassword"
              label="Confirmar Contraseña"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />
          </Grid>

          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                marginTop: 2,
                padding: "10px",
                fontWeight: "bold",
                borderRadius: "25px",
                backgroundColor: "#3f51b5",
                '&:hover': {
                  backgroundColor: "#303f9f",
                },
              }}
            >
              Registrarse
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SignUp;