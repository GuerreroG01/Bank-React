import axios from 'axios';

const API_URL = 'http://localhost:5011/api/Cuentas'; // Cambia la URL si es necesario

// Obtener todas las cuentas
const getCuentas = () => {
  return axios.get(API_URL);
};

// Obtener una cuenta por ID
const getCuentaById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

// Eliminar una cuenta por ID
const deleteCuenta = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

// Actualizar una cuenta
const updateCuenta = async (id, cuentaData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, cuentaData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Cuenta actualizada:', response.data);
    return response;
  } catch (error) {
    console.error('Error actualizando cuenta:', error);
    throw error;
  }
};

// Crear una nueva cuenta
const createCuenta = async (cuentaData) => {
  try {
    const response = await axios.post(API_URL, cuentaData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Cuenta creada:', response.data);
    return response;
  } catch (error) {
    console.error('Error creando cuenta:', error);
    throw error;
  }
};

export default {
  getCuentas,
  getCuentaById,
  deleteCuenta,
  updateCuenta,
  createCuenta,
};
