import api from './api'

// Interfaces
export interface User {
    id: number
    name: string
    username: string
    role: 'admin' | 'medico' | 'asistente'
    role_nombre?: string
    dni?: string
    activo?: boolean
    createdAt?: string | null
}

export interface CreateUserPayload {
    name: string
    username: string
    password: string
    role: 'admin' | 'medico' | 'asistente'
    dni?: string
}

export interface UpdateUserPayload {
    name?: string
    username?: string
    password?: string
    role?: 'admin' | 'medico' | 'asistente'
    activo?: boolean
}

export interface ListUsersParams {
    role?: 'admin' | 'medico' | 'asistente'
    search?: string
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
    }
}

export default userService
