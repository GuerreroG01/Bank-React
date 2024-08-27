import axios from 'axios';

const API_URL = 'http://localhost:5011/api/clientes';

const getClientes = () => {
  return axios.get(API_URL);
};

const getClienteById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const deleteCliente = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

const updateCliente = (id, cliente, foto) => {
  const formData = new FormData();
  formData.append('nombre', cliente.nombre);
  formData.append('telefono', cliente.telefono);
  formData.append('nacimiento', cliente.nacimiento);
  if (foto) {
    formData.append('foto', foto);
  }

  return axios.put(`${API_URL}/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  .then(response => response.data)
  .catch(error => {
    console.error('Error updating client:', error);
    throw error;
  });
};

const createCliente = (cliente, foto) => {
  const formData = new FormData();
  formData.append('nombre', cliente.nombre);
  formData.append('telefono', cliente.telefono);
  formData.append('nacimiento', cliente.nacimiento);
  if (foto) {
    formData.append('foto', foto);
  }

  return axios.post(API_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  .then(response => response.data)
  .catch(error => {
    console.error('Error creating client:', error);
    throw error;
  });
};

export default {
  getClientes,
  getClienteById,
  deleteCliente,
  updateCliente,
  createCliente,
};
