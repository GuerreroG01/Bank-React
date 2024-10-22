import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/Tarjeta`;

const getTarjetas = () => {
  return axios.get(API_URL);
};

const getTarjetasById = id => {
  return axios.get(`${API_URL}/${id}`);
};

const deleteTarjeta = id => {
  return axios.delete(`${API_URL}/${id}`);
};

const updateTarjeta = async (id, tarjetaData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, tarjetaData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Tarjeta actualizada:", response.data);
    return response;
  } catch (error) {
    console.error("Error actualizando tarjeta:", error);
    throw error;
  }
};

const createTarjeta = async tarjetaData => {
  console.log("tarjetaData", tarjetaData);
  try {
    const response = await axios.post(API_URL, tarjetaData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Tarjeta creada:", response.data);
    return response;
  } catch (error) {
    console.error("Error creando tarjeta:", error);
    throw error;
  }
};

const TarjetaService = {
  getTarjetas,
  getTarjetasById,
  deleteTarjeta,
  updateTarjeta,
  createTarjeta,
};
export default TarjetaService;
