<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="visible"
            class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            @click.self="cerrar">
            <div
                class="bg-white rounded-2xl max-w-2xl w-full shadow-2xl transform transition-all max-h-[90vh] overflow-hidden flex flex-col">

                <!-- Header del modal -->
                <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-xl font-bold">Configurar Horario Mensual</h3>
                            <p class="text-teal-100 text-sm mt-1">Programa los turnos del médico para el mes</p>
                        </div>
                        <button @click="cerrar"
                            class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
                            <XMarkIcon class="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                <!-- Contenido del modal -->
                <div class="p-6 overflow-y-auto flex-1">
                    <form @submit.prevent="guardar" class="space-y-5">
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
                                <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                    <UserIcon class="w-4 h-4 text-teal-600" />
                                    Médico <span class="text-red-500">*</span>
                                </label>
                                <select v-model="form.medico_id" required
                                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition">
                                    <option :value="null">Seleccione un médico</option>
                                    <option v-for="medico in medicos" :key="medico.id" :value="medico.id">
                                        {{ medico.name }}
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                    <BuildingOfficeIcon class="w-4 h-4 text-teal-600" />
                                    Área <span class="text-red-500">*</span>
                                </label>
                                <select v-model="form.area_id" required
                                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition">
                                    <option :value="null">Seleccione un área</option>
                                    <option v-for="area in areas" :key="area.id" :value="area.id">{{ area.nombre }}
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
                                    Lun-Sab
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
                                        <input type="checkbox" v-model="form.turnos.manana.activo" class="sr-only peer">
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
                                        <input type="checkbox" v-model="form.turnos.tarde.activo" class="sr-only peer">
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
                                        <p class="font-bold text-teal-800">{{ calcularTotalCupos() }} cupos</p>
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
                                :disabled="loading || form.dias_seleccionados.length === 0 || (!form.turnos.manana.activo && !form.turnos.tarde.activo)"
                                class="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                                <ArrowPathIcon v-if="loading" class="w-5 h-5 animate-spin" />
                                <CheckCircleIcon v-else class="w-5 h-5" />
                                {{ loading ? 'Guardando...' : 'Crear Horarios' }}
                            </button>
                            <button type="button" @click="cerrar"
                                class="px-6 py-3 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl transition">
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
import { ref, watch } from 'vue'
import horarioService from '../../services/horarioService'
import {
    CalendarIcon,
    BuildingOfficeIcon,
    SunIcon,
    MoonIcon,
    TicketIcon,
    UserIcon,
    ClockIcon,
    XMarkIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
    CalendarDaysIcon
} from '@heroicons/vue/24/outline'

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

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const loading = ref(false)
const form = ref({
    medico_id: null as number | null,
    area_id: null as number | null,
    mes: '',
    dias_seleccionados: [] as number[],
    turnos: {
        manana: { activo: true, cupos: 5 },
        tarde: { activo: true, cupos: 7 }
    }
})

const resetForm = () => {
    const hoy = new Date()
    form.value = {
        medico_id: null,
        area_id: null,
        mes: `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`,
        dias_seleccionados: [0, 1, 2, 3, 4, 5],
        turnos: {
            manana: { activo: true, cupos: 7 },
            tarde: { activo: true, cupos: 7 }
        }
    }
}

watch(() => props.visible, (newVal) => {
    if (newVal) {
        resetForm()
    }
})

const seleccionarDiasLaborables = () => {
    form.value.dias_seleccionados = [0, 1, 2, 3, 4, 5]
}

const seleccionarTodosDias = () => {
    form.value.dias_seleccionados = [0, 1, 2, 3, 4, 5, 6]
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

const calcularTotalCupos = () => {
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

const cerrar = () => {
    emit('close')
}

const guardar = async () => {
    if (!form.value.medico_id || !form.value.area_id || form.value.dias_seleccionados.length === 0) return
    if (!form.value.turnos.manana.activo && !form.value.turnos.tarde.activo) return

    loading.value = true
    try {
        const payload = {
            medico_id: form.value.medico_id,
            area_id: form.value.area_id,
            mes: form.value.mes,
            dias_seleccionados: form.value.dias_seleccionados,
            turnos: form.value.turnos
        }

        const { data } = await horarioService.crearHorariosMensuales(payload)
        emit('saved', { creados: data.creados, actualizados: data.actualizados })
        cerrar()
    } catch (error: any) {
        console.error('Error al guardar horarios', error)
        throw error
    } finally {
        loading.value = false
    }
}
</script>
