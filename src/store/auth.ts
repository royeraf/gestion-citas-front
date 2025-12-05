// src/store/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

interface User {
  id: number
  email: string
  dni: string
  nombre?: string
  role_id?: number
  roles: string[] // ej: ['asistente_tecnico'], ['administrador']
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token') || null)
  const isAuthenticated = ref<boolean>(!!token.value)

  function setSession(newToken: string | null, userPayload?: User | null) {
    token.value = newToken
    isAuthenticated.value = !!newToken
    if (newToken) localStorage.setItem('token', newToken)
    else localStorage.removeItem('token')

    if (userPayload) {
      user.value = userPayload
      localStorage.setItem('user', JSON.stringify(userPayload))
    } else {
      user.value = null
      localStorage.removeItem('user')
    }
  }

  // Recuperar usuario de localStorage al iniciar
  if (localStorage.getItem('user')) {
    try {
      user.value = JSON.parse(localStorage.getItem('user') || '{}')
    } catch (e) {
      localStorage.removeItem('user')
    }
  }

  async function login(dni: string, password: string) {
    // Mock login para validación
    // Eliminar mock para usar siempre el backend


    // Fallback a API real si no son las credenciales de prueba
    try {
      const { data } = await api.post('/auth/login', { dni, password })
      const token = data.access_token
      const userPayload = data.usuario
      setSession(token, userPayload)
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
      setSession(null, null)
    }
  }


  function hasRole(role: string) {
    return !!user.value && user.value.roles.includes(role)
  }

  // intenta reconstruir user desde token si no tenemos user (opcional)
  async function fetchProfile() {
    try {
      const { data } = await api.get('/auth/me')
      user.value = data.user
      return data
    } catch {
      // si falla, limpiar sesión
      logout()
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    hasRole,
    fetchProfile,
    setSession
  }
})
