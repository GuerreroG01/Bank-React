import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  useTheme,
  useMediaQuery,
  Grid,
  Avatar,
  CircularProgress,
  IconButton,
  InputAdornment
} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import AuthService from "../../Services/AuthService";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    setLoading(true);

    if (!email) {
      setErrors({ ...errors, email: "El email es obligatorio" });
      setLoading(false);
      return;
    } else if (!password) {
      setErrors({ ...errors, password: "La contraseña es obligatoria" });
      setLoading(false);
      return;
    }

    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem("token", response.data.token);
      setSuccessMessage("Inicio de sesión exitoso");
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1500);
    } catch (error) {
      setAlertMessage("Error al iniciar sesión");
      setAlertSeverity("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: 4,
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
      }}>
        <Box sx={{ mb: 3 }}>
          <Avatar
            alt="Logo Banco"
            src="/Bank.png"
            sx={{ width: 100, height: 100, mb: 2, borderRadius: 2, ml: 4 }}
          />
          <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
            BancoNet
          </Typography>
        </Box>
        <Typography variant="h6" component="h2" color="textSecondary" sx={{ mb: 3 }}>
          Iniciar sesión en tu cuenta
        </Typography>
        
        {token === "no_token" && (
          <Alert severity="info" sx={{ width: "100%", mb: 2 }}>
            Debes iniciar sesión para acceder a esa página
          </Alert>
        )}
        
        {alertMessage && (
          <Alert severity={alertSeverity} sx={{ width: "100%", mb: 2 }}>
            {alertMessage}
          </Alert>
        )}
        
        {successMessage && (
          <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
          <TextField
            margin="normal"
            required
            id="email"
            label="Correo Electrónico"
            name="email"
            autoComplete="username"
            autoFocus
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="normal"
            required
            name="password"
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            sx={{ mb: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              padding: isSmallScreen ? "10px" : "12px",
              fontSize: isSmallScreen ? "14px" : "16px",
              mb: 2,
              borderRadius: 2
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Iniciar Sesión"}
          </Button>
        </Box>
        
        <Grid container justifyContent="center">
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              ¿No tienes una cuenta? <a href="/auth/registrarse">Regístrate aquí</a>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};
export default Login;