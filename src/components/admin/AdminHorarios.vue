<template>
    <div class="space-y-6">
        <!-- Header con estadísticas -->
        <div class="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl shadow-lg p-6 text-white">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 class="text-2xl md:text-3xl font-bold flex items-center gap-3">
                        <CalendarIcon class="w-8 h-8 text-teal-200" />
                        Gestión de Horarios Médicos
                    </h1>
                    <p class="text-teal-100 mt-1">Configura la disponibilidad de los médicos de forma sencilla</p>
                </div>
                <button @click="abrirModalHorario"
                    class="bg-white text-teal-700 hover:bg-teal-50 font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center gap-2 shadow-md hover:shadow-lg">
                    <PlusCircleIcon class="w-6 h-6" />
                    Nuevo Horario
                </button>
            </div>

            <!-- Stats cards -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                            <UsersIcon class="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p class="text-2xl font-bold">{{ todosMedicos.length }}</p>
                            <p class="text-xs text-teal-100">Médicos</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                            <BuildingOfficeIcon class="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p class="text-2xl font-bold">{{ areas.length }}</p>
                            <p class="text-xs text-teal-100">Áreas</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-amber-400/80 rounded-full flex items-center justify-center">
                            <SunIcon class="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p class="text-2xl font-bold">{{ totalCuposManana }}</p>
                            <p class="text-xs text-teal-100">Cupos Mañana</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-indigo-400/80 rounded-full flex items-center justify-center">
                            <MoonIcon class="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p class="text-2xl font-bold">{{ totalCuposTarde }}</p>
                            <p class="text-xs text-teal-100">Cupos Tarde</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                            <TicketIcon class="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p class="text-2xl font-bold">{{ totalCupos }}</p>
                            <p class="text-xs text-teal-100">Total Cupos</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtros mejorados -->
        <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center gap-3 mb-6">
                <div class="p-2 bg-emerald-100 rounded-lg">
                    <FunnelIcon class="w-5 h-5 text-emerald-600" />
                </div>
                <h2 class="text-lg font-semibold text-gray-800">Filtrar Horarios</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                        <BuildingOfficeIcon class="w-4 h-4" /> Área
                    </label>
                    <select v-model="filtroAreaId" @change="cargarHorariosFiltrados"
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition">
                        <option :value="null">Todas las áreas</option>
                        <option v-for="area in areas" :key="area.id" :value="area.id">{{ area.nombre }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                        <UserIcon class="w-4 h-4" /> Médico
                    </label>
                    <select v-model="filtroMedicoId" @change="cargarHorariosFiltrados"
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition">
                        <option :value="null">Todos los médicos</option>
                        <option v-for="medico in medicos" :key="medico.id" :value="medico.id">{{ medico.name }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                        <CalendarIcon class="w-4 h-4" /> Mes
                    </label>
                    <input type="month" v-model="filtroMes" @change="cargarHorariosFiltrados"
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                        <ClockIcon class="w-4 h-4" /> Turno
                    </label>
                    <select v-model="filtroTurno" @change="cargarHorariosFiltrados"
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition">
                        <option :value="null">Todos los turnos</option>
                        <option value="M">🌞 Mañana (07:30-13:30)</option>
                        <option value="T">🌙 Tarde (13:30-19:30)</option>
                    </select>
                </div>
                <div class="flex items-end">
                    <button @click="limpiarFiltros"
                        class="w-full px-4 py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg transition flex items-center justify-center gap-2">
                        <XMarkIcon class="w-5 h-5" />
                        Limpiar
                    </button>
                </div>
            </div>
        </div>

        <!-- Toggle de vista -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button @click="vistaActual = 'medicos'" :class="[
                    'px-4 py-2 rounded-md transition font-medium text-sm flex items-center gap-2',
                    vistaActual === 'medicos' ? 'bg-white shadow text-teal-700' : 'text-gray-600 hover:text-gray-800'
                ]">
                    <UsersIcon class="w-5 h-5" />
                    Médicos
                </button>
                <button @click="vistaActual = 'tabla'" :class="[
                    'px-4 py-2 rounded-md transition font-medium text-sm flex items-center gap-2',
                    vistaActual === 'tabla' ? 'bg-white shadow text-teal-700' : 'text-gray-600 hover:text-gray-800'
                ]">
                    <ListBulletIcon class="w-5 h-5" />
                    Tabla
                </button>
                <button @click="vistaActual = 'tarjetas'" :class="[
                    'px-4 py-2 rounded-md transition font-medium text-sm flex items-center gap-2',
                    vistaActual === 'tarjetas' ? 'bg-white shadow text-teal-700' : 'text-gray-600 hover:text-gray-800'
                ]">
                    <Squares2X2Icon class="w-5 h-5" />
                    Tarjetas
                </button>
                <button v-if="filtroMedicoId && filtroMes" @click="vistaActual = 'calendario'" :class="[
                    'px-4 py-2 rounded-md transition font-medium text-sm flex items-center gap-2',
                    vistaActual === 'calendario' ? 'bg-white shadow text-teal-700' : 'text-gray-600 hover:text-gray-800'
                ]">
                    <CalendarIcon class="w-5 h-5" />
                    Calendario
                </button>
            </div>

            <div v-if="vistaActual !== 'medicos' && horariosList.length > 0" class="text-sm text-gray-500">
                {{ horariosList.length }} horario{{ horariosList.length !== 1 ? 's' : '' }} encontrado{{
                    horariosList.length !== 1 ? 's' : '' }}
            </div>
        </div>

        <!-- Vista de Médicos -->
        <div v-if="vistaActual === 'medicos'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-if="isLoadingList" v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 bg-gray-200 rounded-full"></div>
                    <div class="flex-1 space-y-2">
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>

            <template v-if="!isLoadingList">
                <div v-for="medico in todosMedicos" :key="medico.id" @click="abrirModalHorariosMedico(medico)"
                    class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-teal-500 group">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-14 h-14 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-lg group-hover:bg-teal-600 group-hover:text-white transition">
                            {{ getInitials(medico.name) }}
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3 class="font-semibold text-gray-900 truncate">{{ medico.name }}</h3>
                            <p class="text-sm text-gray-500">{{ medico.especialidad || 'Médico' }}</p>
                        </div>
                        <ChevronRightIcon class="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition" />
                    </div>

                    <!-- Área/Servicio -->
                    <div v-if="medico.area_nombre || medico.area_id"
                        class="mt-3 flex items-center gap-2 text-sm text-gray-600">
                        <BuildingOfficeIcon class="w-4 h-4 text-blue-500" />
                        <span class="font-medium">{{ medico.area_nombre || getAreaNombre(medico.area_id) }}</span>
                    </div>

                    <div class="mt-3 flex flex-wrap gap-2">
                        <span v-if="getMedicoHorariosCount(medico.id) > 0"
                            class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                            {{ getMedicoHorariosCount(medico.id) }} horarios
                        </span>
                        <span v-else class="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                            Sin horarios
                        </span>
                    </div>
                </div>
            </template>
        </div>

        <!-- Vista de Tabla -->
        <div v-if="vistaActual === 'tabla'" class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div v-if="isLoadingList" class="w-full">
                <div class="animate-pulse">
                    <div class="h-10 bg-gray-50 border-b border-gray-200 mb-4 mx-4 mt-4 rounded"></div>
                    <div v-for="i in 5" :key="i" class="h-16 border-b border-gray-100 flex px-6 items-center">
                        <div class="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
                        <div class="flex-1 space-y-2">
                            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div class="h-3 bg-gray-100 rounded w-1/3"></div>
                        </div>
                        <div class="w-24 h-6 bg-gray-200 rounded-full ml-4"></div>
                        <div class="w-16 h-6 bg-gray-200 rounded-lg ml-8"></div>
                    </div>
                </div>
                <p class="text-center text-gray-400 text-sm py-4">Cargando horarios...</p>
            </div>

            <div v-else-if="horariosList.length === 0" class="flex flex-col items-center justify-center py-16">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CalendarDaysIcon class="w-10 h-10 text-gray-400" />
                </div>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">No hay horarios registrados</h3>
                <p class="text-gray-500 text-sm mb-4">Comienza creando un nuevo horario para los médicos</p>
                <button @click="abrirModalHorario"
                    class="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center gap-2">
                    <PlusIcon class="w-5 h-5" />
                    Crear Horario
                </button>
            </div>

            <div v-else class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th
                                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <div class="flex items-center gap-2">
                                    <UserIcon class="w-4 h-4 text-teal-500" />
                                    Médico
                                </div>
                            </th>
                            <th
                                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <div class="flex items-center gap-2">
                                    <BuildingOfficeIcon class="w-4 h-4 text-teal-500" />
                                    Área
                                </div>
                            </th>
                            <th
                                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <div class="flex items-center gap-2">
                                    <CalendarIcon class="w-4 h-4 text-teal-500" />
                                    Fecha
                                </div>
                            </th>
                            <th
                                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <div class="flex items-center gap-2">
                                    <ClockIcon class="w-4 h-4 text-teal-500" />
                                    Turno
                                </div>
                            </th>
                            <th
                                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <div class="flex items-center gap-2">
                                    <TicketIcon class="w-4 h-4 text-teal-500" />
                                    Cupos
                                </div>
                            </th>
                            <th
                                class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-100">
                        <tr v-for="horario in horariosList" :key="horario.id"
                            class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-10 h-10 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-semibold">
                                        {{ getInitials(horario.medico_nombre || '') }}
                                    </div>
                                    <span class="font-medium text-gray-900">{{ horario.medico_nombre || 'ID: ' +
                                        horario.medico_id }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {{ horario.area_nombre || getAreaNombre(horario.area_id) }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-gray-700">
                                    {{ formatearFecha(horario.fecha) }}
                                </div>
                                <div class="text-xs text-gray-500">
                                    {{ diasSemanaCompletos[horario.dia_semana] }}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <span :class="[
                                        'px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1',
                                        getTurnoBadgeClass(horario.turno)
                                    ]">
                                        <SunIcon v-if="horario.turno === 'M'" class="w-3 h-3" />
                                        <MoonIcon v-else class="w-3 h-3" />
                                        {{ horario.turno_nombre || (horario.turno === 'M' ? 'Mañana' : 'Tarde') }}
                                    </span>
                                </div>
                                <div class="text-xs text-gray-500 mt-1">
                                    {{ horario.hora_inicio?.slice(0, 5) }} - {{ horario.hora_fin?.slice(0, 5) }}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <div
                                        class="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold">
                                        {{ horario.cupos }}
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center justify-center gap-2">
                                    <button @click="eliminarHorario(horario.id)"
                                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Eliminar">
                                        <TrashIcon class="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Vista de Tarjetas -->
        <div v-if="vistaActual === 'tarjetas'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-if="isLoadingList" class="contents">
                <div v-for="i in 6" :key="i"
                    class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-pulse">
                    <div class="h-12 bg-gray-200 w-full mb-4"></div>
                    <div class="p-4 space-y-4">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-gray-200 rounded-lg"></div>
                            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-gray-200 rounded-lg"></div>
                            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-gray-200 rounded-lg"></div>
                            <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="horariosList.length === 0"
                class="col-span-full flex flex-col items-center justify-center py-16">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CalendarDaysIcon class="w-10 h-10 text-gray-400" />
                </div>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">No hay horarios registrados</h3>
                <p class="text-gray-500 text-sm mb-4">Comienza creando un nuevo horario</p>
                <button @click="abrirModalHorario"
                    class="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center gap-2">
                    <PlusIcon class="w-5 h-5" />
                    Crear Horario
                </button>
            </div>

            <template v-else>
                <div v-for="horario in horariosList" :key="horario.id"
                    class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden">
                    <div :class="[
                        'px-4 py-3 text-white',
                        horario.turno === 'M'
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                            : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                    ]">
                        <div class="flex justify-between items-center">
                            <h3 class="font-semibold truncate">{{ horario.medico_nombre || 'Médico ' + horario.medico_id
                            }}</h3>
                            <span class="px-2 py-0.5 bg-white/20 rounded text-xs font-medium flex items-center gap-1">
                                <SunIcon v-if="horario.turno === 'M'" class="w-3 h-3" />
                                <MoonIcon v-else class="w-3 h-3" />
                                {{ horario.turno_nombre || (horario.turno === 'M' ? 'Mañana' : 'Tarde') }}
                            </span>
                        </div>
                    </div>
                    <div class="p-4 space-y-3">
                        <div class="flex items-center gap-3 text-gray-600">
                            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <BuildingOfficeIcon class="w-4 h-4 text-blue-600" />
                            </div>
                            <span class="text-sm">{{ horario.area_nombre || getAreaNombre(horario.area_id) }}</span>
                        </div>
                        <div class="flex items-center gap-3 text-gray-600">
                            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <CalendarIcon class="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                                <span class="text-sm font-medium">{{ formatearFecha(horario.fecha) }}</span>
                                <span class="text-xs text-gray-500 ml-1">({{ diasSemanaCompletos[horario.dia_semana]
                                }})</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 text-gray-600">
                            <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                <ClockIcon class="w-4 h-4 text-gray-600" />
                            </div>
                            <span class="text-sm font-medium">{{ horario.hora_inicio?.slice(0, 5) }} - {{
                                horario.hora_fin?.slice(0, 5) }}</span>
                        </div>
                        <div class="flex items-center gap-3 text-gray-600">
                            <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <TicketIcon class="w-4 h-4 text-emerald-600" />
                            </div>
                            <span class="text-sm"><strong>{{ horario.cupos }}</strong> cupos disponibles</span>
                        </div>
                    </div>
                    <div class="px-4 py-3 bg-gray-50 border-t flex justify-end gap-2">
                        <button @click="eliminarHorario(horario.id)"
                            class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 rounded-lg transition flex items-center gap-1">
                            <TrashIcon class="w-4 h-4" />
                            Eliminar
                        </button>
                    </div>
                </div>
            </template>
        </div>

        <!-- Vista de Calendario -->
        <div v-if="vistaActual === 'calendario' && filtroMedicoId && filtroMes"
            class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <CalendarIcon class="w-6 h-6 text-teal-600" />
                    Calendario - {{ nombreMedicoSeleccionado }}
                </h2>
                <span class="text-gray-500">{{ getMesNombre(filtroMes) }}</span>
            </div>

            <div class="grid grid-cols-7 gap-2">
                <!-- Encabezados de días -->
                <div v-for="dia in diasSemana" :key="dia"
                    class="text-center font-semibold text-gray-600 py-3 bg-gray-100 rounded-lg text-sm">
                    {{ dia }}
                </div>
                <!-- Días del mes -->
                <div v-for="(dia, index) in diasDelMes" :key="index" :class="[
                    'p-2 rounded-lg border min-h-[100px] transition-all',
                    dia.esDelMes ? 'bg-white border-gray-200 hover:shadow-md' : 'bg-gray-50 border-gray-100',
                    (dia.turnos?.M || dia.turnos?.T) ? 'border-teal-400 border-2' : ''
                ]">
                    <div v-if="dia.esDelMes">
                        <div class="font-bold text-gray-700 mb-2 text-sm">{{ dia.numero }}</div>

                        <!-- Turno Mañana -->
                        <div v-if="dia.turnos?.M"
                            class="text-xs bg-amber-500 text-white px-2 py-1 rounded mb-1 flex items-center gap-1">
                            <SunIcon class="w-3 h-3" />
                            <span>{{ dia.turnos.M.cupos }} cupos</span>
                        </div>

                        <!-- Turno Tarde -->
                        <div v-if="dia.turnos?.T"
                            class="text-xs bg-indigo-500 text-white px-2 py-1 rounded flex items-center gap-1">
                            <MoonIcon class="w-3 h-3" />
                            <span>{{ dia.turnos.T.cupos }} cupos</span>
                        </div>

                        <div v-if="!dia.turnos?.M && !dia.turnos?.T" class="text-xs text-gray-400 italic">
                            Sin horario
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Crear Horario -->
        <ModalCrearHorario :visible="modalVisible" :medicos="todosMedicos" :areas="areas" @close="modalVisible = false"
            @saved="onHorariosSaved" />

        <!-- Modal Horarios del Médico -->
        <ModalHorariosMedico :visible="modalMedicoVisible" :medico="medicoSeleccionado" @close="cerrarModalMedico"
            @deleted="cargarHorariosFiltrados" />

        <!-- Toast mejorado -->
        <transition enter-active-class="transition ease-out duration-300 transform"
            enter-from-class="opacity-0 translate-y-4 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition ease-in duration-200 transform"
            leave-from-class="opacity-100 translate-y-0 scale-100" leave-to-class="opacity-0 translate-y-4 scale-95">
            <div v-if="showToast" :class="[
                'fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50',
                toastType === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
            ]">
                <CheckCircleIcon v-if="toastType === 'success'" class="w-8 h-8" />
                <XCircleIcon v-else class="w-8 h-8" />
                <span class="font-medium">{{ toastMessage }}</span>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '../../services/api'
import horarioService, { type Horario } from '../../services/horarioService'
import ModalCrearHorario from './ModalCrearHorario.vue'
import ModalHorariosMedico from './ModalHorariosMedico.vue'
import {
    CalendarIcon,
    PlusCircleIcon,
    UsersIcon,
    BuildingOfficeIcon,
    SunIcon,
    MoonIcon,
    TicketIcon,
    FunnelIcon,
    ListBulletIcon,
    Squares2X2Icon,
    ArrowPathIcon,
    PlusIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon,
    CalendarDaysIcon,
    ChevronRightIcon
} from '@heroicons/vue/24/outline'

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const diasSemanaCompletos = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const areas = ref<any[]>([])
const medicos = ref<any[]>([])
const todosMedicos = ref<any[]>([]) // Lista completa para el modal
const horariosList = ref<Horario[]>([])
const filtroAreaId = ref<number | null>(null)
const filtroMedicoId = ref<number | null>(null)
const filtroMes = ref('')
const filtroTurno = ref<'M' | 'T' | null>(null)
const vistaActual = ref<'medicos' | 'tabla' | 'tarjetas' | 'calendario'>('medicos')

// Modal horarios de médico
const modalMedicoVisible = ref(false)
const medicoSeleccionado = ref<any>(null)

const modalVisible = ref(false)
const isLoadingList = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

// Computed properties para estadísticas
const totalCuposManana = computed(() => {
    return horariosList.value
        .filter(h => h.turno === 'M')
        .reduce((sum, h) => sum + h.cupos, 0)
})

const totalCuposTarde = computed(() => {
    return horariosList.value
        .filter(h => h.turno === 'T')
        .reduce((sum, h) => sum + h.cupos, 0)
})

const totalCupos = computed(() => {
    return totalCuposManana.value + totalCuposTarde.value
})

const nombreMedicoSeleccionado = computed(() => {
    const medico = todosMedicos.value.find(m => m.id === filtroMedicoId.value)
    return medico ? medico.name : ''
})

// Computed para vista calendario
const diasDelMes = computed(() => {
    if (!filtroMes.value || !filtroMedicoId.value) return []

    const parts = filtroMes.value.split('-').map(Number)
    if (parts.length < 2 || parts[0] === undefined || parts[1] === undefined) return []
    const year = parts[0]
    const month = parts[1]
    const primerDia = new Date(year, month - 1, 1)
    const ultimoDia = new Date(year, month, 0)
    const diasEnMes = ultimoDia.getDate()

    const dias: any[] = []
    const primerDiaSemana = primerDia.getDay() === 0 ? 6 : primerDia.getDay() - 1

    // Días vacíos al inicio
    for (let i = 0; i < primerDiaSemana; i++) {
        dias.push({ esDelMes: false, numero: '', turnos: {} })
    }

    // Días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
        const fecha = new Date(year, month - 1, dia)
        const fechaStr = `${year}-${String(month).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
        const diaSemana = fecha.getDay() === 0 ? 6 : fecha.getDay() - 1

        // Buscar horarios para este día
        const horariosDelDia = horariosList.value.filter(h => h.fecha === fechaStr)
        const turnos: { M?: Horario, T?: Horario } = {}

        horariosDelDia.forEach(h => {
            if (h.turno === 'M') turnos.M = h
            if (h.turno === 'T') turnos.T = h
        })

        dias.push({
            esDelMes: true,
            numero: dia,
            fecha: fechaStr,
            diaSemana,
            turnos
        })
    }

    return dias
})

// Funciones auxiliares
const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getMedicoHorariosCount = (medicoId: number) => {
    return horariosList.value.filter(h => h.medico_id === medicoId).length
}

const getAreaNombre = (areaId: number | undefined) => {
    if (!areaId) return 'Sin área'
    const area = areas.value.find(a => a.id === areaId)
    return area ? area.nombre : `Área ${areaId}`
}

const getMesNombre = (mes: string) => {
    if (!mes) return ''
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    const [year, month] = mes.split('-').map(Number)
    return `${meses[(month || 1) - 1]} ${year}`
}

const formatearFecha = (fecha: string | undefined) => {
    if (!fecha) return ''
    const date = new Date(fecha + 'T00:00:00')
    return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

const getTurnoBadgeClass = (turno: string) => {
    return turno === 'M'
        ? 'bg-amber-100 text-amber-800'
        : 'bg-indigo-100 text-indigo-800'
}

const limpiarFiltros = () => {
    filtroAreaId.value = null
    filtroMedicoId.value = null
    filtroTurno.value = null
    const hoy = new Date()
    filtroMes.value = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
    fetchMedicos(null)
    cargarHorariosFiltrados()
}

// API calls
const fetchAreas = async () => {
    try {
        const { data } = await api.get('/areas/')
        areas.value = data
    } catch (error) {
        console.error('Error al cargar áreas', error)
    }
}

const fetchMedicos = async (filterAreaId: number | null = null) => {
    try {
        const url = filterAreaId ? `/auth/medicos?area_id=${filterAreaId}` : '/auth/medicos'
        const { data } = await api.get(url)
        // El backend ya devuelve: name, area_id, area_nombre, especialidad
        medicos.value = data

        // Si no hay filtro de área, también actualizamos la lista completa para el modal
        if (!filterAreaId) {
            todosMedicos.value = data
        }
    } catch (error) {
        console.error('Error al cargar médicos', error)
    }
}

const cargarHorariosFiltrados = async () => {
    isLoadingList.value = true
    try {
        const params: any = {}
        if (filtroAreaId.value) params.area_id = filtroAreaId.value
        if (filtroMedicoId.value) params.medico_id = filtroMedicoId.value
        if (filtroMes.value) params.mes = filtroMes.value
        if (filtroTurno.value) params.turno = filtroTurno.value

        const { data } = await horarioService.getHorarios(params)
        horariosList.value = data

        // Filtrar médicos si hay área seleccionada
        if (filtroAreaId.value) {
            await fetchMedicos(filtroAreaId.value)
            if (filtroMedicoId.value) {
                const medicoExiste = medicos.value.find(m => m.id === filtroMedicoId.value)
                if (!medicoExiste) {
                    filtroMedicoId.value = null
                }
            }
        }

    } catch (error) {
        console.error('Error al cargar horarios', error)
        horariosList.value = []
    } finally {
        isLoadingList.value = false
    }
}

const abrirModalHorario = () => {
    modalVisible.value = true
}

// Funciones para modal de horarios del médico
const abrirModalHorariosMedico = (medico: any) => {
    medicoSeleccionado.value = medico
    modalMedicoVisible.value = true
}

const cerrarModalMedico = () => {
    modalMedicoVisible.value = false
    medicoSeleccionado.value = null
}

// Callback cuando se guardan horarios desde el modal
const onHorariosSaved = (result: { creados: number; actualizados: number }) => {
    mostrarToast(`${result.creados} horarios creados, ${result.actualizados} actualizados`, 'success')
    cargarHorariosFiltrados()
}

const eliminarHorario = async (id: number | undefined) => {
    if (!id) return
    if (!confirm('¿Está seguro de eliminar este horario?')) return

    try {
        await horarioService.eliminarHorario(id)
        mostrarToast('Horario eliminado exitosamente', 'success')
        cargarHorariosFiltrados()
    } catch (error) {
        console.error('Error al eliminar horario', error)
        mostrarToast('Error al eliminar horario', 'error')
    }
}

const mostrarToast = (mensaje: string, tipo: 'success' | 'error' = 'success') => {
    toastMessage.value = mensaje
    toastType.value = tipo
    showToast.value = true
    setTimeout(() => {
        showToast.value = false
    }, 3000)
}

onMounted(async () => {
    const hoy = new Date()
    filtroMes.value = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`

    // Cargar áreas primero, luego médicos (para poder mapear area_nombre)
    await fetchAreas()
    await fetchMedicos()
    cargarHorariosFiltrados()
})
</script>