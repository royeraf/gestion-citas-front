// src/store/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export interface User {
  id: number
  dni: string
  username: string | null
  nombres_completos: string | null
  rol_id: number  // 1=administrador, 2=medico, 3=asistente
  activo: boolean
}

interface LoginResponse {
  message: string
  access_token: string
  usuario: User
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref<boolean>(false)

  // Recuperar datos del usuario para la UI, pero NO asumimos que la sesión es válida (cookie)
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch (e) {
      localStorage.removeItem('user')
    }
  }

  function setSession(userPayload: User | null) {
    if (userPayload) {
      user.value = userPayload
      isAuthenticated.value = true
      localStorage.setItem('user', JSON.stringify(userPayload))
    } else {
      user.value = null
      isAuthenticated.value = false
      localStorage.removeItem('user')
    }
  }

  async function login(dni: string, password: string): Promise<LoginResponse> {
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', { dni, password })
      // El access_token ya viene en una cookie HttpOnly
      const userPayload = data.usuario
      setSession(userPayload)
      return data
    } catch (error) {
      throw error
    }
  }


  async function register(payload: { email: string; password: string; nombre?: string }) {
    const { data } = await api.post('/auth/register', payload)
    return data
  }

  async function logout() {
    try {
      // Intentar logout en backend, pero no bloquear si falla
      await api.post("/auth/logout").catch(() => {})
    } finally {
      setSession(null)
    }
  }

  function hasRole(role: string): boolean {
    const roleMap: Record<string, number> = {
      'administrador': 1,
      'medico': 2,
      'profesional': 2, // Alias often used
      'asistente': 3
    }
    return !!user.value && user.value.rol_id === roleMap[role]
  }

  // intenta reconstruir user desde token si no tenemos user (opcional)
  async function fetchProfile() {
    try {
      const { data } = await api.get<{ user: User }>('/auth/perfil') 
      // Note: Endpoint matching might vary. API shows /perfil returns {user: ...}
      // Usually not needed if we persist user in localStorage, unless logical check.
      // But keeping existing logic structure.
      if (data.user) {
         user.value = data.user
      }
      return data
    } catch {
      // si falla, no hacemos logout forzado aquí para no ser molestos, 
      // el interceptor 401 se encargará si es crítico.
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    hasRole,
    fetchProfile,
    setSession
  }
})
