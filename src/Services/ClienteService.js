import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/Clientes`;

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.status === 401) {
    window.location.href = '/auth/iniciar_sesion/no_token';
  }
  return Promise.reject(error);
});

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

const createCliente = async (cliente, foto) => {
  const formData = new FormData();
  formData.append('nombre', cliente.nombre);
  formData.append('telefono', cliente.telefono);
  formData.append('nacimiento', cliente.nacimiento);
  formData.append('email', cliente.email);
  if (foto) {
      formData.append('foto', foto);
  }

  try {
      const response = await axios.post(API_URL, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      console.log('Cliente creado:', response.data);
      return response.data;
  } catch (error) {
      console.error('Error creando cliente:', error);
      throw error;
  }
};

const ClienteService = {
  getClientes,
  getClienteById,
  deleteCliente,
  updateCliente,
  createCliente
};

export default ClienteService;