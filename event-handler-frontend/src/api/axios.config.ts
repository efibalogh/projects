import axios from 'axios';

const createApi = (baseURL: string) => {
  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (!error.response || error.response.status >= 500) {
        localStorage.removeItem('token');
        return Promise.reject(new Error('Server is unavailable. Please try again later.'));
      }

      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem('token');
      }
      return Promise.reject(error);
    },
  );

  return api;
};

export const api = createApi('http://localhost:8081/events');
export const authApi = createApi('http://localhost:8081/auth');
export const userApi = createApi('http://localhost:8081/users');

[api, authApi, userApi].forEach((instance) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
});
