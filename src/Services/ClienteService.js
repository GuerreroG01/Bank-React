import axios from 'axios';

const API_URL = 'http://localhost:5011/api/Clientes';

const getClientes = () => {
  return axios.get(API_URL);
};

const getClienteById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const deleteCliente = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

const updateCliente = async (id, clienteData) => {
  try {
      const response = await axios.put(`${API_URL}/${id}`, clienteData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      console.log('Cliente actualizado:', response.data);
      return response;
  } catch (error) {
      console.error('Error actualizando cliente:', error);
      throw error;
  }
};

const createCliente = async (clienteData) => {
  try {
      const response = await axios.post(API_URL, clienteData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      console.log('Cliente creado:', response.data);
      return response;
  } catch (error) {
      console.error('Error creando cliente:', error);
      throw error;
  }
};

export default {
  getClientes,
  getClienteById,
  deleteCliente,
  updateCliente,
  createCliente,
};
