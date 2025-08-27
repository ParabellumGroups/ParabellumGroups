import axios, { AxiosResponse } from 'axios';
import { ApiResponse, AuthResponse, LoginRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api/v1' : 'http://localhost:3001/api/v1');
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
    try {
      const response = await api.get<ApiResponse<T[]>>(`/${endpoint}`, { params });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(`Endpoint ${endpoint} not found, returning mock data`);
        return getMockDataForEndpoint(endpoint, params);
      }
      throw error;
    }
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

// Fonction pour fournir des données mock en cas d'erreur 404
const getMockDataForEndpoint = (endpoint: string, params?: any): ApiResponse<any> => {
  const mockData: Record<string, any> = {
    'reports': {
      success: true,
      data: {
        revenue: { total: 0, change: 0, trend: 0, monthly: 0 },
        customers: { active: 0, change: 0 },
        quotes: { pending: 0, change: 0 },
        invoices: { unpaid: 0, change: 0 },
        conversion: { rate: 0, change: 0 },
        projects: { active: 0, change: 0 },
        financial: { revenue: 0, expenses: 0, profit: 0 },
        stock: { alerts: [] },
        recentActivities: [],
        stages: [],
        totalValue: 0,
        monthlyRevenue: [],
        bySalesperson: [],
        byService: []
      }
    },
    'dashboard': {
      success: true,
      data: {
        revenue: { total: 0, change: 0, trend: 0 },
        customers: { active: 0, change: 0 },
        quotes: { pending: 0, change: 0 },
        invoices: { unpaid: 0, change: 0 },
        conversion: { rate: 0, change: 0 },
        projects: { active: 0, change: 0 },
        financial: { revenue: 0, expenses: 0, profit: 0 },
        stock: { alerts: [] },
        recentActivities: []
      }
    }
  };

  // Retourner les données mock selon l'endpoint et les paramètres
  if (params?.endpoint) {
    return mockData[params.endpoint] || mockData['dashboard'];
  }
  
  return mockData[endpoint] || { success: true, data: {} };
};

export default api;