import axios, { AxiosResponse } from 'axios';
import { ApiResponse, AuthResponse, LoginRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Instance Axios avec configuration de base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les réponses et les erreurs
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si le token a expiré, essayer de le rafraîchir
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data.data;
          localStorage.setItem('token', token);

          // Réessayer la requête originale avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si le refresh échoue, rediriger vers la page de connexion
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data!;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await api.get<ApiResponse>('/auth/profile');
    return response.data.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post<ApiResponse>('/auth/refresh', { refreshToken });
    return response.data.data;
  },
};

// Service générique pour les opérations CRUD
export const createCrudService = <T>(endpoint: string) => ({
  getAll: async (params?: any) => {
    const response = await api.get<ApiResponse<T[]>>(`/${endpoint}`, { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<ApiResponse<T>>(`/${endpoint}/${id}`);
    return response.data;
  },

  create: async (data: Partial<T>) => {
    const response = await api.post<ApiResponse<T>>(`/${endpoint}`, data);
    return response.data;
  },

  update: async (id: number, data: Partial<T>) => {
    const response = await api.put<ApiResponse<T>>(`/${endpoint}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<ApiResponse>(`/${endpoint}/${id}`);
    return response.data;
  },
});

export default api;