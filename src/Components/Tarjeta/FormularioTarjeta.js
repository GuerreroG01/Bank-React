import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TarjetaService from "../../Services/TarjetaService";
import CuentaService from "../../Services/CuentaService";
import ClienteService from '../../Services/ClienteService';
import {
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  FormGroup,
  Alert,
  AlertTitle,
  Select,
  MenuItem,
  InputLabel,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FaCcMastercard } from "react-icons/fa";
import { FaCcAmex } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa";

const FormularioTarjeta = () => {
  const { id } = useParams();
  const [clientes, setClientes] = useState([]);
  const navigate = useNavigate();
  const [tarjeta, setTarjeta] = useState({
    tipo_Tarjeta: "",
    marca_Tarjeta: "",
    no_Tarjeta: "",
    no_Cuenta: "",
    vencimiento: "",
    codigo_Seguridad: "",
    limite_Credito: "",
  });

  const [cuentas, setCuenta] = useState([]);
  const [mensajeError, setMensajeError] = useState("");
  const [exitocreacion, setExitocreacion] = useState("");
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  const generarNumeroTarjeta = () => {
    let numero = "";
    for (let i = 0; i < 16; i++) {
      numero += Math.floor(Math.random() * 10).toString();
    }
    return numero;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesResponse = await ClienteService.getClientes();
        setClientes(clientesResponse.data);
        const cuentasResponse = await CuentaService.getCuentas();
        setCuenta(cuentasResponse.data);
        if (id) {
          const response = await TarjetaService.getTarjetasById(id);
          setTarjeta(prev => ({
            ...response.data,
            no_Cuenta: response.data.no_Cuenta || "",
          }));
        } else {
          setTarjeta({
            tipo_Tarjeta: "",
            marca_Tarjeta: "",
            no_Tarjeta: generarNumeroTarjeta(),
            no_Cuenta: "",
            vencimiento: "",
            codigo_Seguridad: "",
            limite_Credito: "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setTarjeta(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (
      !tarjeta.tipo_Tarjeta ||
      !tarjeta.marca_Tarjeta ||
      !tarjeta.no_Cuenta ||
      !tarjeta.codigo_Seguridad ||
      !tarjeta.vencimiento ||
      !tarjeta.limite_Credito
    ) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    if (!id && !tarjeta.no_Tarjeta) {
      tarjeta.no_Tarjeta = generarNumeroTarjeta();
    }

    try {
      if (id) {
        await TarjetaService.updateTarjeta(id, tarjeta);
        setExitocreacion("Tarjeta actualizada exitosamente");
      } else {
        await TarjetaService.createTarjeta(tarjeta);
        setExitocreacion("Tarjeta creada exitosamente");
      }
      setMostrarAlerta(true);
      setTimeout(() => {
        setMostrarAlerta(false);
        navigate('/tarjetas');
      }, 1500);
    } catch (error) {
      console.error("Error al guardar tarjeta:", error);
      setMensajeError("Hubo un error al guardar la tarjeta. Por favor, inténtalo de nuevo.");
      setMostrarAlerta(true);
      setTimeout(() => {
        setMostrarAlerta(false);
      }, 1500);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
        position: "relative",
      }}
    >
      <Typography variant="h5" gutterBottom>
        {id ? "Actualizar tarjeta" : "Crear tarjeta"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormControl margin="normal" fullWidth>
            <TextField
              label="No. tarjeta"
              name="no_tarjeta"
              value={tarjeta.no_Tarjeta}
              onChange={handleChange}
              variant="outlined"
              required
              type="text"
              disabled
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="cliente-label">Cliente</InputLabel>
            <Select
                labelId="cliente-label"
                id="cliente-select"
                name="no_Cuenta"
                value={tarjeta.no_Cuenta || ""}
                onChange={handleChange}
                required
                label="Cliente"
            >
                {clientes.length === 0 ? (
                    <MenuItem disabled>No hay clientes disponibles</MenuItem>
                ) : (
                    clientes.map(cliente => (
                        <MenuItem key={cliente.id} value={cliente.cuentas.length > 0 ? cliente.cuentas[0].no_Cuenta : ''}>
                            {cliente.cuentas.length > 0 ? cliente.nombre : `${cliente.nombre} (Sin cuentas)`}
                        </MenuItem>
                    ))
                )}
            </Select>
            {clientes.length === 0 && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    No hay clientes disponibles para seleccionar.
                </Typography>
            )}
        </FormControl>
          <FormControl sx={{ width: "50%" }} margin="normal">
            <InputLabel id="tipo_tarjeta">Tipo de tarjeta</InputLabel>
            <Select
              labelId="tipo_tarjeta"
              id="tipo_tarjeta_select"
              value={tarjeta.tipo_Tarjeta || ""}
              name="tipo_Tarjeta"
              label="Tipo de tarjeta"
              onChange={handleChange}
              required
            >
              <MenuItem value="">
                <em>Seleccione un tipo</em>
              </MenuItem>
              <MenuItem value={"Crédito"}>Crédito</MenuItem>
              <MenuItem value={"Débito"}>Débito</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: "50%" }} margin="normal">
            <InputLabel id="marca_Tarjeta">Marca de la tarjeta</InputLabel>
            <Select
              labelId="marca_Tarjeta"
              id="marca_tarjeta_select"
              value={tarjeta.marca_Tarjeta || ""}
              name="marca_Tarjeta"
              label="Marca de la tarjeta"
              onChange={handleChange}
              required
            >
              <MenuItem value="">
                <em>Seleccione una marca:</em>
              </MenuItem>
              <MenuItem value={"mastercard"}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <ListItemText primary="MasterCard" />
                  <ListItemIcon>
                    <FaCcMastercard />
                  </ListItemIcon>
                </Box>
              </MenuItem>
              <MenuItem value={"visa"}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <ListItemText primary="VISA" />
                  <ListItemIcon>
                    <FaCcVisa />
                  </ListItemIcon>
                </Box>
              </MenuItem>
              <MenuItem value={"amex"}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <ListItemText primary="American Express" />
                  <ListItemIcon>
                    <FaCcAmex />
                  </ListItemIcon>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl margin="normal" fullWidth>
            <TextField
              label="Código de seguridad"
              name="codigo_Seguridad"
              value={tarjeta.codigo_Seguridad}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </FormControl>
          <FormControl margin="normal" fullWidth>
            <TextField
              label="Límite de crédito"
              name="limite_Credito"
              value={tarjeta.limite_Credito}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </FormControl>
          <FormControl margin="normal" fullWidth>
            <TextField
              label="Fecha de vencimiento"
              name="vencimiento"
              type="date"
              value={
                tarjeta.vencimiento
                  ? new Date(tarjeta.vencimiento).toISOString().split("T")[0]
                  : ""
              }
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
            {id ? "Actualizar Tarjeta" : "Crear Tarjeta"}
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
      {mostrarAlerta && exitocreacion && (
        <Alert
          severity="success"
          sx={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
        >
          <AlertTitle>Operación Exitosa</AlertTitle>
          {exitocreacion}
        </Alert>
      )}
      {mostrarAlerta && mensajeError && (
        <Alert
          severity="error"
          sx={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
        >
          <AlertTitle>Error</AlertTitle>
          {mensajeError}
        </Alert>
      )}
    </Box>
  );
};
export default FormularioTarjeta;