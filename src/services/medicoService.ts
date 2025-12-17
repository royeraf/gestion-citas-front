
import api from './api';

export interface Medico {
    id: number;
    nombre: string;
    name: string; // Alias for compatibility
    iniciales: string;
    email: string;
    telefono: string;
    cmp: string;
    dni: string;
    area: string;
    especialidad: string;
    horario: string;
    cuposDia: number;
    direccion?: string;
    estado: 'activo' | 'inactivo';
    username: string;
}

export interface CreateMedicoPayload {
    name: string;
    username: string;
    password?: string;
    role: 'profesional';
    dni?: string;
}

export const medicoService = {
    async getMedicos(params?: { area_id?: number }): Promise<Medico[]> {
        const response = await api.get('/medicos/', {
            params: params
        });
        
        return response.data.map((m: any) => {
            const nombreCompleto = m.nombres_completos || m.name || '';
            return {
                id: m.id,
                nombre: nombreCompleto,
                name: nombreCompleto, // Alias for compatibility
                iniciales: this.obtenerIniciales(nombreCompleto),
                email: '',
                telefono: '',
                cmp: m.dni || '',
                dni: m.dni,
                area: m.area_id ? (m.area_nombre || '').toLowerCase().replace(' ', '_') : '', 
                especialidad: m.especialidad || m.area_nombre || '',
                horario: '',
                cuposDia: 0,
                direccion: '',
                estado: m.activo ? 'activo' : 'inactivo',
                username: m.username
            };
        });
    },

    async createMedico(data: CreateMedicoPayload) {
        // Uses the user creation endpoint since doctors are users
        const response = await api.post('/auth/users', {
            ...data,
            role: 'profesional'
        });
        return response.data;
    },

    async updateMedico(id: number, data: Partial<CreateMedicoPayload> & { activo?: boolean }) {
        const response = await api.put(`/auth/users/${id}`, data);
        return response.data;
    },

    async toggleEstado(id: number, nuevoEstado: boolean) {
        return this.updateMedico(id, { activo: nuevoEstado });
    },

    obtenerIniciales(nombre: string): string {
        const palabras = nombre.split(" ");
        return palabras
            .slice(0, 2)
            .map((p) => p[0])
            .join("")
            .toUpperCase();
    }
};

export default medicoService;
