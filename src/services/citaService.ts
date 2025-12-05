import api from './api';

export interface CitaParams {
  page?: number;
  per_page?: number;
  fecha?: string;
  doctor_id?: number;
  area?: string;
  estado?: string;
  paciente_dni?: string;
}

export default {
  // 1. Listado de Citas
  getCitas(params: CitaParams) {
    return api.get('/citas/', { params });
  },

  // 2. Detalle de Cita
  getCita(id: number) {
    return api.get(`/citas/${id}`);
  },

  // 3. Actualizar Cita
  actualizarCita(id: number, data: any) {
    return api.put(`/citas/${id}`, data);
  },

  // 4. Eliminar Cita
  eliminarCita(id: number) {
    return api.delete(`/citas/${id}`);
  },

  // 5. Crear Cita
  crearCita(data: any) {
    return api.post('/citas/', data);
  }
}
