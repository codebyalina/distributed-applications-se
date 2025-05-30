import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

// Глобално държим logout handler
let logoutHandler: (() => void) | null = null;
export function setLogoutHandler(handler: () => void) {
  logoutHandler = handler;
}

// Глобален axios интерцептор за 401 Unauthorized
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401 && logoutHandler) {
      logoutHandler(); // Само logout, не рефрешва
    }
    return Promise.reject(error);
  }
);

export default api;
