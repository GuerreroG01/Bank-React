import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/Transferencia`;

const getTransferencias = () => {
  return axios.get(API_URL);
};

const getTransferenciaById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};


const createTransferencia = async (transferenciaData) => {
  try {
      const response = await axios.post(API_URL, transferenciaData, {
          headers: {
              'Content-Type': 'application/json',
          },
      });
      return response;
  } catch (error) {
      if (error.response && error.response.data) {
          console.error('Error creando transferencia:', error.response.data.errors || error.response.data);
          throw new Error(error.response.data.errors ? error.response.data.errors : 'Error desconocido');
      } else {
          console.error('Error creando transferencia:', error.message);
          throw new Error('Error de conexión o servidor');
      }
  }
};

const TransferenciaService = {
  getTransferencias,
  getTransferenciaById,
  createTransferencia,
};

export default TransferenciaService;
