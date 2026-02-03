import api from './api'

// Interfaces
export interface User {
    id: number
    name: string
    username: string
    role: 'admin' | 'profesional' | 'asistente'
    role_nombre?: string
    dni?: string
    activo?: boolean
    createdAt?: string | null
    persona?: {
        nombres: string
        apellido_paterno: string
        apellido_materno: string
        dni: string
    }
}

export interface CreateUserPayload {
    nombres: string
    apellido_paterno: string
    apellido_materno: string
    dni: string
    password: string
    role: 'admin' | 'profesional' | 'asistente'
}

export interface UpdateUserPayload {
    nombres?: string
    apellido_paterno?: string
    apellido_materno?: string
    dni?: string
    password?: string
    role?: 'admin' | 'profesional' | 'asistente'
    activo?: boolean
}

export interface ListUsersParams {
    role?: 'admin' | 'profesional' | 'asistente'
    search?: string
}

export interface DniResponse {
    nombres: string
    apellido_paterno: string
    apellido_materno: string
}

const userService = {
    // Listar todos los usuarios
    getUsers(params?: ListUsersParams) {
        return api.get<User[]>('/auth/users', { params })
    },

    // Obtener usuario por ID
    getUser(id: number) {
        return api.get<User>(`/auth/users/${id}`)
    },

    // Crear nuevo usuario
    createUser(payload: CreateUserPayload) {
        return api.post<{
            message: string
            usuario: User
        }>('/auth/users', payload)
    },

    // Actualizar usuario
    updateUser(id: number, payload: UpdateUserPayload) {
        return api.put<{
            message: string
            usuario: User
        }>(`/auth/users/${id}`, payload)
    },

    // Eliminar usuario
    deleteUser(id: number) {
        return api.delete<{
            message: string
        }>(`/auth/users/${id}`)
    },

    // Verificar DNI y obtener datos de RENIEC
    verificarDni(dni: string) {
        return api.post<DniResponse>('/dni/', { dni })
    }
}

export default userService

