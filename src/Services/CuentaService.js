import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/Cuenta`;

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
const modificarSaldo = async (noCuenta, monto) => {
  const saldoDto = {
    NoCuenta: Number(noCuenta),
    Monto: Math.floor(parseFloat(monto)),
  };
  console.log('Saldo DTO a enviar:', saldoDto);
  try {
    const response = await axios.put(`${API_URL}/ModificarSaldo`, saldoDto, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Saldo modificado:', response.data);
    return response;
  } catch (error) {
    console.error('Error al modificar saldo:', error);
    throw error;
  }
};

const CuentaService = {
  getCuentas,
  getCuentaById,
  deleteCuenta,
  updateCuenta,
  createCuenta,
  modificarSaldo,
};

export default CuentaService;

