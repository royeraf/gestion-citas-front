import api from './api'

export interface Area {
    id: number
    nombre: string
}

const areaService = {
    getAreas() {
        return api.get<Area[]>('/areas/')
    },

    getArea(id: number) {
        return api.get<Area>(`/areas/${id}`)
    },

    crearArea(data: { nombre: string }) {
        return api.post('/areas/', data)
    },

    actualizarArea(id: number, data: { nombre: string }) {
        return api.put(`/areas/${id}`, data)
    },

    eliminarArea(id: number) {
        return api.delete(`/areas/${id}`)
    }
}

export default areaService
