<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="visible"
            class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            @click.self="cerrar">
            <div
                class="bg-white rounded-2xl max-w-4xl w-full shadow-2xl transform transition-all max-h-[90vh] overflow-hidden flex flex-col">

                <!-- Header del modal -->
                <div class="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 text-white">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl">
                                {{ getInitials(medico?.name || '') }}
                            </div>
                            <div>
                                <h3 class="text-xl font-bold">{{ medico?.name }}</h3>
                                <p class="text-teal-100 text-sm">{{ medico?.especialidad || 'Médico' }}</p>
                            </div>
                        </div>
                        <button @click="cerrar"
                            class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
                            <XMarkIcon class="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                <!-- Filtro de mes -->
                <div class="p-4 border-b bg-gray-50 flex items-end gap-4">
                    <div class="w-48">
                        <HsMonthYearPicker label="Mes" v-model="mesSeleccionado" @change="cargarHorarios"
                            :min-date="'2020-01'" :max-date="'2030-12'" />
                    </div>
                    <button @click="cargarHorarios"
                        class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2 mb-[1px]">
                        <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': loading }" />
                        Actualizar
                    </button>
                </div>

                <!-- Contenido del modal -->
                <div class="flex-1 overflow-y-auto p-6">
                    <div v-if="loading" class="flex items-center justify-center py-12">
                        <ArrowPathIcon class="w-10 h-10 animate-spin text-teal-600" />
                    </div>

                    <div v-else-if="horarios.length === 0"
                        class="flex flex-col items-center justify-center py-12 text-center">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <CalendarDaysIcon class="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-2">No hay horarios registrados</h3>
                        <p class="text-gray-500 text-sm">Este médico no tiene horarios para el mes seleccionado</p>
                    </div>

                    <div v-else>
                        <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <CalendarIcon class="w-5 h-5 text-teal-600" />
                            {{ getMesNombre(mesSeleccionado) }}
                        </h4>

                        <div class="grid grid-cols-7 gap-2">
                            <!-- Encabezados de días -->
                            <div v-for="dia in diasSemana" :key="dia"
                                class="text-center font-semibold text-gray-600 py-2 bg-gray-100 rounded-lg text-sm">
                                {{ dia }}
                            </div>

                            <!-- Días del mes -->
                            <div v-for="(dia, index) in diasDelMes" :key="index" :class="[
                                'p-2 rounded-lg border min-h-[80px] transition-all',
                                dia.esDelMes ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100',
                                (dia.turnos?.M || dia.turnos?.T) ? 'border-teal-400 border-2' : ''
                            ]">
                                <div v-if="dia.esDelMes">
                                    <div class="font-bold text-gray-700 mb-2 text-sm">{{ dia.numero }}</div>

                                    <div v-if="dia.turnos?.M"
                                        class="text-xs bg-amber-500 text-white px-2 py-1 rounded mb-1 flex items-center justify-between group/turno">
                                        <div class="flex items-center gap-1">
                                            <SunIcon class="w-3 h-3" />
                                            <span>{{ dia.turnos.M.cupos }}</span>
                                        </div>
                                        <button @click.stop="eliminarHorario(dia.turnos.M.id)"
                                            class="opacity-0 group-hover/turno:opacity-100 hover:bg-red-600 rounded p-0.5 transition"
                                            title="Eliminar">
                                            <XMarkIcon class="w-3 h-3" />
                                        </button>
                                    </div>

                                    <div v-if="dia.turnos?.T"
                                        class="text-xs bg-indigo-500 text-white px-2 py-1 rounded flex items-center justify-between group/turno">
                                        <div class="flex items-center gap-1">
                                            <MoonIcon class="w-3 h-3" />
                                            <span>{{ dia.turnos.T.cupos }}</span>
                                        </div>
                                        <button @click.stop="eliminarHorario(dia.turnos.T.id)"
                                            class="opacity-0 group-hover/turno:opacity-100 hover:bg-red-600 rounded p-0.5 transition"
                                            title="Eliminar">
                                            <XMarkIcon class="w-3 h-3" />
                                        </button>
                                    </div>

                                    <div v-if="!dia.turnos?.M && !dia.turnos?.T" class="text-xs text-gray-400 italic">
                                        -
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer del modal -->
                <div class="p-4 border-t bg-gray-50 flex justify-between items-center">
                    <p class="text-sm text-gray-500">
                        {{ horarios.length }} horario{{ horarios.length !== 1 ? 's' : '' }} en este mes
                    </p>
                    <button @click="cerrar"
                        class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Swal from 'sweetalert2'
import horarioService, { type Horario } from '../../services/horarioService'
import {
    CalendarIcon,
    SunIcon,
    MoonIcon,
    XMarkIcon,
    ArrowPathIcon,
    CalendarDaysIcon
} from '@heroicons/vue/24/outline'
import HsMonthYearPicker from '../common/HsMonthYearPicker.vue'

interface Props {
    visible: boolean
    medico: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'deleted'): void
}>()

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const loading = ref(false)
const horarios = ref<Horario[]>([])
const mesSeleccionado = ref('')

const getInitials = (name: string) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getMesNombre = (mes: string) => {
    if (!mes) return ''
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    const [year, month] = mes.split('-').map(Number)
    return `${meses[(month || 1) - 1]} ${year}`
}

const diasDelMes = computed(() => {
    if (!mesSeleccionado.value || !props.medico) return []

    const parts = mesSeleccionado.value.split('-').map(Number)
    if (parts.length < 2 || parts[0] === undefined || parts[1] === undefined) return []
    const year = parts[0]
    const month = parts[1]
    const primerDia = new Date(year, month - 1, 1)
    const ultimoDia = new Date(year, month, 0)
    const diasEnMes = ultimoDia.getDate()

    const dias: any[] = []
    const primerDiaSemana = primerDia.getDay() === 0 ? 6 : primerDia.getDay() - 1

    for (let i = 0; i < primerDiaSemana; i++) {
        dias.push({ esDelMes: false, numero: '', turnos: {} })
    }

    for (let dia = 1; dia <= diasEnMes; dia++) {
        const fechaStr = `${year}-${String(month).padStart(2, '0')}-${String(dia).padStart(2, '0')}`

        const horariosDelDia = horarios.value.filter(h => h.fecha === fechaStr)
        const turnos: { M?: Horario, T?: Horario } = {}

        horariosDelDia.forEach(h => {
            if (h.turno === 'M') turnos.M = h
            if (h.turno === 'T') turnos.T = h
        })

        dias.push({
            esDelMes: true,
            numero: dia,
            fecha: fechaStr,
            turnos
        })
    }

    return dias
})

const cargarHorarios = async () => {
    if (!props.medico) return

    loading.value = true
    try {
        const params: any = { medico_id: props.medico.id }
        if (mesSeleccionado.value) params.mes = mesSeleccionado.value

        const { data } = await horarioService.getHorarios(params)
        horarios.value = data
    } catch (error) {
        console.error('Error cargando horarios del médico:', error)
        horarios.value = []
    } finally {
        loading.value = false
    }
}

const eliminarHorario = async (id: number | undefined) => {
    if (!id) return

    const result = await Swal.fire({
        title: '¿Está seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    })

    if (!result.isConfirmed) return

    try {
        await horarioService.eliminarHorario(id)

        await Swal.fire({
            title: '¡Eliminado!',
            text: 'El horario ha sido eliminado.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        })

        await cargarHorarios()
        emit('deleted')
    } catch (error) {
        console.error('Error al eliminar horario', error)
        Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el horario',
            icon: 'error'
        })
    }
}

const cerrar = () => {
    emit('close')
}

watch(() => props.visible, async (newVal) => {
    if (newVal && props.medico) {
        const hoy = new Date()
        mesSeleccionado.value = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
        await cargarHorarios()
    }
})
</script>
