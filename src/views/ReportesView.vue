<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
            <!-- Header Section -->
            <div class="mb-8">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Reportes y Estadísticas</h1>
                        <p class="mt-1 text-sm text-gray-500">Analiza el rendimiento de las citas médicas</p>
                    </div>
                    <button @click="exportarPDF"
                        class="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-red-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-red-500/30">
                        <DocumentTextIcon class="w-5 h-5" />
                        Exportar PDF
                    </button>
                </div>
            </div>

            <!-- Filtros de Fecha -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Filtros de Búsqueda</h2>
                <div class="flex flex-col md:flex-row items-end gap-4">
                    <div class="flex-1 w-full">
                        <label class="block text-sm font-medium text-gray-600 mb-2">Rango de Fechas</label>
                        <div class="flex items-center gap-3">
                            <input type="date" v-model="filtros.fechaInicio"
                                class="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all">
                            <span class="text-gray-400 font-medium">—</span>
                            <input type="date" v-model="filtros.fechaFin"
                                class="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all">
                        </div>
                    </div>
                    <div class="flex-1 w-full">
                        <label class="block text-sm font-medium text-gray-600 mb-2">Especialidad</label>
                        <select v-model="filtros.especialidad"
                            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all">
                            <option value="">Todas las especialidades</option>
                            <option value="odontologia">Odontología</option>
                            <option value="psicologia">Psicología</option>
                            <option value="nutricion">Nutrición</option>
                            <option value="medicina_general">Medicina General</option>
                        </select>
                    </div>
                    <button @click="generarReporte"
                        class="w-full md:w-auto bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-teal-500/30 flex items-center justify-center gap-2">
                        <ChartBarIcon class="w-5 h-5" />
                        Generar Reporte
                    </button>
                </div>
            </div>

            <!-- KPI Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <!-- Total Citas -->
                <div
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Citas</p>
                            <p class="mt-2 text-4xl font-bold text-gray-900">{{ stats.totalCitas }}</p>
                        </div>
                        <div class="p-3 bg-teal-50 rounded-xl">
                            <svg class="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center text-sm">
                        <span
                            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <ArrowTrendingUpIcon class="w-3 h-3 mr-1" /> +5%
                        </span>
                        <span class="text-gray-500 ml-2">vs mes anterior</span>
                    </div>
                </div>

                <!-- Tasa de Asistencia -->
                <div
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Tasa de Asistencia</p>
                            <p class="mt-2 text-4xl font-bold text-gray-900">{{ stats.tasaAsistencia }}<span
                                    class="text-2xl text-gray-400">%</span></p>
                        </div>
                        <div class="p-3 bg-blue-50 rounded-xl">
                            <CheckCircleIcon class="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    <div class="mt-4 flex items-center text-sm">
                        <span
                            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <ArrowTrendingUpIcon class="w-3 h-3 mr-1" /> +2%
                        </span>
                        <span class="text-gray-500 ml-2">mejora</span>
                    </div>
                </div>

                <!-- Cancelaciones -->
                <div
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Cancelaciones</p>
                            <p class="mt-2 text-4xl font-bold text-gray-900">{{ stats.cancelaciones }}</p>
                        </div>
                        <div class="p-3 bg-red-50 rounded-xl">
                            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center text-sm">
                        <span
                            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <ArrowTrendingDownIcon class="w-3 h-3 mr-1" /> -1%
                        </span>
                        <span class="text-gray-500 ml-2">vs mes anterior</span>
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <!-- Gráfico de Citas por Mes -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">Citas Atendidas por Mes</h3>
                        <span class="text-xs font-medium text-gray-400 uppercase">Últimos 6 meses</span>
                    </div>
                    <div ref="chartContainer" class="w-full h-64"></div>
                </div>

                <!-- Gráfico de Pastel: Estado de Citas -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">Estado de Citas</h3>
                        <span class="text-xs font-medium text-gray-400 uppercase">Distribución</span>
                    </div>
                    <div class="flex flex-col md:flex-row items-center justify-around">
                        <div ref="pieChartContainer" class="w-64 h-64 flex items-center justify-center"></div>
                        <div class="mt-6 md:mt-0 space-y-4">
                            <div class="flex items-center gap-3">
                                <span
                                    class="w-4 h-4 rounded-full bg-gradient-to-r from-teal-400 to-teal-500 shadow-sm"></span>
                                <div>
                                    <span class="text-sm text-gray-600">Atendidos</span>
                                    <p class="text-xl font-bold text-gray-900">{{ stats.totalCitas - stats.cancelaciones
                                        }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <span
                                    class="w-4 h-4 rounded-full bg-gradient-to-r from-red-400 to-red-500 shadow-sm"></span>
                                <div>
                                    <span class="text-sm text-gray-600">Cancelados</span>
                                    <p class="text-xl font-bold text-gray-900">{{ stats.cancelaciones }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Especialidades Section -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-semibold text-gray-900">Especialidades Más Solicitadas</h3>
                    <span class="text-xs font-medium text-gray-400 uppercase">Top 4</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div v-for="(esp, index) in especialidadesTop" :key="index" class="p-4 bg-gray-50 rounded-xl">
                        <div class="flex justify-between items-center mb-3">
                            <div class="flex items-center gap-2">
                                <span
                                    class="w-8 h-8 flex items-center justify-center bg-teal-100 text-teal-600 font-bold rounded-lg text-sm">
                                    {{ index + 1 }}
                                </span>
                                <span class="font-medium text-gray-800">{{ esp.nombre }}</span>
                            </div>
                            <span class="text-sm font-semibold text-teal-600">{{ esp.cantidad }} citas</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-gradient-to-r from-teal-400 to-teal-500 h-2.5 rounded-full transition-all duration-500"
                                :style="{ width: esp.porcentaje + '%' }"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabla Detallada -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900">Detalle de Atenciones</h3>
                    <span class="text-xs font-medium text-gray-400 uppercase">{{ detalleReporte.length }}
                        registros</span>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-gray-50">
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Fecha</th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Especialidad</th>
                                <th
                                    class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Total</th>
                                <th
                                    class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Atendidas</th>
                                <th
                                    class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Canceladas</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="(fila, index) in detalleReporte" :key="index"
                                class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 text-sm text-gray-900 font-medium">{{ fila.fecha }}</td>
                                <td class="px-6 py-4 text-sm text-gray-600">{{ fila.especialidad }}</td>
                                <td class="px-6 py-4 text-sm text-gray-700 text-center font-semibold">{{ fila.total }}
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {{ fila.atendidas }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        {{ fila.canceladas }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';
import {
    ChartBarIcon,
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

const chartContainer = ref<HTMLElement | null>(null);
const pieChartContainer = ref<HTMLElement | null>(null);

const renderChart = () => {
    if (!chartContainer.value) return;

    // Clear previous chart
    d3.select(chartContainer.value).selectAll('*').remove();

    const data = citasPorMes.value;
    const margin = { top: 20, right: 0, bottom: 30, left: 40 };
    const width = chartContainer.value.clientWidth - margin.left - margin.right;
    const height = chartContainer.value.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(chartContainer.value)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.nombre))
        .padding(0.2);

    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "middle");

    // Y axis
    const y = d3.scaleLinear()
        .domain([0, 200]) // Fixed domain based on data or make it dynamic
        .range([height, 0]);

    svg.append('g')
        .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("mybar")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.nombre) as number)
        .attr("y", d => y(d.cantidad))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.cantidad))
        .attr("fill", "#5eead4") // teal-300
        .on("mouseover", function (_event, d) {
            d3.select(this).attr("fill", "#2dd4bf"); // teal-400

            // Add tooltip logic if needed, or simple text on top
            svg.append("text")
                .attr("id", "tooltip-" + d.nombre)
                .attr("x", (x(d.nombre) as number) + x.bandwidth() / 2)
                .attr("y", y(d.cantidad) - 5)
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .style("font-weight", "bold")
                .text(d.cantidad);
        })
        .on("mouseout", function (_event, d) {
            d3.select(this).attr("fill", "#5eead4");
            d3.select("#tooltip-" + d.nombre).remove();
        });
};

const renderPieChart = () => {
    if (!pieChartContainer.value) return;

    // Clear previous chart
    d3.select(pieChartContainer.value).selectAll('*').remove();

    const width = pieChartContainer.value.clientWidth;
    const height = pieChartContainer.value.clientHeight;
    const margin = 10; // Add margin to prevent clipping
    const radius = (Math.min(width, height) / 2) - margin;

    const svg = d3.select(pieChartContainer.value)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

    const data = [
        { label: 'Atendidos', value: stats.value.totalCitas - stats.value.cancelaciones },
        { label: 'Cancelados', value: stats.value.cancelaciones }
    ];

    const color = d3.scaleOrdinal()
        .domain(['Atendidos', 'Cancelados'])
        .range(['#2dd4bf', '#ef4444']); // teal-400, red-500

    const pie = d3.pie<any>().value(d => d.value);
    const data_ready = pie(data);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    svg.selectAll('whatever')
        .data(data_ready)
        .join('path')
        .attr('d', arc as any)
        .attr('fill', d => color(d.data.label) as string)
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.9)
        .on("mouseover", function (_event, _d) {
            d3.select(this).style("opacity", 1);
            d3.select(this).style("transform", "scale(1.05)");
        })
        .on("mouseout", function (_event, _d) {
            d3.select(this).style("opacity", 0.9);
            d3.select(this).style("transform", "scale(1)");
        });
};

onMounted(() => {
    // Wait for container to have dimensions
    requestAnimationFrame(() => {
        renderChart();
        renderPieChart();
    });

    window.addEventListener('resize', () => {
        renderChart();
        renderPieChart();
    });
});

</script>