import api from './api';

export interface EstadisticasReporte {
    stats: {
        totalCitas: number;
        tasaAsistencia: number;
        cancelaciones: number;
    };
    citasAtendidasPorMes: { nombre: string; cantidad: number }[];
    estadoCitas: { label: string; value: number; color: string }[];
    citasPorEspecialidad: { nombre: string; cantidad: number; porcentaje: number }[];
    citasDetalle: { id: number; fecha: string; paciente: string; especialidad: string; estado: string }[];
}

export interface ReporteParams {
    fecha_inicio?: string;
    fecha_fin?: string;
    area_id?: string;
}

export default {
    getEstadisticas(params?: ReporteParams) {
        return api.get<{success: boolean; stats: EstadisticasReporte['stats']; citasAtendidasPorMes: EstadisticasReporte['citasAtendidasPorMes']; estadoCitas: EstadisticasReporte['estadoCitas']; citasPorEspecialidad: EstadisticasReporte['citasPorEspecialidad']; citasDetalle: EstadisticasReporte['citasDetalle']}>('/reportes/estadisticas', { params });
    },
    exportarPDF(params?: ReporteParams) {
        return api.get('/reportes/exportar-pdf', { params, responseType: 'blob' });
    }
};
