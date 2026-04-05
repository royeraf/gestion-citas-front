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
                </div>
            </div>

            <!-- Tabs Navigation -->
            <div class="mb-8 border-b border-gray-200">
                <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                    <button @click="activeTab = 'estadisticas'" :class="[
                        activeTab === 'estadisticas'
                            ? 'border-teal-500 text-teal-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
                    ]">
                        <ChartBarIcon class="w-5 h-5" />
                        Estadísticas Generales
                    </button>
                    <!--
                    <button @click="activeTab = 'indicadores'" :class="[
                        activeTab === 'indicadores'
                            ? 'border-teal-500 text-teal-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
                    ]">
                        <PresentationChartLineIcon class="w-5 h-5" />
                        Indicadores de Tesis
                    </button>
                    -->
                </nav>
            </div>


            <!-- Tab: Estadísticas Generales -->
            <div v-show="activeTab === 'estadisticas'">
                <!-- Filtros de Fecha -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="p-2 bg-emerald-100 rounded-lg">
                            <FunnelIcon class="w-5 h-5 text-emerald-600" />
                        </div>
                        <h2 class="text-lg font-semibold text-gray-800">Filtros de Búsqueda</h2>
                    </div>
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
                                <option v-for="area in areas" :key="area.id" :value="area.id">{{ area.nombre }}</option>
                            </select>
                        </div>
                        <button @click="generarReporte" :disabled="loading"
                            class="w-full md:w-auto bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-teal-500/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                            <svg v-if="loading" class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            <ChartBarIcon v-else class="w-5 h-5" />
                            {{ loading ? 'Cargando...' : 'Generar Reporte' }}
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
                                <CalendarIcon class="w-8 h-8 text-teal-500" />
                            </div>
                        </div>
                    </div>

                    <!-- Tasa de Asistencia -->
                    <div
                        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Tasa de Asistencia
                                </p>
                                <p class="mt-2 text-4xl font-bold text-gray-900">{{ stats.tasaAsistencia }}<span
                                        class="text-2xl text-gray-400">%</span></p>
                            </div>
                            <div class="p-3 bg-blue-50 rounded-xl">
                                <CheckCircleIcon class="w-8 h-8 text-blue-500" />
                            </div>
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
                                <XCircleIcon class="w-8 h-8 text-red-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="p-2 bg-emerald-100 rounded-lg">
                                <ChartBarIcon class="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 class="text-lg font-semibold text-gray-800">Citas Atendidas por Mes</h3>
                        </div>
                        <div ref="chartContainer" class="w-full h-64"></div>
                    </div>

                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="p-2 bg-emerald-100 rounded-lg">
                                <ChartPieIcon class="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 class="text-lg font-semibold text-gray-800">Estado de Citas</h3>
                        </div>
                        <div ref="pieChartContainer" class="w-full h-64 flex items-center justify-center"></div>
                    </div>
                </div>

                <!-- Especialidades Section -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="p-2 bg-purple-100 rounded-lg">
                            <BuildingOfficeIcon class="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800">Citas por Especialidad</h3>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div v-for="esp in especialidades" :key="esp.nombre"
                            class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm font-medium text-gray-700">{{ esp.nombre }}</span>
                                <span class="text-lg font-bold text-gray-900">{{ esp.cantidad }}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                    :style="{ width: esp.porcentaje + '%' }"></div>
                            </div>
                            <p class="text-xs text-gray-500 mt-1">{{ esp.porcentaje }}% del total</p>
                        </div>
                    </div>
                </div>

                <!-- Tabla Detallada -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-emerald-100 rounded-lg">
                                <TableCellsIcon class="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 class="text-lg font-semibold text-gray-800">Detalle de Citas</h3>
                        </div>
                        <button @click="exportarPDF" :disabled="exportandoPDF"
                            class="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-xl shadow-lg transition-all duration-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                            <svg v-if="exportandoPDF" class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            <DocumentTextIcon v-else class="w-4 h-4" />
                            {{ exportandoPDF ? 'Generando...' : 'Exportar PDF' }}
                        </button>
                    </div>
                    <div v-if="errorExport" class="mx-6 mt-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        {{ errorExport }}
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
                                        Paciente</th>
                                    <th
                                        class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Especialidad</th>
                                    <th
                                        class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Estado</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr v-for="cita in citasDetalle" :key="cita.id"
                                    class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4 text-sm text-gray-700">{{ cita.fecha }}</td>
                                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ cita.paciente }}</td>
                                    <td class="px-6 py-4 text-sm text-gray-700">{{ cita.especialidad }}</td>
                                    <td class="px-6 py-4">
                                        <span :class="getEstadoClass(cita.estado)"
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                            {{ cita.estado }}
                                        </span>
                                    </td>
                                </tr>
                                <tr v-if="citasDetalle.length === 0">
                                    <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                                        No hay datos disponibles. Selecciona un rango de fechas y genera el reporte.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Tab: Indicadores de Tesis (Requerimiento: no mostrar, comentado) -->
            <div v-if="false" v-show="activeTab === 'indicadores'">
                <!-- Filtros Indicadores -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="p-2 bg-indigo-100 rounded-lg">
                            <FunnelIcon class="w-5 h-5 text-indigo-600" />
                        </div>
                        <h2 class="text-lg font-semibold text-gray-800">Período de Análisis (Indicadores de Tesis)</h2>
                    </div>
                    <div class="flex flex-col md:flex-row items-end gap-4">
                        <div class="flex-1 w-full">
                            <label class="block text-sm font-medium text-gray-600 mb-2">Rango de Fechas</label>
                            <div class="flex items-center gap-3">
                                <input type="date" v-model="indicadorFiltros.fechaInicio"
                                    class="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                                <span class="text-gray-400 font-medium">—</span>
                                <input type="date" v-model="indicadorFiltros.fechaFin"
                                    class="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                            </div>
                        </div>
                        <div class="flex-1 w-full">
                            <label class="block text-sm font-medium text-gray-600 mb-2">Área (Opcional)</label>
                            <select v-model="indicadorFiltros.areaId"
                                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                                <option :value="null">Todas las áreas</option>
                                <option v-for="area in areas" :key="area.id" :value="area.id">{{ area.nombre }}</option>
                            </select>
                        </div>
                        <button @click="cargarIndicadores" :disabled="indicadorLoading"
                            class="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50">
                            <PresentationChartLineIcon class="w-5 h-5" />
                            {{ indicadorLoading ? 'Cargando...' : 'Calcular Indicadores' }}
                        </button>
                    </div>
                </div>

                <!-- Loading State -->
                <div v-if="indicadorLoading" class="flex justify-center items-center py-20">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>

                <!-- Indicadores Cards -->
                <div v-else-if="indicadores" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <!-- Utilización de Capacidad -->
                    <div
                        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div class="flex items-center justify-between mb-4">
                            <div class="p-3 bg-blue-50 rounded-xl">
                                <ChartPieIcon class="w-8 h-8 text-blue-500" />
                            </div>
                            <span class="text-xs font-medium text-gray-400 uppercase">Dimensión 1</span>
                        </div>
                        <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">{{
                            indicadores?.utilizacion_capacidad.nombre }}</p>
                        <p class="mt-2 text-4xl font-bold text-gray-900">
                            {{ indicadores?.utilizacion_capacidad.valor }}<span class="text-2xl text-gray-400">%</span>
                        </p>
                        <p class="mt-2 text-xs text-gray-500">{{ indicadores?.utilizacion_capacidad.descripcion }}</p>
                        <div class="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                            <p><strong>Citas programadas:</strong> {{
                                indicadores?.utilizacion_capacidad.componentes.citas_programadas }}</p>
                            <p><strong>Cupos totales:</strong> {{
                                indicadores?.utilizacion_capacidad.componentes.cupos_totales }}</p>
                        </div>
                    </div>

                    <!-- Tasa de Inasistencia -->
                    <div
                        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div class="flex items-center justify-between mb-4">
                            <div class="p-3 bg-red-50 rounded-xl">
                                <UserMinusIcon class="w-8 h-8 text-red-500" />
                            </div>
                            <span class="text-xs font-medium text-gray-400 uppercase">Dimensión 2</span>
                        </div>
                        <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">{{
                            indicadores?.tasa_inasistencia.nombre }}</p>
                        <p class="mt-2 text-4xl font-bold text-gray-900">
                            {{ indicadores?.tasa_inasistencia.valor }}<span class="text-2xl text-gray-400">%</span>
                        </p>
                        <p class="mt-2 text-xs text-gray-500">{{ indicadores?.tasa_inasistencia.descripcion }}</p>
                        <div class="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                            <p><strong>No asistieron:</strong> {{ indicadores?.tasa_inasistencia.componentes.no_shows }}
                            </p>
                            <p><strong>Citas confirmadas:</strong> {{
                                indicadores?.tasa_inasistencia.componentes.citas_confirmadas }}</p>
                        </div>
                    </div>

                    <!-- Lead Time -->
                    <div
                        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div class="flex items-center justify-between mb-4">
                            <div class="p-3 bg-amber-50 rounded-xl">
                                <ClockIcon class="w-8 h-8 text-amber-500" />
                            </div>
                            <span class="text-xs font-medium text-gray-400 uppercase">Dimensión 3</span>
                        </div>
                        <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">{{
                            indicadores?.lead_time.nombre }}</p>
                        <p class="mt-2 text-4xl font-bold text-gray-900">
                            {{ indicadores?.lead_time.valor }}<span class="text-2xl text-gray-400"> días</span>
                        </p>
                        <p class="mt-2 text-xs text-gray-500">{{ indicadores?.lead_time.descripcion }}</p>
                        <div class="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                            <p><strong>Fórmula:</strong> {{ indicadores?.lead_time.formula }}</p>
                        </div>
                    </div>
                </div>

                <!-- Estadísticas Adicionales -->
                <div v-if="indicadorEstadisticas"
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="p-2 bg-emerald-100 rounded-lg">
                            <ChartBarIcon class="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800">Estadísticas Adicionales del Período</h3>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="bg-green-50 rounded-xl p-4 text-center">
                            <p class="text-2xl font-bold text-green-600">{{ indicadorEstadisticas?.citas_atendidas }}</p>
                            <p class="text-sm text-gray-600">Citas Atendidas</p>
                        </div>
                        <div class="bg-red-50 rounded-xl p-4 text-center">
                            <p class="text-2xl font-bold text-red-600">{{ indicadorEstadisticas?.citas_canceladas }}</p>
                            <p class="text-sm text-gray-600">Canceladas</p>
                        </div>
                        <div class="bg-amber-50 rounded-xl p-4 text-center">
                            <p class="text-2xl font-bold text-amber-600">{{ indicadorEstadisticas?.citas_no_asistio }}
                            </p>
                            <p class="text-sm text-gray-600">No Asistieron</p>
                        </div>
                        <div class="bg-indigo-50 rounded-xl p-4 text-center">
                            <p class="text-2xl font-bold text-indigo-600">{{
                                indicadorEstadisticas?.tasa_atencion_efectiva }}%</p>
                            <p class="text-sm text-gray-600">Tasa de Atención</p>
                        </div>
                    </div>
                </div>

                <!-- Comparativo por Área -->
                <div v-if="areasData.length > 0"
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                        <div class="p-2 bg-purple-100 rounded-lg">
                            <BuildingOfficeIcon class="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800">Comparativo por Área</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="bg-gray-50">
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Área
                                    </th>
                                    <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">
                                        Utilización</th>
                                    <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">
                                        Inasistencia</th>
                                    <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Lead
                                        Time</th>
                                    <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">
                                        Total Citas</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr v-for="area in areasData" :key="area.area_id" class="hover:bg-gray-50">
                                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ area.area_nombre }}</td>
                                    <td class="px-6 py-4 text-center">
                                        <span
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                            :class="getUtilizacionClass(area.utilizacion_capacidad)">
                                            {{ area.utilizacion_capacidad }}%
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-center">
                                        <span
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                            :class="getInasistenciaClass(area.tasa_inasistencia)">
                                            {{ area.tasa_inasistencia }}%
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-center text-sm text-gray-700">{{ area.lead_time }} días
                                    </td>
                                    <td class="px-6 py-4 text-center text-sm font-semibold text-gray-700">{{
                                        area.detalles.total_citas }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-if="!indicadorLoading && !indicadores"
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <PresentationChartLineIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Selecciona un período</h3>
                    <p class="text-gray-500">Elige las fechas y haz clic en "Calcular Indicadores" para ver las métricas
                        de tu tesis.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import * as d3 from 'd3';
import areaService from '../services/areaService';
import reporteService from '../services/reporteService';
import indicadorService, { type IndicadoresResponse, type DatosArea } from '../services/indicadorService';
import {
    ChartBarIcon,
    FunnelIcon,
    ChartPieIcon,
    ClockIcon,
    BuildingOfficeIcon,
    PresentationChartLineIcon,
    CalendarIcon,
    CheckCircleIcon,
    XCircleIcon,
    TableCellsIcon,
    DocumentTextIcon
} from '@heroicons/vue/24/outline';
import { UserMinusIcon } from '@heroicons/vue/24/solid';

interface Area {
    id: number;
    nombre: string;
}

// Tab activo
const activeTab = ref<'estadisticas' | 'indicadores'>('estadisticas');

// ==================== Estado para Estadísticas Generales ====================
const filtros = ref({
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
    especialidad: ''
});

const stats = ref({
    totalCitas: 0,
    tasaAsistencia: 0,
    cancelaciones: 0
});

const chartContainer = ref<HTMLElement | null>(null);
const pieChartContainer = ref<HTMLElement | null>(null);

let chartDataMeses = ref<{ nombre: string; cantidad: number }[]>([]);
let chartDataEstados = ref<{ label: string; value: number; color: string }[]>([]);

// Datos para especialidades
const especialidades = ref<{ nombre: string; cantidad: number; porcentaje: number }[]>([]);

// Datos para tabla detallada
const citasDetalle = ref<{ id: number; fecha: string; paciente: string; especialidad: string; estado: string }[]>([]);

const loading = ref(false);
const exportandoPDF = ref(false);
const errorExport = ref('');

// ==================== Estado para Indicadores de Tesis ====================
const indicadorFiltros = ref<{
    fechaInicio: string;
    fechaFin: string;
    areaId: number | null;
}>({
    fechaInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0] as string,
    fechaFin: new Date().toISOString().split('T')[0] as string,
    areaId: null
});

const indicadorLoading = ref(false);
const indicadores = ref<IndicadoresResponse['indicadores'] | null>(null);
const indicadorEstadisticas = ref<IndicadoresResponse['estadisticas_adicionales'] | null>(null);
const areasData = ref<DatosArea[]>([]);

// ==================== Estado compartido ====================
const areas = ref<Area[]>([]);

// ==================== Métodos ====================
const cargarAreas = async () => {
    try {
        const response = await areaService.getAreas();
        areas.value = response.data;
    } catch (error) {
        console.error('Error al cargar áreas:', error);
    }
};

const generarReporte = async () => {
    loading.value = true;
    try {
        const params = {
            fecha_inicio: filtros.value.fechaInicio,
            fecha_fin: filtros.value.fechaFin,
            area_id: filtros.value.especialidad
        };
        const response = await reporteService.getEstadisticas(params);
        if (response.data.success) {
            stats.value = response.data.stats;
            especialidades.value = response.data.citasPorEspecialidad;
            citasDetalle.value = response.data.citasDetalle;

            chartDataMeses.value = response.data.citasAtendidasPorMes;
            chartDataEstados.value = response.data.estadoCitas;

            await nextTick();
            renderChart();
            renderPieChart();
        }
    } catch (error) {
        console.error('Error al generar reporte:', error);
    } finally {
        loading.value = false;
    }
};

const exportarPDF = async () => {
    exportandoPDF.value = true;
    errorExport.value = '';
    try {
        const params = {
            fecha_inicio: filtros.value.fechaInicio,
            fecha_fin: filtros.value.fechaFin,
            area_id: filtros.value.especialidad || undefined
        };
        const response = await reporteService.exportarPDF(params);
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte_citas_${filtros.value.fechaInicio}_${filtros.value.fechaFin}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error: any) {
        console.error('Error al exportar PDF:', error);
        errorExport.value = 'No se pudo generar el PDF. Intenta de nuevo.';
        setTimeout(() => { errorExport.value = ''; }, 4000);
    } finally {
        exportandoPDF.value = false;
    }
};

const getEstadoClass = (estado: string) => {
    const classes: Record<string, string> = {
        'pendiente': 'bg-yellow-100 text-yellow-800',
        'confirmada': 'bg-blue-100 text-blue-800',
        'atendida': 'bg-green-100 text-green-800',
        'cancelada': 'bg-red-100 text-red-800',
        'no_asistio': 'bg-gray-100 text-gray-800'
    };
    return classes[estado] || 'bg-gray-100 text-gray-800';
};

const cargarIndicadores = async () => {
    indicadorLoading.value = true;
    try {
        const params = {
            fecha_inicio: indicadorFiltros.value.fechaInicio,
            fecha_fin: indicadorFiltros.value.fechaFin,
            ...(indicadorFiltros.value.areaId && { area_id: indicadorFiltros.value.areaId })
        };

        // Cargar indicadores principales
        const response = await indicadorService.getIndicadores(params);
        if (response.data.success) {
            indicadores.value = response.data.indicadores;
            indicadorEstadisticas.value = response.data.estadisticas_adicionales;
        }

        // Cargar comparativo por área (solo si no hay filtro de área)
        if (!indicadorFiltros.value.areaId) {
            const areasResponse = await indicadorService.getPorArea(params);
            if (areasResponse.data.success) {
                areasData.value = areasResponse.data.areas;
            }
        } else {
            areasData.value = [];
        }

    } catch (error) {
        console.error('Error al cargar indicadores:', error);
    } finally {
        indicadorLoading.value = false;
    }
};

const getUtilizacionClass = (valor: number) => {
    if (valor >= 80) return 'bg-green-100 text-green-800';
    if (valor >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
};

const getInasistenciaClass = (valor: number) => {
    if (valor <= 5) return 'bg-green-100 text-green-800';
    if (valor <= 15) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
};

const renderChart = () => {
    if (!chartContainer.value) return;
    d3.select(chartContainer.value).selectAll('*').remove();

    const data = chartDataMeses.value;
    
    if (data.length === 0) return;

    const margin = { top: 20, right: 0, bottom: 30, left: 40 };
    const width = chartContainer.value.clientWidth - margin.left - margin.right;
    const height = chartContainer.value.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(chartContainer.value)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().range([0, width]).domain(data.map(d => d.nombre)).padding(0.2);
    const maxVal = (d3.max(data, d => d.cantidad) as number) || 1;
    const y = d3.scaleLinear().domain([0, Math.ceil(maxVal * 1.15)]).range([height, 0]);

    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append('g').call(d3.axisLeft(y).tickFormat(d3.format('d')));

    svg.selectAll("mybar")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.nombre) as number)
        .attr("y", d => y(d.cantidad))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.cantidad))
        .attr("fill", "#5eead4");
};

const renderPieChart = () => {
    if (!pieChartContainer.value) return;
    d3.select(pieChartContainer.value).selectAll('*').remove();

    const containerWidth = pieChartContainer.value.clientWidth;
    const containerHeight = pieChartContainer.value.clientHeight;

    // Si el contenedor no tiene dimensiones, no renderizar
    if (containerWidth === 0 || containerHeight === 0) return;

    // Calcular dimensiones para el gráfico y la leyenda
    const chartHeight = containerHeight * 0.75;
    const radius = Math.min(containerWidth, chartHeight) / 2 - 10;

    const svg = d3.select(pieChartContainer.value)
        .append('svg')
        .attr('width', containerWidth)
        .attr('height', containerHeight);

    // Grupo para el gráfico de dona
    const chartGroup = svg.append('g')
        .attr('transform', `translate(${containerWidth / 2},${chartHeight / 2})`);

    // Datos para estado de citas
    const data = chartDataEstados.value;
    
    if (data.length === 0) return;

    const pie = d3.pie<any>().value(d => d.value).sort(null);
    const arc = d3.arc<any>().innerRadius(radius * 0.5).outerRadius(radius);

    const arcs = chartGroup.selectAll('arc')
        .data(pie(data))
        .join('g')
        .attr('class', 'arc');

    arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => d.data.color)
        .attr("stroke", "white")
        .style("stroke-width", "2px");

    // Leyenda horizontal debajo del gráfico
    const legendGroup = svg.append('g')
        .attr('transform', `translate(0,${chartHeight + 10})`);

    const legendItemWidth = containerWidth / data.length;

    const legend = legendGroup.selectAll('.legend')
        .data(data)
        .join('g')
        .attr('class', 'legend')
        .attr('transform', (_d, i) => `translate(${i * legendItemWidth + legendItemWidth / 2 - 40},0)`);

    legend.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('rx', 2)
        .attr('fill', d => d.color);

    legend.append('text')
        .attr('x', 16)
        .attr('y', 10)
        .style('font-size', '11px')
        .style('fill', '#374151')
        .text(d => `${d.label}`);
};

onMounted(async () => {
    await cargarAreas();
    await generarReporte();
});

watch(activeTab, async (newTab) => {
    if (newTab === 'estadisticas') {
        await nextTick();
        renderChart();
        renderPieChart();
    }
});
</script>