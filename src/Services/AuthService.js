import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/auth/`;

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

const register = async (email, password) => {
  try {
    const response = await axios.post(
      API_URL + "register",
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Usuario creado:", response.data);
    return response;
  } catch (error) {
    console.error("Error creando usuario:", error);
    throw error;
  }
};

const login = async (email, password) => {
  try {
    const response = axios.post(
      API_URL + "login",
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error iniciando sesión:", error);
    throw error;
  }
};

const logout = () => {
  try {
    const response = axios.post(API_URL + "logout", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Usuario deslogueado:", response.data);
    return response;
  } catch (error) {
    console.error("Error cerrando sesión:", error);
    throw error;
  }
};

const AuthService = {
  register,
  login,
  logout,
};

export default AuthService;
