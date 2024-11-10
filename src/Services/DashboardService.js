import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/Dashboard`;

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

const getDashboardStats = () => {
  return axios.get(API_URL);
};
const getSaldoPorMoneda = () => {
  return axios.get(`${API_URL}/saldo-por-moneda`);
};

const getTransferenciasPorMoneda = () => {
  return axios.get(`${API_URL}/transferencias-por-moneda`);
};

const DashboardService = {
  getDashboardStats,
  getSaldoPorMoneda,
  getTransferenciasPorMoneda
};

export default DashboardService;