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
    ocupacion?: string
}

export interface Paciente {
    id: number
    dni: string
    nombres: string
    apellido_paterno: string
    apellidoPaterno: string
    apellido_materno: string
    apellidoMaterno: string
    fecha_nacimiento: string
    fechaNacimiento: string
    edad: number
    sexo: string
    estado_civil: string
    grado_instruccion: string | null
    religion: string | null
    procedencia: string | null
    ocupacion: string | null
    telefono: string | null
    email: string | null
    direccion: string
    seguro: string | null
    numero_seguro: string | null
    numero_afiliacion?: string | null
    fecha_registro: string
    origen?: 'local' | 'reniec'
    tipo_existencia?: 'paciente' | 'persona' | 'reniec'
}

// Alias para compatibilidad
export type PacienteResponse = Paciente

export interface CrearPacienteResponse {
    message: string
    id: number
    is_new: boolean
    data: Paciente
}

export interface PacienteParams {
    page?: number
    per_page?: number
    search?: string
}

export interface HistorialCita {
    id: number
    paciente_id: number
    horario_id: number | null
    doctor_id: number | null
    area_id: number | null
    area: string | null
    area_nombre: string | null
    fecha: string | null
    sintomas: string
    estado: string
    doctor_nombre: string | null
    horario_turno: 'M' | 'T' | null
    horario_turno_nombre: string | null
    fecha_registro: string
    dni_acompanante: string | null
    nombre_acompanante: string | null
    telefono_acompanante: string | null
    horario?: {
        id: number
        turno: 'M' | 'T'
        turno_nombre: string
        hora_inicio: string
        hora_fin: string
    }
}

export interface HistorialResponse {
    paciente: {
        id: number
        dni: string
        nombre_completo: string
    }
    total: number
    pages: number
    current_page: number
    per_page: number
    data: HistorialCita[]
}

export interface UpdatePacientePayload {
    nombres?: string
    apellido_paterno?: string
    apellido_materno?: string
    fecha_nacimiento?: string
    sexo?: string
    estado_civil?: string
    grado_instruccion?: string
    religion?: string
    procedencia?: string
    ocupacion?: string
    telefono?: string
    email?: string
    direccion?: string
    seguro?: string
    numero_seguro?: string
}

const pacienteService = {
    // Registrar o actualizar paciente
    crearPaciente(payload: RegistrarPacientePayload) {
        return api.post<CrearPacienteResponse>('/pacientes/', payload)
    },

    // Buscar paciente por DNI
    buscarPorDNI(dni: string) {
        return api.get<Paciente>(`/pacientes/buscar/${dni}`)
    },

    // Listar pacientes con paginación y búsqueda
    getPacientes(params?: PacienteParams) {
        return api.get<{
            total: number
            pages: number
            current_page: number
            per_page: number
            data: Paciente[]
        }>('/pacientes/', { params })
    },

    // Obtener paciente por ID
    getPaciente(id: number) {
        return api.get<Paciente>(`/pacientes/${id}`)
    },

    // Actualizar paciente existente
    updatePaciente(id: number, payload: UpdatePacientePayload) {
        return api.put<{
            message: string
            data: Paciente
        }>(`/pacientes/${id}`, payload)
    },

    // Obtener historial de citas de un paciente
    getHistorialCitas(pacienteId: number, params?: {
        page?: number
        per_page?: number
        estado?: string
    }) {
        return api.get<HistorialResponse>(`/pacientes/${pacienteId}/historial`, { params })
    },

    // Eliminar paciente
    eliminarPaciente(id: number) {
        return api.delete(`/pacientes/${id}`)
    }
}

export default pacienteService
