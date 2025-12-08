import api from './api'

// Interfaces para el registro de pacientes
export interface RegistrarPacientePayload {
    dni: string
    nombres: string
    apellido_paterno: string
    apellido_materno: string
    fecha_nacimiento: string
    sexo: string
    estado_civil: string
    direccion: string
    grado_instruccion: string
    religion: string
    procedencia: string
    telefono: string
    email?: string
    seguro: string
    numero_seguro?: string
}

export interface PacienteResponse {
    id: number
    dni: string
    nombres: string
    apellido_paterno: string
    apellidoPaterno: string  // Alias para compatibilidad
    apellido_materno: string
    apellidoMaterno: string  // Alias para compatibilidad
    fecha_nacimiento: string
    fechaNacimiento: string  // Alias para compatibilidad
    fecha_registro?: string
    edad: number
    sexo: string
    estado_civil: string
    grado_instruccion: string | null
    religion: string | null
    procedencia: string | null
    telefono: string | null
    email: string | null
    direccion: string
    seguro: string | null
    numero_seguro?: string | null  // Nuevo campo para número de seguro
    numero_afiliacion?: string | null  // Mantener para compatibilidad
    origen?: 'local' | 'reniec'  // Indica si viene de BD local o RENIEC
}

export interface CrearPacienteResponse {
    message: string
    id: number
    is_new: boolean
    data: PacienteResponse
}

export interface PacienteParams {
    page?: number
    per_page?: number
    search?: string
}

const pacienteService = {
    // Registrar o actualizar paciente
    crearPaciente(payload: RegistrarPacientePayload) {
        return api.post<CrearPacienteResponse>('/pacientes/', payload)
    },

    // Buscar paciente por DNI
    buscarPorDNI(dni: string) {
        return api.get<PacienteResponse>(`/pacientes/buscar/${dni}`)
    },

    // Listar pacientes
    getPacientes(params?: PacienteParams) {
        return api.get('/pacientes/', { params })
    },

    // Actualizar paciente
    actualizarPaciente(id: number, data: Partial<RegistrarPacientePayload>) {
        return api.put(`/pacientes/${id}`, data)
    },

    // Eliminar paciente
    eliminarPaciente(id: number) {
        return api.delete(`/pacientes/${id}`)
    }
}

export default pacienteService
