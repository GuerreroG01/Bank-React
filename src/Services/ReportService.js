import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/Report`;

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

const exportarClientes = async () => {
  try {
    const response = await axios.get(`${API_URL}/clientes/exportar-excel`, {
      responseType: 'blob',
    });

    const fechaActual = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const nombreArchivo = `ReporteGeneral_${fechaActual}.xlsx`;

    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nombreArchivo;
    link.click();
  } catch (error) {
    console.error('Error exportando clientes:', error);
    throw error;
  }
};

const ReportService = {
  exportarClientes,
};

export default ReportService;
