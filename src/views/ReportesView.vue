<template>
    <div class="max-w-7xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">Reportes y Estadísticas</h1>

        <!-- Filtros de Fecha -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <div class="flex flex-col md:flex-row items-end gap-4">
                <div class="flex-1 w-full">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Rango de Fechas</label>
                    <div class="flex items-center gap-2">
                        <input type="date" v-model="filtros.fechaInicio"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                        <span class="text-gray-500">a</span>
                        <input type="date" v-model="filtros.fechaFin"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    </div>
                </div>
                <div class="flex-1 w-full">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
                    <select v-model="filtros.especialidad"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white">
                        <option value="">Todas</option>
                        <option value="odontologia">Odontología</option>
                        <option value="psicologia">Psicología</option>
                        <option value="nutricion">Nutrición</option>
                        <option value="medicina_general">Medicina General</option>
                    </select>
                </div>
                <button @click="generarReporte"
                    class="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2">
                    <MagnifyingGlassIcon class="w-5 h-5" />
                    Generar
                </button>
                <button @click="exportarPDF"
                    class="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2">
                    <DocumentTextIcon class="w-5 h-5" />
                    PDF
                </button>
            </div>
        </div>

        <!-- Resumen de Estadísticas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-gray-500 text-sm font-medium uppercase mb-2">Total Citas</h3>
                <p class="text-3xl font-bold text-gray-800">{{ stats.totalCitas }}</p>
                <div class="mt-2 flex items-center text-sm">
                    <span class="text-green-600 font-medium flex items-center">
                        <ArrowTrendingUpIcon class="w-4 h-4 mr-1" /> 5%
                    </span>
                    <span class="text-gray-500 ml-2">vs mes anterior</span>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-gray-500 text-sm font-medium uppercase mb-2">Tasa de Asistencia</h3>
                <p class="text-3xl font-bold text-gray-800">{{ stats.tasaAsistencia }}%</p>
                <div class="mt-2 flex items-center text-sm">
                    <span class="text-green-600 font-medium flex items-center">
                        <CheckCircleIcon class="w-4 h-4 mr-1" /> +2%
                    </span>
                    <span class="text-gray-500 ml-2">mejora</span>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-gray-500 text-sm font-medium uppercase mb-2">Cancelaciones</h3>
                <p class="text-3xl font-bold text-gray-800">{{ stats.cancelaciones }}</p>
                <div class="mt-2 flex items-center text-sm">
                    <span class="text-red-600 font-medium flex items-center">
                        <ArrowTrendingDownIcon class="w-4 h-4 mr-1" /> -1%
                    </span>
                    <span class="text-gray-500 ml-2">vs mes anterior</span>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Gráfico de Citas por Mes (Simulado) -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-6">Citas Atendidas por Mes</h3>
                <div class="h-64 flex items-end justify-between gap-2 px-2">
                    <div v-for="(mes, index) in citasPorMes" :key="index"
                        class="flex flex-col items-center flex-1 group">
                        <div class="relative w-full bg-teal-100 rounded-t-lg hover:bg-teal-200 transition-all duration-300"
                            :style="{ height: mes.porcentaje + '%' }">
                            <div
                                class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {{ mes.cantidad }}
                            </div>
                        </div>
                        <span class="text-xs text-gray-600 mt-2 font-medium">{{ mes.nombre }}</span>
                    </div>
                </div>
            </div>

            <!-- Top Especialidades -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-6">Especialidades Más Solicitadas</h3>
                <div class="space-y-6">
                    <div v-for="(esp, index) in especialidadesTop" :key="index">
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-medium text-gray-700">{{ esp.nombre }}</span>
                            <span class="text-sm text-gray-500">{{ esp.cantidad }} citas</span>
                        </div>
                        <div class="w-full bg-gray-100 rounded-full h-3">
                            <div class="bg-teal-500 h-3 rounded-full transition-all duration-500"
                                :style="{ width: esp.porcentaje + '%' }"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabla Detallada -->
        <div class="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-800">Detalle de Atenciones</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Especialidad</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Citas
                            </th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Atendidas
                            </th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Canceladas
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="(fila, index) in detalleReporte" :key="index" class="hover:bg-gray-50">
                            <td class="px-6 py-4 text-sm text-gray-900">{{ fila.fecha }}</td>
                            <td class="px-6 py-4 text-sm text-gray-700">{{ fila.especialidad }}</td>
                            <td class="px-6 py-4 text-sm text-gray-700">{{ fila.total }}</td>
                            <td class="px-6 py-4 text-sm text-green-600 font-medium">{{ fila.atendidas }}</td>
                            <td class="px-6 py-4 text-sm text-red-600 font-medium">{{ fila.canceladas }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    MagnifyingGlassIcon,
    DocumentTextIcon,
    ArrowTrendingUpIcon,
    CheckCircleIcon,
    ArrowTrendingDownIcon
} from '@heroicons/vue/24/outline';

const filtros = ref({
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
    especialidad: ''
});

const stats = ref({
    totalCitas: 450,
    tasaAsistencia: 85,
    cancelaciones: 24
});

const citasPorMes = ref([
    { nombre: 'Ene', cantidad: 120, porcentaje: 40 },
    { nombre: 'Feb', cantidad: 145, porcentaje: 55 },
    { nombre: 'Mar', cantidad: 135, porcentaje: 50 },
    { nombre: 'Abr', cantidad: 160, porcentaje: 70 },
    { nombre: 'May', cantidad: 180, porcentaje: 85 },
    { nombre: 'Jun', cantidad: 155, porcentaje: 65 }
]);

const especialidadesTop = ref([
    { nombre: 'Medicina General', cantidad: 180, porcentaje: 80 },
    { nombre: 'Odontología', cantidad: 120, porcentaje: 55 },
    { nombre: 'Pediatría', cantidad: 90, porcentaje: 40 },
    { nombre: 'Ginecología', cantidad: 60, porcentaje: 25 }
]);

const detalleReporte = ref([
    { fecha: '2024-06-01', especialidad: 'Medicina General', total: 25, atendidas: 22, canceladas: 3 },
    { fecha: '2024-06-01', especialidad: 'Odontología', total: 15, atendidas: 14, canceladas: 1 },
    { fecha: '2024-06-02', especialidad: 'Pediatría', total: 20, atendidas: 18, canceladas: 2 },
    { fecha: '2024-06-02', especialidad: 'Ginecología', total: 10, atendidas: 9, canceladas: 1 },
    { fecha: '2024-06-03', especialidad: 'Medicina General', total: 22, atendidas: 20, canceladas: 2 }
]);

const generarReporte = () => {
    console.log('Generando reporte con filtros:', filtros.value);
    // Aquí iría la lógica para llamar al backend
};

const exportarPDF = () => {
    console.log('Exportando a PDF...');
    alert('Función de exportación a PDF simulada');
};
</script>