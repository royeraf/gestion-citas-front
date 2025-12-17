<template>
    <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="visible"
            class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            @click.self="cerrar">
            <div ref="modalRef"
                class="bg-white rounded-2xl max-w-2xl w-full shadow-2xl transform transition-all max-h-[90vh] overflow-hidden flex flex-col ring-1 ring-white/10">

                <!-- Header del modal -->
                <div class="relative bg-teal-700 overflow-hidden shrink-0">
                    <div class="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800"></div>
                    <!-- Decoración de fondo -->
                    <div class="absolute -right-6 -top-10 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl"></div>
                    <div class="absolute -left-6 -bottom-10 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl"></div>

                    <div class="relative px-6 py-6 flex justify-between items-start">
                        <div class="flex gap-4 items-center">
                            <div class="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
                                <CalendarDaysIcon class="w-7 h-7 text-teal-50" />
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-white tracking-tight">Programación Mensual</h3>
                                <div class="flex items-center gap-2 text-teal-100/90 text-[13px] font-medium mt-0.5">
                                    <span class="w-1.5 h-1.5 rounded-full bg-teal-300"></span>
                                    Gestiona turnos y cupos disponibles
                                </div>
                            </div>
                        </div>
                        <button @click="cerrar"
                            class="group p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 border border-transparent hover:border-white/20 hover:shadow-lg active:scale-95">
                            <XMarkIcon class="w-5 h-5 text-teal-100 group-hover:text-white transition-colors" />
                        </button>
                    </div>
                </div>

                <!-- Contenido del modal -->
                <div ref="formContainerRef"
                    class="p-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    <form @submit="onSubmit" class="space-y-6">

                        <!-- Sección 1: Datos Básicos -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <!-- Campo Profesional -->
                            <div ref="medicoFieldRef" class="group">
                                <label
                                    class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                                    Profesional <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon
                                            class="h-5 w-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
                                    </div>
                                    <select v-model="medico_id" :class="[
                                        'w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm transition-all duration-200 outline-none appearance-none',
                                        errors.medico_id
                                            ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400'
                                            : 'border-gray-200 hover:border-gray-300 focus:bg-white focus:ring-2 focus:ring-teal-100 focus:border-teal-500'
                                    ]">
                                        <option :value="null">Seleccione un profesional</option>
                                        <option v-for="medico in medicos" :key="medico.id" :value="medico.id">
                                            {{ medico.name }}
                                        </option>
                                    </select>
                                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                                <span v-if="errors.medico_id" class="text-red-500 text-xs mt-1 ml-1 font-medium">{{
                                    errors.medico_id }}</span>
                            </div>

                            <!-- Campo Área -->
                            <div ref="areaFieldRef" class="group">
                                <label
                                    class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                                    Área <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BuildingOfficeIcon
                                            class="h-5 w-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
                                    </div>
                                    <select v-model="area_id" :class="[
                                        'w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm transition-all duration-200 outline-none appearance-none',
                                        errors.area_id
                                            ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400'
                                            : 'border-gray-200 hover:border-gray-300 focus:bg-white focus:ring-2 focus:ring-teal-100 focus:border-teal-500'
                                    ]">
                                        <option :value="null">Seleccione un área</option>
                                        <option v-for="area in areas" :key="area.id" :value="area.id">{{ area.nombre }}
                                        </option>
                                    </select>
                                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                                <span v-if="errors.area_id" class="text-red-500 text-xs mt-1 ml-1 font-medium">{{
                                    errors.area_id }}</span>
                            </div>
                        </div>

                        <!-- Campo Mes -->
                        <div ref="mesFieldRef">
                            <label
                                class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                                Mes de trabajo <span class="text-red-500">*</span>
                            </label>
                            <HsMonthYearPicker v-model="mes" placeholder="Seleccionar mes y año" :required="true"
                                :min-date="minMonthDate" :max-date="maxMonthDate" :error="errors.mes" />
                        </div>

                        <!-- Calendario de Días de Atención -->
                        <div ref="diasFieldRef" class="bg-gray-50/50 rounded-xl p-3 border border-gray-100 shadow-sm">
                            <div class="flex justify-between items-center mb-2">
                                <label
                                    class="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">
                                    <div class="p-1 bg-teal-100 rounded text-teal-600">
                                        <CalendarDaysIcon class="w-3.5 h-3.5" />
                                    </div>
                                    Días de Atención
                                    <span v-if="dias_seleccionados && dias_seleccionados.length > 0"
                                        class="ml-1 px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded text-[10px] font-bold">
                                        {{ dias_seleccionados.length }}
                                    </span>
                                </label>

                                <!-- Tooltip simplificado -->
                                <div class="group relative" title="Arrastra para seleccionar">
                                    <QuestionMarkCircleIcon
                                        class="w-4 h-4 text-gray-300 hover:text-gray-500 cursor-help transition-colors" />
                                </div>
                            </div>

                            <!-- Mensaje si no hay mes seleccionado -->
                            <div v-if="!mes" class="bg-white border text-center rounded-lg p-4 py-6">
                                <CalendarIcon class="w-8 h-8 text-gray-300 mx-auto mb-1" />
                                <p class="text-gray-400 text-xs">Seleccione mes primero</p>
                            </div>

                            <!-- Calendario del mes (compacto) -->
                            <div v-else :class="[
                                'bg-white border rounded-lg p-2 transition-all shadow-sm',
                                errors.dias_seleccionados ? 'border-red-300 ring-2 ring-red-50' : 'border-gray-200 hover:shadow'
                            ]">
                                <!-- Header del calendario -->
                                <div class="flex items-center justify-between mb-2 pb-1 border-b border-gray-50">
                                    <span class="text-xs font-bold text-gray-700 capitalize">{{ nombreMesSeleccionado
                                    }}</span>
                                    <div class="flex items-center gap-1">
                                        <button type="button" @click="seleccionarDiasLaborables"
                                            class="text-[10px] px-1.5 py-0.5 text-gray-500 hover:bg-gray-100 hover:text-teal-600 rounded transition-colors"
                                            title="Lunes a Sábado">
                                            L-S
                                        </button>
                                        <button type="button" @click="seleccionarTodosDias"
                                            class="text-[10px] px-1.5 py-0.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 rounded transition-colors"
                                            title="Todos los días">
                                            Todo
                                        </button>
                                        <button type="button" @click="limpiarDias"
                                            class="text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded p-0.5 transition-colors"
                                            title="Limpiar selección">
                                            <TrashIcon class="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <!-- Encabezados de días -->
                                <div class="grid grid-cols-7 gap-0.5 mb-1">
                                    <div v-for="dia in diasSemanaLabels" :key="dia"
                                        class="text-center text-[10px] text-gray-400 font-bold py-0.5">
                                        {{ dia.charAt(0) }}
                                    </div>
                                </div>

                                <!-- Grilla del calendario -->
                                <div class="grid grid-cols-7 gap-y-1 gap-x-0.5 select-none" @mouseleave="stopDrag">
                                    <button v-for="(diaInfo, index) in diasCalendario" :key="index" type="button"
                                        :disabled="!diaInfo.esDelMes"
                                        @mousedown.prevent="diaInfo.esDelMes && handleMouseDown(diaInfo.fecha, diaInfo.seleccionado)"
                                        @mouseenter="diaInfo.esDelMes && handleMouseEnter(diaInfo.fecha)" :class="[
                                            'w-8 h-8 mx-auto rounded-lg text-xs font-bold transition-all duration-75 flex items-center justify-center relative',
                                            !diaInfo.esDelMes
                                                ? 'invisible h-0' // Ocultar celdas vacías completamente
                                                : diaInfo.seleccionado
                                                    ? 'bg-teal-600 text-white shadow-sm z-10 scale-105'
                                                    : 'text-gray-700 hover:bg-gray-100 bg-white border border-transparent hover:border-gray-200',
                                            diaInfo.esHoy && !diaInfo.seleccionado ? 'ring-1 ring-amber-400 text-amber-600 bg-amber-50' : ''
                                        ]">
                                        {{ diaInfo.numero }}

                                        <!-- Indicador de hoy (punto) -->
                                        <span v-if="diaInfo.esHoy"
                                            :class="['absolute top-0.5 right-0.5 w-1 h-1 rounded-full', diaInfo.seleccionado ? 'bg-white' : 'bg-amber-500']">
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <span v-if="errors.dias_seleccionados"
                                class="text-red-500 text-[10px] mt-1 flex items-center gap-1 font-medium bg-red-50 p-1 rounded border border-red-100">
                                <ExclamationCircleIcon class="w-3 h-3" /> {{ errors.dias_seleccionados }}
                            </span>
                        </div>

                        <!-- Configuración de Turnos -->
                        <div ref="turnosFieldRef" class="space-y-4">
                            <label
                                class="block text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                Configuración de Turnos <span class="text-red-500">*</span>
                            </label>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- Turno Mañana -->
                                <div :class="[
                                    'relative overflow-hidden rounded-2xl border transition-all duration-300 group',
                                    turnoMananaActivo
                                        ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-md shadow-amber-100'
                                        : 'border-gray-200 bg-gray-50 opacity-80 hover:opacity-100 hover:border-gray-300'
                                ]">
                                    <div class="p-4 relative z-10">
                                        <div class="flex items-center justify-between mb-4">
                                            <div class="flex items-center gap-3">
                                                <div
                                                    :class="['w-10 h-10 rounded-xl flex items-center justify-center ring-4 transition-all duration-300', turnoMananaActivo ? 'bg-amber-500 text-white ring-amber-100 rotate-3' : 'bg-gray-200 text-gray-400 ring-transparent']">
                                                    <SunIcon class="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4
                                                        :class="['font-bold text-sm', turnoMananaActivo ? 'text-gray-800' : 'text-gray-500']">
                                                        Mañana</h4>
                                                    <p class="text-xs text-gray-500 font-medium">07:30 - 13:30</p>
                                                </div>
                                            </div>

                                            <!-- Switch Moderno -->
                                            <label class="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" v-model="turnoMananaActivo" class="sr-only peer">
                                                <div
                                                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-amber-500">
                                                </div>
                                            </label>
                                        </div>

                                        <div v-if="turnoMananaActivo"
                                            class="flex items-center gap-3 animate-fade-in-up">
                                            <div class="flex-1">
                                                <label
                                                    class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Cupos
                                                    por día</label>
                                                <div class="flex items-center">
                                                    <input type="number" v-model.number="turnoMananaCupos" min="1"
                                                        max="50"
                                                        class="w-full px-3 py-1.5 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-amber-400 text-center font-bold text-gray-700 bg-white" />
                                                </div>
                                            </div>
                                            <div class="flex flex-col items-end justify-end pb-1">
                                                <span class="text-xs font-semibold text-amber-600">
                                                    {{ contarDiasLaborables() * turnoMananaCupos }}
                                                </span>
                                                <span class="text-[10px] text-gray-400">Total</span>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Decoración -->
                                    <div v-if="turnoMananaActivo"
                                        class="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none">
                                    </div>
                                </div>

                                <!-- Turno Tarde -->
                                <div :class="[
                                    'relative overflow-hidden rounded-2xl border transition-all duration-300 group',
                                    turnoTardeActivo
                                        ? 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-white shadow-md shadow-indigo-100'
                                        : 'border-gray-200 bg-gray-50 opacity-80 hover:opacity-100 hover:border-gray-300'
                                ]">
                                    <div class="p-4 relative z-10">
                                        <div class="flex items-center justify-between mb-4">
                                            <div class="flex items-center gap-3">
                                                <div
                                                    :class="['w-10 h-10 rounded-xl flex items-center justify-center ring-4 transition-all duration-300', turnoTardeActivo ? 'bg-indigo-500 text-white ring-indigo-100 -rotate-3' : 'bg-gray-200 text-gray-400 ring-transparent']">
                                                    <MoonIcon class="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4
                                                        :class="['font-bold text-sm', turnoTardeActivo ? 'text-gray-800' : 'text-gray-500']">
                                                        Tarde</h4>
                                                    <p class="text-xs text-gray-500 font-medium">13:30 - 19:30</p>
                                                </div>
                                            </div>

                                            <!-- Switch Moderno -->
                                            <label class="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" v-model="turnoTardeActivo" class="sr-only peer">
                                                <div
                                                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-indigo-500">
                                                </div>
                                            </label>
                                        </div>

                                        <div v-if="turnoTardeActivo" class="flex items-center gap-3 animate-fade-in-up">
                                            <div class="flex-1">
                                                <label
                                                    class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Cupos
                                                    por día</label>
                                                <div class="flex items-center">
                                                    <input type="number" v-model.number="turnoTardeCupos" min="1"
                                                        max="50"
                                                        class="w-full px-3 py-1.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 text-center font-bold text-gray-700 bg-white" />
                                                </div>
                                            </div>
                                            <div class="flex flex-col items-end justify-end pb-1">
                                                <span class="text-xs font-semibold text-indigo-600">
                                                    {{ contarDiasLaborables() * turnoTardeCupos }}
                                                </span>
                                                <span class="text-[10px] text-gray-400">Total</span>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Decoración -->
                                    <div v-if="turnoTardeActivo"
                                        class="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none">
                                    </div>
                                </div>
                            </div>

                            <span v-if="errors.turnos"
                                class="text-red-500 text-xs mt-1 block flex items-center gap-1 font-medium bg-red-50 p-2 rounded-lg border border-red-100 justify-center">
                                <ExclamationTriangleIcon class="w-4 h-4" />
                                {{ errors.turnos }}
                            </span>
                        </div>

                        <!-- Resumen visual (Footer sticky) -->
                        <div v-if="dias_seleccionados.length > 0 && mes && (turnoMananaActivo || turnoTardeActivo)"
                            class="bg-slate-900 text-white rounded-2xl p-4 shadow-xl shadow-slate-200 relative overflow-hidden group">
                            <!-- Brillo de fondo -->
                            <div
                                class="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full -translate-y-32 translate-x-16 blur-3xl group-hover:bg-teal-500/30 transition-colors duration-500">
                            </div>

                            <div class="flex items-center justify-between relative z-10">
                                <div>
                                    <h4 class="font-bold text-sm text-slate-200 mb-1 flex items-center gap-2">
                                        <ChartBarIcon class="w-4 h-4 text-teal-400" /> Resumen Total
                                    </h4>
                                    <div class="flex gap-4 text-xs">
                                        <div class="flex items-center gap-1.5 text-slate-400">
                                            <CalendarIcon class="w-3.5 h-3.5" />
                                            <span><strong class="text-white">{{ contarDiasLaborables() }}</strong>
                                                días</span>
                                        </div>
                                        <div class="flex items-center gap-1.5 text-slate-400">
                                            <UserGroupIcon class="w-3.5 h-3.5" />
                                            <span><strong class="text-teal-300 text-lg">{{ calcularTotalCupos()
                                                    }}</strong> citas</span>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" :disabled="loading"
                                    class="bg-white text-slate-900 hover:bg-teal-50 disabled:bg-slate-700 disabled:text-slate-500 font-bold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-black/20 transform active:scale-95 group-hover:translate-x-1"
                                    @click="onSubmit">
                                    <ArrowPathIcon v-if="loading" class="w-5 h-5 animate-spin" />
                                    <span v-else>Crear Horarios</span>
                                    <ArrowRightIcon v-if="!loading" class="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <!-- Fallback button si no hay resumen visible -->
                        <div v-else class="flex gap-3 pt-2">
                            <button type="submit" :disabled="loading"
                                class="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                @click="onSubmit">
                                <ArrowPathIcon v-if="loading" class="w-5 h-5 animate-spin" />
                                <CheckCircleIcon v-else class="w-5 h-5" />
                                {{ loading ? 'Guardando...' : 'Crear Horarios' }}
                            </button>
                            <button type="button" @click="cerrar"
                                class="px-6 py-3.5 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-bold rounded-xl transition-colors">
                                Cancelar
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import horarioService from '../../services/horarioService'
import HsMonthYearPicker from '../common/HsMonthYearPicker.vue'
import {
    CalendarIcon,
    XMarkIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    UserIcon,
    BuildingOfficeIcon,
    SunIcon,
    MoonIcon,
    TicketIcon,
    ExclamationTriangleIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    ArrowRightIcon,
    QuestionMarkCircleIcon,
    TrashIcon,
    UserGroupIcon,
    ExclamationCircleIcon,
    ClockIcon
} from '@heroicons/vue/24/solid'

interface Props {
    visible: boolean
    medicos: any[]
    areas: any[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'saved', result: { creados: number; actualizados: number }): void
}>()

// Refs for scroll
const medicoFieldRef = ref<HTMLElement | null>(null)
const areaFieldRef = ref<HTMLElement | null>(null)
const mesFieldRef = ref<HTMLElement | null>(null)
const diasFieldRef = ref<HTMLElement | null>(null)
const turnosFieldRef = ref<HTMLElement | null>(null)

const diasSemanaLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const loading = ref(false)

// Esquema de validación con Yup
const validationSchema = yup.object({
    medico_id: yup.number()
        .nullable()
        .required('Seleccione un profesional')
        .typeError('Seleccione un profesional'),
    area_id: yup.number()
        .nullable()
        .required('Seleccione un área')
        .typeError('Seleccione un área'),
    mes: yup.string()
        .required('Seleccione un mes')
        .matches(/^\d{4}-\d{2}$/, 'Formato de mes inválido'),
    dias_seleccionados: yup.array()
        .of(yup.string())
        .min(1, 'Seleccione al menos un día de atención'),
    turnos: yup.boolean()
        .test('al-menos-un-turno', 'Debe activar al menos un turno (mañana o tarde)', function () {
            const { turnoMananaActivo, turnoTardeActivo } = this.parent
            return turnoMananaActivo || turnoTardeActivo
        }),
    turnoMananaActivo: yup.boolean(),
    turnoTardeActivo: yup.boolean(),
    turnoMananaCupos: yup.number().min(1).max(50),
    turnoTardeCupos: yup.number().min(1).max(50)
})

// Configuración de vee-validate
const { handleSubmit, errors, defineField, resetForm, setFieldValue } = useForm({
    validationSchema,
    initialValues: {
        medico_id: null as number | null,
        area_id: null as number | null,
        mes: '',
        dias_seleccionados: [] as string[],
        turnos: true,
        turnoMananaActivo: true,
        turnoTardeActivo: true,
        turnoMananaCupos: 7,
        turnoTardeCupos: 7
    }
})

// Definir campos reactivos
const [medico_id] = defineField('medico_id')
const [area_id] = defineField('area_id')
const [mes] = defineField('mes')
const [dias_seleccionados] = defineField('dias_seleccionados')
const [turnoMananaActivo] = defineField('turnoMananaActivo')
const [turnoTardeActivo] = defineField('turnoTardeActivo')
const [turnoMananaCupos] = defineField('turnoMananaCupos')
const [turnoTardeCupos] = defineField('turnoTardeCupos')

// Computed para limitar fechas del picker
const minMonthDate = computed(() => {
    const hoy = new Date()
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
})

const maxMonthDate = computed(() => {
    const hoy = new Date()
    const futuro = new Date(hoy.getFullYear() + 1, hoy.getMonth(), 1)
    return `${futuro.getFullYear()}-${String(futuro.getMonth() + 1).padStart(2, '0')}`
})

// Nombres de meses para mostrar
const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

// Computed para mostrar el nombre del mes seleccionado
const nombreMesSeleccionado = computed(() => {
    if (!mes.value) return ''
    const parts = mes.value.split('-')
    if (parts.length < 2) return mes.value
    const year = parseInt(parts[0]!)
    const monthIndex = parseInt(parts[1]!) - 1
    return `${nombresMeses[monthIndex]} ${year}`
})

// Interface para los días del calendario
interface DiaCalendario {
    numero: number
    fecha: string
    esDelMes: boolean
    seleccionado: boolean
    esHoy: boolean
}

// Computed para generar la grilla del calendario
const diasCalendario = computed((): DiaCalendario[] => {
    if (!mes.value) return []

    const parts = mes.value.split('-')
    if (parts.length < 2) return []

    const year = parseInt(parts[0]!)
    const month = parseInt(parts[1]!) - 1

    const primerDia = new Date(year, month, 1)
    const ultimoDia = new Date(year, month + 1, 0)
    const diasEnMes = ultimoDia.getDate()

    const hoy = new Date()
    const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`

    const dias: DiaCalendario[] = []
    // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    // Ajustar para que semana empiece en Lunes (0) hasta Domingo (6)
    let primerDiaSemana = primerDia.getDay() - 1
    if (primerDiaSemana === -1) primerDiaSemana = 6

    // Días vacíos al inicio
    for (let i = 0; i < primerDiaSemana; i++) {
        dias.push({
            numero: 0,
            fecha: '',
            esDelMes: false,
            seleccionado: false,
            esHoy: false
        })
    }

    // Días del mes actual
    for (let dia = 1; dia <= diasEnMes; dia++) {
        const fecha = `${year}-${String(month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
        dias.push({
            numero: dia,
            fecha,
            esDelMes: true,
            seleccionado: dias_seleccionados.value?.includes(fecha) || false,
            esHoy: fecha === hoyStr
        })
    }

    // Rellenar solo hasta completar la última semana (múltiplo de 7)
    const totalDias = dias.length
    const diasFaltantes = (7 - (totalDias % 7)) % 7

    for (let i = 0; i < diasFaltantes; i++) {
        dias.push({
            numero: 0,
            fecha: '',
            esDelMes: false,
            seleccionado: false,
            esHoy: false
        })
    }

    return dias
})

// Variables para control de selección por arrastre
const isDragging = ref(false)
const dragMode = ref(true) // true = seleccionando, false = deseleccionando

// Iniciar arrastre
const handleMouseDown = (fecha: string, estadoActual: boolean) => {
    isDragging.value = true
    dragMode.value = !estadoActual
    toggleDia(fecha, dragMode.value)

    // Agregar event listener global para soltar el click fuera del componente
    window.addEventListener('mouseup', stopDrag)
}

// Mover mouse sobre día (durante arrastre)
const handleMouseEnter = (fecha: string) => {
    if (isDragging.value) {
        toggleDia(fecha, dragMode.value)
    }
}

// Detener arrastre
const stopDrag = () => {
    isDragging.value = false
    window.removeEventListener('mouseup', stopDrag)
}

// Función para modificar la selección de un día (modificada para soportar modo forzado)
const toggleDia = (fecha: string, forceState?: boolean) => {
    if (!fecha) return

    const actuales = [...(dias_seleccionados.value || [])]
    const index = actuales.indexOf(fecha)
    const estaSeleccionado = index >= 0

    // Si se especifica forceState, usamos ese estado
    // Si no, invertimos el estado actual
    const nuevoEstado = forceState !== undefined ? forceState : !estaSeleccionado

    if (nuevoEstado && !estaSeleccionado) {
        actuales.push(fecha)
        setFieldValue('dias_seleccionados', actuales)
    } else if (!nuevoEstado && estaSeleccionado) {
        actuales.splice(index, 1)
        setFieldValue('dias_seleccionados', actuales)
    }
}

// Funciones de selección de días
const seleccionarDiasLaborables = () => {
    if (!mes.value) return

    const parts = mes.value.split('-')
    if (parts.length < 2) return

    const year = parseInt(parts[0]!)
    const month = parseInt(parts[1]!) - 1
    const ultimoDia = new Date(year, month + 1, 0).getDate()

    const diasLaborables: string[] = []

    for (let dia = 1; dia <= ultimoDia; dia++) {
        const fecha = new Date(year, month, dia)
        const diaSemana = fecha.getDay()
        // Lunes (1) a Sábado (6)
        if (diaSemana >= 1 && diaSemana <= 6) {
            diasLaborables.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`)
        }
    }

    setFieldValue('dias_seleccionados', diasLaborables)
}

const seleccionarTodosDias = () => {
    if (!mes.value) return

    const parts = mes.value.split('-')
    if (parts.length < 2) return

    const year = parseInt(parts[0]!)
    const month = parseInt(parts[1]!) - 1
    const ultimoDia = new Date(year, month + 1, 0).getDate()

    const todosDias: string[] = []

    for (let dia = 1; dia <= ultimoDia; dia++) {
        todosDias.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`)
    }

    setFieldValue('dias_seleccionados', todosDias)
}

const limpiarDias = () => {
    setFieldValue('dias_seleccionados', [])
}

// Función para hacer scroll al primer campo con error
const scrollToFirstError = async () => {
    await nextTick()

    const errorFields = [
        { key: 'medico_id', ref: medicoFieldRef },
        { key: 'area_id', ref: areaFieldRef },
        { key: 'mes', ref: mesFieldRef },
        { key: 'dias_seleccionados', ref: diasFieldRef },
        { key: 'turnos', ref: turnosFieldRef }
    ]

    for (const field of errorFields) {
        if (errors.value[field.key as keyof typeof errors.value] && field.ref.value) {
            field.ref.value.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })

            // Agregar efecto de destello
            field.ref.value.classList.add('animate-pulse')
            setTimeout(() => {
                field.ref.value?.classList.remove('animate-pulse')
            }, 1500)

            break
        }
    }
}

// Contar días seleccionados
const contarDiasLaborables = () => {
    return dias_seleccionados.value?.length || 0
}

const calcularTotalCupos = () => {
    const dias = contarDiasLaborables()
    let total = 0
    if (turnoMananaActivo.value) {
        total += dias * (turnoMananaCupos.value || 0)
    }
    if (turnoTardeActivo.value) {
        total += dias * (turnoTardeCupos.value || 0)
    }
    return total
}

const cerrar = () => {
    emit('close')
}

// Handler de submit con vee-validate
const onSubmit = handleSubmit(async (values) => {
    loading.value = true
    try {
        const payload = {
            medico_id: values.medico_id!,
            area_id: values.area_id!,
            mes: values.mes,
            dias_seleccionados: values.dias_seleccionados,
            turnos: {
                manana: { activo: values.turnoMananaActivo, cupos: values.turnoMananaCupos },
                tarde: { activo: values.turnoTardeActivo, cupos: values.turnoTardeCupos }
            }
        }

        const { data } = await horarioService.crearHorariosMensuales(payload)

        // Emitir evento con resultados y posibles advertencias
        emit('saved', {
            creados: data.creados,
            actualizados: data.actualizados,
            advertencias: data.advertencias
        })

        cerrar()
    } catch (error: any) {
        console.error('Error al guardar horarios', error)
        throw error
    } finally {
        loading.value = false
    }
}, () => {
    // Callback cuando hay errores de validación
    scrollToFirstError()
})

// Reset form cuando el modal se abre
watch(() => props.visible, (newVal) => {
    if (newVal) {
        const hoy = new Date()
        resetForm({
            values: {
                medico_id: null,
                area_id: null,
                mes: `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`,
                dias_seleccionados: [],
                turnos: true,
                turnoMananaActivo: true,
                turnoTardeActivo: true,
                turnoMananaCupos: 7,
                turnoTardeCupos: 7
            }
        })
    }
})

// Validar turnos cuando cambian
watch([turnoMananaActivo, turnoTardeActivo], () => {
    setFieldValue('turnos', turnoMananaActivo.value || turnoTardeActivo.value)
})
</script>

<style scoped>
/* Scrollbar personalizado */
.scrollbar-thin::-webkit-scrollbar {
    width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 20px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
}

/* Animaciones */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.3s ease-out forwards;
}
</style>
