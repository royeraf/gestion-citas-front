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
            <div class="flex items-center gap-2 mb-4">
                <FunnelIcon class="w-5 h-5 text-teal-600" />
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

            <div v-if="horariosList.length > 0" class="text-sm text-gray-500">
                {{ horariosList.length }} horario{{ horariosList.length !== 1 ? 's' : '' }} encontrado{{
                    horariosList.length !== 1 ? 's' : '' }}
            </div>
        </div>

        <!-- Vista de Tabla -->
        <div v-if="vistaActual === 'tabla'" class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div v-if="isLoadingList" class="flex items-center justify-center py-12">
                <div class="flex flex-col items-center">
                    <ArrowPathIcon class="w-10 h-10 animate-spin text-teal-600" />
                    <p class="mt-3 text-gray-500 font-medium">Cargando horarios...</p>
                </div>
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
            <div v-if="isLoadingList" class="col-span-full flex items-center justify-center py-12">
                <div class="flex flex-col items-center">
                    <ArrowPathIcon class="w-10 h-10 animate-spin text-teal-600" />
                    <p class="mt-3 text-gray-500 font-medium">Cargando horarios...</p>
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

        <!-- Modal Configurar Horario Mensual -->
        <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="modalVisible"
                class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                @click.self="cerrarModal">
                <div
                    class="bg-white rounded-2xl max-w-2xl w-full shadow-2xl transform transition-all max-h-[90vh] overflow-hidden flex flex-col">

                    <!-- Header del modal -->
                    <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white">
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="text-xl font-bold">Configurar Horario Mensual</h3>
                                <p class="text-teal-100 text-sm mt-1">Programa los turnos del médico para el mes</p>
                            </div>
                            <button @click="cerrarModal"
                                class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
                                <XMarkIcon class="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>

                    <!-- Contenido del modal -->
                    <div class="p-6 overflow-y-auto flex-1">
                        <form @submit.prevent="guardarHorarioMensual" class="space-y-5">
                            <!-- Step indicator -->
                            <div class="flex items-center justify-center gap-2 mb-6">
                                <div class="flex items-center gap-2 text-sm">
                                    <span
                                        class="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center font-semibold text-xs">1</span>
                                    <span class="text-teal-700 font-medium">Médico</span>
                                </div>
                                <div class="w-8 h-0.5 bg-gray-300"></div>
                                <div class="flex items-center gap-2 text-sm">
                                    <span
                                        class="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center font-semibold text-xs">2</span>
                                    <span class="text-teal-700 font-medium">Días</span>
                                </div>
                                <div class="w-8 h-0.5 bg-gray-300"></div>
                                <div class="flex items-center gap-2 text-sm">
                                    <span
                                        class="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center font-semibold text-xs">3</span>
                                    <span class="text-teal-700 font-medium">Turnos</span>
                                </div>
                            </div>

                            <!-- Médico y Área -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                        <UserIcon class="w-4 h-4 text-teal-600" />
                                        Médico <span class="text-red-500">*</span>
                                    </label>
                                    <select v-model="form.medico_id" required
                                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition">
                                        <option :value="null">Seleccione un médico</option>
                                        <option v-for="medico in todosMedicos" :key="medico.id" :value="medico.id">
                                            {{ medico.name }}
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                        <BuildingOfficeIcon class="w-4 h-4 text-teal-600" />
                                        Área <span class="text-red-500">*</span>
                                    </label>
                                    <select v-model="form.area_id" required
                                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition">
                                        <option :value="null">Seleccione un área</option>
                                        <option v-for="area in areas" :key="area.id" :value="area.id">{{ area.nombre
                                        }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <!-- Mes -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                    <CalendarIcon class="w-4 h-4 text-teal-600" />
                                    Mes <span class="text-red-500">*</span>
                                </label>
                                <input type="month" v-model="form.mes" required
                                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition" />
                            </div>

                            <!-- Días de la semana -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
                                    <CalendarDaysIcon class="w-4 h-4 text-teal-600" />
                                    Días de Atención <span class="text-red-500">*</span>
                                </label>
                                <div class="grid grid-cols-4 md:grid-cols-7 gap-2">
                                    <label v-for="(dia, index) in diasSemana" :key="index" :class="[
                                        'flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all',
                                        form.dias_seleccionados.includes(index)
                                            ? 'bg-teal-50 border-teal-500 text-teal-700'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    ]">
                                        <input type="checkbox" :value="index" v-model="form.dias_seleccionados"
                                            class="sr-only" />
                                        <span class="font-bold text-lg">{{ dia }}</span>
                                        <CheckCircleIcon v-if="form.dias_seleccionados.includes(index)"
                                            class="w-5 h-5 text-teal-600 mt-1" />
                                        <div v-else class="w-5 h-5 rounded-full border-2 border-gray-300 mt-1"></div>
                                    </label>
                                </div>
                                <div class="flex gap-2 mt-3">
                                    <button type="button" @click="seleccionarDiasLaborables"
                                        class="text-xs text-teal-600 hover:text-teal-700 font-medium">
                                        Lun-Vie
                                    </button>
                                    <span class="text-gray-300">|</span>
                                    <button type="button" @click="seleccionarTodosDias"
                                        class="text-xs text-teal-600 hover:text-teal-700 font-medium">
                                        Todos
                                    </button>
                                    <span class="text-gray-300">|</span>
                                    <button type="button" @click="form.dias_seleccionados = []"
                                        class="text-xs text-gray-500 hover:text-gray-700 font-medium">
                                        Ninguno
                                    </button>
                                </div>
                            </div>

                            <!-- Configuración de Turnos -->
                            <div class="space-y-4">
                                <label class="block text-sm font-semibold text-gray-700 flex items-center gap-1">
                                    <ClockIcon class="w-4 h-4 text-teal-600" />
                                    Configuración de Turnos
                                </label>

                                <!-- Turno Mañana -->
                                <div :class="[
                                    'border-2 rounded-xl p-4 transition-all',
                                    form.turnos.manana.activo
                                        ? 'border-amber-400 bg-amber-50'
                                        : 'border-gray-200 bg-gray-50'
                                ]">
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                                <SunIcon class="w-6 h-6 text-amber-600" />
                                            </div>
                                            <div>
                                                <h4 class="font-semibold text-gray-800">Turno Mañana</h4>
                                                <p class="text-sm text-gray-500">07:30 - 13:30</p>
                                            </div>
                                        </div>
                                        <label class="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" v-model="form.turnos.manana.activo"
                                                class="sr-only peer">
                                            <div
                                                class="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500">
                                            </div>
                                        </label>
                                    </div>

                                    <div v-if="form.turnos.manana.activo" class="flex items-center gap-3">
                                        <label class="text-sm text-gray-600">Cupos:</label>
                                        <input type="number" v-model.number="form.turnos.manana.cupos" min="1" max="50"
                                            class="w-20 px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-center font-semibold" />
                                        <span class="text-sm text-gray-500">citas disponibles</span>
                                    </div>
                                </div>

                                <!-- Turno Tarde -->
                                <div :class="[
                                    'border-2 rounded-xl p-4 transition-all',
                                    form.turnos.tarde.activo
                                        ? 'border-indigo-400 bg-indigo-50'
                                        : 'border-gray-200 bg-gray-50'
                                ]">
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <MoonIcon class="w-6 h-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h4 class="font-semibold text-gray-800">Turno Tarde</h4>
                                                <p class="text-sm text-gray-500">13:30 - 19:30</p>
                                            </div>
                                        </div>
                                        <label class="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" v-model="form.turnos.tarde.activo"
                                                class="sr-only peer">
                                            <div
                                                class="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500">
                                            </div>
                                        </label>
                                    </div>

                                    <div v-if="form.turnos.tarde.activo" class="flex items-center gap-3">
                                        <label class="text-sm text-gray-600">Cupos:</label>
                                        <input type="number" v-model.number="form.turnos.tarde.cupos" min="1" max="50"
                                            class="w-20 px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-center font-semibold" />
                                        <span class="text-sm text-gray-500">citas disponibles</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Resumen visual -->
                            <div v-if="form.dias_seleccionados.length > 0 && form.mes && (form.turnos.manana.activo || form.turnos.tarde.activo)"
                                class="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-xl p-4">
                                <h4 class="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                    <InformationCircleIcon class="w-5 h-5" />
                                    Resumen de Configuración
                                </h4>
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <CalendarIcon class="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p class="text-gray-500 text-xs">Días</p>
                                            <p class="font-bold text-blue-800">{{ contarDiasLaborables() }}</p>
                                        </div>
                                    </div>
                                    <div v-if="form.turnos.manana.activo" class="flex items-center gap-2">
                                        <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                            <SunIcon class="w-4 h-4 text-amber-600" />
                                        </div>
                                        <div>
                                            <p class="text-gray-500 text-xs">Mañana</p>
                                            <p class="font-bold text-amber-800">{{ contarDiasLaborables() *
                                                form.turnos.manana.cupos }} cupos</p>
                                        </div>
                                    </div>
                                    <div v-if="form.turnos.tarde.activo" class="flex items-center gap-2">
                                        <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <MoonIcon class="w-4 h-4 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p class="text-gray-500 text-xs">Tarde</p>
                                            <p class="font-bold text-indigo-800">{{ contarDiasLaborables() *
                                                form.turnos.tarde.cupos }} cupos</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                                            <TicketIcon class="w-4 h-4 text-teal-600" />
                                        </div>
                                        <div>
                                            <p class="text-gray-500 text-xs">Total</p>
                                            <p class="font-bold text-teal-800">{{ calcularTotalCuposForm() }} cupos</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-3 pt-3 border-t border-blue-200">
                                    <p class="text-xs text-blue-700">
                                        <strong>Días:</strong> {{form.dias_seleccionados.map(d =>
                                            diasSemana[d]).join(', ')}}
                                    </p>
                                </div>
                            </div>

                            <!-- Validación: al menos un turno activo -->
                            <div v-if="!form.turnos.manana.activo && !form.turnos.tarde.activo"
                                class="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm flex items-center gap-2">
                                <ExclamationTriangleIcon class="w-5 h-5" />
                                Debe activar al menos un turno (mañana o tarde)
                            </div>

                            <!-- Botones -->
                            <div class="flex gap-3 pt-2">
                                <button type="submit"
                                    :disabled="isLoading || form.dias_seleccionados.length === 0 || (!form.turnos.manana.activo && !form.turnos.tarde.activo)"
                                    class="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                                    <ArrowPathIcon v-if="isLoading" class="w-5 h-5 animate-spin" />
                                    <CheckCircleIcon v-else class="w-5 h-5" />
                                    {{ isLoading ? 'Guardando...' : 'Crear Horarios' }}
                                </button>
                                <button type="button" @click="cerrarModal"
                                    class="px-6 py-3 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl transition">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </transition>

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
import {
    CalendarIcon,
    PlusCircleIcon,
    UsersIcon,
    BuildingOfficeIcon,
    SunIcon,
    MoonIcon,
    TicketIcon,
    FunnelIcon,
    UserIcon,
    ClockIcon,
    XMarkIcon,
    ListBulletIcon,
    Squares2X2Icon,
    ArrowPathIcon,
    PlusIcon,
    TrashIcon,
    CheckCircleIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
    CalendarDaysIcon
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
const vistaActual = ref<'tabla' | 'tarjetas' | 'calendario'>('tabla')

const modalVisible = ref(false)
const isLoading = ref(false)
const isLoadingList = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

// Estructura del formulario con turnos
const form = ref({
    medico_id: null as number | null,
    area_id: null as number | null,
    mes: '',
    dias_seleccionados: [] as number[],
    turnos: {
        manana: {
            activo: true,
            cupos: 5
        },
        tarde: {
            activo: true,
            cupos: 7
        }
    }
})

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

const contarDiasLaborables = () => {
    if (!form.value.mes || form.value.dias_seleccionados.length === 0) return 0

    const parts = form.value.mes.split('-').map(Number)
    if (parts.length < 2 || parts[0] === undefined || parts[1] === undefined) return 0
    const year = parts[0]
    const month = parts[1]
    const ultimoDia = new Date(year, month, 0).getDate()
    let contador = 0

    for (let dia = 1; dia <= ultimoDia; dia++) {
        const fecha = new Date(year, month - 1, dia)
        const diaSemana = fecha.getDay() === 0 ? 6 : fecha.getDay() - 1
        if (form.value.dias_seleccionados.includes(diaSemana)) {
            contador++
        }
    }

    return contador
}

const calcularTotalCuposForm = () => {
    const dias = contarDiasLaborables()
    let total = 0
    if (form.value.turnos.manana.activo) {
        total += dias * form.value.turnos.manana.cupos
    }
    if (form.value.turnos.tarde.activo) {
        total += dias * form.value.turnos.tarde.cupos
    }
    return total
}

const seleccionarDiasLaborables = () => {
    form.value.dias_seleccionados = [0, 1, 2, 3, 4]
}

const seleccionarTodosDias = () => {
    form.value.dias_seleccionados = [0, 1, 2, 3, 4, 5, 6]
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

const fetchMedicos = async (areaId: number | null = null) => {
    try {
        const url = areaId ? `/auth/medicos?area_id=${areaId}` : '/auth/medicos'
        const { data } = await api.get(url)
        const mappedMedicos = data.map((medico: any) => ({
            ...medico,
            name: medico.nombres_completos
        }))
        medicos.value = mappedMedicos

        // Si no hay filtro de área, también actualizamos la lista completa para el modal
        if (!areaId) {
            todosMedicos.value = mappedMedicos
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
    const hoy = new Date()
    const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`

    form.value = {
        medico_id: null,
        area_id: null,
        mes: mesActual,
        dias_seleccionados: [0, 1, 2, 3, 4],
        turnos: {
            manana: {
                activo: true,
                cupos: 5
            },
            tarde: {
                activo: true,
                cupos: 7
            }
        }
    }
}

const cerrarModal = () => {
    modalVisible.value = false
}

const guardarHorarioMensual = async () => {
    if (!form.value.medico_id || !form.value.area_id || form.value.dias_seleccionados.length === 0) return
    if (!form.value.turnos.manana.activo && !form.value.turnos.tarde.activo) return

    isLoading.value = true
    try {
        const payload = {
            medico_id: form.value.medico_id,
            area_id: form.value.area_id,
            mes: form.value.mes,
            dias_seleccionados: form.value.dias_seleccionados,
            turnos: form.value.turnos
        }

        const { data } = await horarioService.crearHorariosMensuales(payload)

        mostrarToast(`${data.creados} horarios creados, ${data.actualizados} actualizados`, 'success')
        cerrarModal()
        cargarHorariosFiltrados()
    } catch (error: any) {
        console.error('Error al guardar horarios', error)
        const mensaje = error.response?.data?.error || 'Error al guardar los horarios'
        mostrarToast(mensaje, 'error')
    } finally {
        isLoading.value = false
    }
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

onMounted(() => {
    fetchAreas()
    fetchMedicos()
    const hoy = new Date()
    filtroMes.value = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
    cargarHorariosFiltrados()
})
</script>