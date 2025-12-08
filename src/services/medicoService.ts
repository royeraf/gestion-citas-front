import api from './api'

export interface Medico {
    id: number
    name: string
    dni?: string
    email?: string
    telefono?: string
    especialidad?: string
    area_id?: number
    area_nombre?: string
    activo?: boolean
    fecha_registro?: string
}

export interface MedicoParams {
    area_id?: number
    activo?: boolean
    search?: string
}

const medicoService = {
    getMedicos(params?: MedicoParams) {
        return api.get<Medico[]>('/medicos/', { params })
    },

    getMedico(id: number) {
        return api.get<Medico>(`/medicos/${id}`)
    },

    crearMedico(data: Partial<Medico>) {
        return api.post<Medico>('/medicos/', data)
    },

    actualizarMedico(id: number, data: Partial<Medico>) {
        return api.put<Medico>(`/medicos/${id}`, data)
    },

    eliminarMedico(id: number) {
        return api.delete(`/medicos/${id}`)
    },

    getMedicosPorArea(areaId: number) {
        return api.get<Medico[]>(`/medicos/`, { params: { area_id: areaId } })
    }
}

export default medicoService
