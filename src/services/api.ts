// src/services/api.ts
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/therapists/login', { email, password })
    return response.data
  },
  register: async (therapistData: any) => {
    const response = await api.post('/therapists/register', therapistData)
    return response.data
  },
}

// Client services
export const clientService = {
  getAll: async () => {
    const response = await api.get('/clients/')
    return response.data
  },
  getById: async (id: number) => {
    const response = await api.get(`/clients/${id}`)
    return response.data
  },
  create: async (clientData: any) => {
    const response = await api.post('/clients', clientData)
    return response.data
  },
  update: async (id: number, clientData: any) => {
    const response = await api.put(`/clients/${id}`, clientData)
    return response.data
  },
  delete: async (id: number) => {
    await api.delete(`/clients/${id}`)
  },
}

// Session services
export const sessionService = {
  getAll: async () => {
    const response = await api.get('/sessions/')
    return response.data
  },
  getById: async (id: number) => {
    const response = await api.get(`/sessions/${id}`)
    return response.data
  },
  create: async (sessionData: any) => {
    const response = await api.post('/sessions', sessionData)
    return response.data
  },
  update: async (id: number, sessionData: any) => {
    const response = await api.put(`/sessions/${id}`, sessionData)
    return response.data
  },
  delete: async (id: number) => {
    await api.delete(`/sessions/${id}`)
  },
  getClientSessions: async (clientId: number) => {
    const response = await api.get(`/sessions/client/${clientId}`)
    return response.data
  },
}

// Material services
export const materialService = {
  getAll: async () => {
    const response = await api.get('/materials/')
    return response.data
  },
  getById: async (id: number) => {
    const response = await api.get(`/materials/${id}`)
    return response.data
  },
  create: async (materialData: any) => {
    const response = await api.post('/materials', materialData)
    return response.data
  },
  assign: async (assignmentData: any) => {
    const response = await api.post('/materials/assign', assignmentData)
    return response.data
  },
  getClientMaterials: async (clientId: number) => {
    const response = await api.get(`/materials/client/${clientId}`)
    return response.data
  },
}