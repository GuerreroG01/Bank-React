import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/Cuenta`;

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

const getCuentas = () => {
  return axios.get(API_URL);
};

const getCuentaById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const deleteCuenta = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

const updateCuenta = async (id, cuentaData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, cuentaData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Cuenta actualizada:', response.data);
    return response;
  } catch (error) {
    console.error('Error actualizando cuenta:', error);
    throw error;
  }
};

const createCuenta = async (cuentaData) => {
  try {
    const response = await axios.post(API_URL, cuentaData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Cuenta creada:', response.data);
    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error('Error creando cuenta:', error.response.data.errors || error.response.data);
    } else {
      console.error('Error creando cuenta:', error.message);
    }
    throw error;
  }
};

const CuentaService = {
  getCuentas,
  getCuentaById,
  deleteCuenta,
  updateCuenta,
  createCuenta,
};

export default CuentaService;

