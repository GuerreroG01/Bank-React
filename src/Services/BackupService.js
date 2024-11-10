import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/Backup`;

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

  const create_backup = async () => {
    try {
        const response = await axios.get(`${API_URL}/create_backup`);
        return response.data;
    } catch (error) {
        console.error('Error al crear el backup:', error);
        throw error;
    }
  }

  const open_backup = async (backupPath) => {
    try {
        const response = await axios.get(`${API_URL}/open_backup?backupPath=${backupPath}`);
        return response;
    }
    catch (error){
        console.error('Error al abrir el backup:', error);
        throw error;
    }
  }

  const restore_backup = async (backupPath) => {
    try {
        const response = await axios.get(`${API_URL}/restore_backup?backupPath=${backupPath}`);
        return response;
    }
    catch (error){
        console.error('Error al restaurar la base de datos:', error);
        throw error;
    }
  }

  const BackupService = {
    create_backup,
    open_backup,
    restore_backup
  };

  export default BackupService;