import api from './api';

export interface PacienteParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export default {
  getPacientes(params: PacienteParams) {
    return api.get('/pacientes/', { params });
  },

  buscarPorDNI(dni: string) {
    return api.get(`/pacientes/buscar/${dni}`);
  },

  crearPaciente(data: any) {
    return api.post('/pacientes/', data);
  },

  // Método para actualizar paciente si fuera necesario en el futuro
  actualizarPaciente(id: number, data: any) {
    return api.put(`/pacientes/${id}`, data);
  },

  // Método para eliminar paciente si fuera necesario en el futuro
  eliminarPaciente(id: number) {
    return api.delete(`/pacientes/${id}`);
  }
}
