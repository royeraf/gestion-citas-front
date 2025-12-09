<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="show" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            @click.self="close">
            <div
                class="bg-white rounded-2xl max-w-4xl w-full shadow-2xl transform transition-all max-h-[90vh] overflow-hidden flex flex-col">

                <!-- Header del modal -->
                <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-xl font-bold">Historial de Citas</h3>
                            <p class="text-teal-100 text-sm mt-1">{{ historialData?.paciente?.nombre_completo ||
                                getNombreCompleto() }}</p>
                        </div>
                        <button @click="close"
                            class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
                            <XMarkIcon class="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                <!-- Filtros con chips -->
                <div class="p-4 border-b bg-gray-50 flex items-center gap-4 flex-wrap">
                    <div class="flex items-center gap-2">
                        <IdentificationIcon class="w-4 h-4 text-gray-500" />
                        <span class="text-sm text-gray-600">DNI: <span class="font-semibold">{{ paciente?.dni
                                }}</span></span>
                    </div>
                    <span v-if="historialData?.total !== undefined"
                        class="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded-full">
                        {{ historialData.total }} cita(s)
                    </span>
                    <div class="flex-1"></div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-sm font-medium text-gray-600">
                            <FunnelIcon class="w-4 h-4 inline mr-1" />
                            Filtrar:
                        </span>
                        <button v-for="estado in estados" :key="estado.value"
                            @click="filtroEstado = filtroEstado === estado.value ? '' : estado.value; fetchHistorial()"
                            :class="[
                                'px-3 py-1.5 rounded-full text-xs font-medium transition border',
                                filtroEstado === estado.value
                                    ? estado.activeClass
                                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-100'
                            ]">
                            <span :class="['inline-block w-2 h-2 rounded-full mr-1.5', estado.dotClass]"></span>
                            {{ estado.label }}
                        </button>
                    </div>
                </div>

                <!-- Lista de citas con Timeline -->
                <div class="flex-1 overflow-y-auto p-6">
                    <!-- Loading State -->
                    <div v-if="loading" class="flex items-center justify-center py-12">
                        <ArrowPathIcon class="w-10 h-10 animate-spin text-teal-600" />
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="citas.length === 0"
                        class="flex flex-col items-center justify-center py-12 text-center">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <CalendarDaysIcon class="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-2">Sin citas registradas</h3>
                        <p class="text-gray-500 text-sm">Este paciente aún no tiene citas en su historial</p>
                    </div>

                    <!-- Timeline de citas -->
                    <div v-else class="relative">
                        <!-- Línea vertical del timeline -->
                        <div class="absolute left-[27px] top-3 bottom-3 w-0.5 bg-gray-200"></div>

                        <div class="space-y-4">
                            <div v-for="cita in citas" :key="cita.id" class="relative flex gap-4">

                                <!-- Indicador del timeline -->
                                <div class="relative z-10 flex-shrink-0">
                                    <div :class="[
                                        'w-14 h-14 rounded-lg flex items-center justify-center shadow-md',
                                        getEstadoIconBg(cita.estado)
                                    ]">
                                        <component :is="getEstadoIcon(cita.estado)" class="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                <!-- Card de la cita -->
                                <div
                                    class="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                    <div class="p-4">
                                        <div class="flex items-start justify-between">
                                            <div class="flex-1">
                                                <div class="flex items-center gap-2 mb-2">
                                                    <span class="text-base font-semibold text-gray-800">
                                                        {{ formatFecha(cita.fecha) }}
                                                    </span>
                                                    <span :class="[
                                                        'px-2 py-1 text-xs font-semibold rounded-full capitalize',
                                                        getEstadoClass(cita.estado)
                                                    ]">
                                                        {{ cita.estado }}
                                                    </span>
                                                </div>

                                                <div class="space-y-1">
                                                    <div class="flex items-center gap-2 text-sm text-gray-600">
                                                        <BuildingOffice2Icon class="w-4 h-4 text-gray-400" />
                                                        <span>{{ cita.area_nombre || 'Sin área asignada' }}</span>
                                                    </div>
                                                    <div class="flex items-center gap-2 text-sm text-gray-600">
                                                        <UserCircleIcon class="w-4 h-4 text-gray-400" />
                                                        <span>Dr(a). {{ cita.doctor_nombre || 'No asignado' }}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Horario -->
                                            <div class="text-right">
                                                <div
                                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm">
                                                    <ClockIcon class="w-4 h-4 text-gray-500" />
                                                    <span class="font-medium text-gray-700">
                                                        {{ cita.horario_turno_nombre || 'N/A' }}
                                                    </span>
                                                </div>
                                                <p v-if="cita.horario" class="text-xs text-gray-500 mt-1">
                                                    {{ cita.horario.hora_inicio?.slice(0, 5) }} - {{
                                                        cita.horario.hora_fin?.slice(0, 5) }}
                                                </p>
                                            </div>
                                        </div>

                                        <!-- Síntomas -->
                                        <div v-if="cita.sintomas" class="mt-3 pt-3 border-t border-gray-100">
                                            <div class="flex items-start gap-2">
                                                <DocumentTextIcon class="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <span
                                                        class="text-xs font-medium text-gray-500 uppercase tracking-wide">Síntomas</span>
                                                    <p class="text-sm text-gray-700 mt-0.5">{{ cita.sintomas }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer del modal -->
                <div class="p-4 border-t bg-gray-50 flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <p class="text-sm text-gray-500">
                            {{ citas.length }} cita(s) mostrada(s)
                        </p>
                        <!-- Paginación -->
                        <div v-if="historialData && historialData.pages > 1" class="flex items-center gap-2">
                            <button @click="page--; fetchHistorial()" :disabled="page === 1" :class="[
                                'px-3 py-1.5 text-sm font-medium rounded-lg transition flex items-center gap-1',
                                page === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            ]">
                                <ChevronLeftIcon class="w-4 h-4" />
                                Anterior
                            </button>
                            <span class="text-sm text-gray-600">
                                {{ historialData.current_page }} / {{ historialData.pages }}
                            </span>
                            <button @click="page++; fetchHistorial()" :disabled="page >= historialData.pages" :class="[
                                'px-3 py-1.5 text-sm font-medium rounded-lg transition flex items-center gap-1',
                                page >= historialData.pages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-teal-600 text-white hover:bg-teal-700'
                            ]">
                                Siguiente
                                <ChevronRightIcon class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <button @click="close"
                        class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import pacienteService, { type Paciente, type HistorialCita, type HistorialResponse } from '../../services/pacienteService';
import {
    XMarkIcon,
    ClockIcon,
    CalendarDaysIcon,
    IdentificationIcon,
    FunnelIcon,
    BuildingOffice2Icon,
    UserCircleIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowRightCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowPathIcon
} from '@heroicons/vue/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/vue/24/solid';

interface Props {
    show: boolean;
    paciente: Paciente | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

// Estado
const loading = ref(false);
const citas = ref<HistorialCita[]>([]);
const historialData = ref<HistorialResponse | null>(null);
const page = ref(1);
const filtroEstado = ref('');

// Estados disponibles con sus estilos
const estados = [
    { value: 'pendiente', label: 'Pendiente', dotClass: 'bg-yellow-400', activeClass: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
    { value: 'confirmada', label: 'Confirmada', dotClass: 'bg-blue-400', activeClass: 'bg-blue-50 text-blue-800 border-blue-200' },
    { value: 'atendida', label: 'Atendida', dotClass: 'bg-green-400', activeClass: 'bg-green-50 text-green-800 border-green-200' },
    { value: 'cancelada', label: 'Cancelada', dotClass: 'bg-red-400', activeClass: 'bg-red-50 text-red-800 border-red-200' },
    { value: 'referido', label: 'Referido', dotClass: 'bg-orange-400', activeClass: 'bg-orange-50 text-orange-800 border-orange-200' },
];

// Métodos


const getNombreCompleto = () => {
    if (!props.paciente) return '';
    const apellidoP = props.paciente.apellidoPaterno || props.paciente.apellido_paterno || '';
    const apellidoM = props.paciente.apellidoMaterno || props.paciente.apellido_materno || '';
    return `${props.paciente.nombres} ${apellidoP} ${apellidoM}`;
};

const formatFecha = (fecha: string | null | undefined) => {
    if (!fecha) return 'Sin fecha';
    try {
        const date = new Date(fecha + 'T00:00:00');
        return date.toLocaleDateString('es-PE', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch {
        return fecha;
    }
};

const fetchHistorial = async () => {
    if (!props.paciente) return;

    loading.value = true;
    try {
        const params: { page: number; per_page: number; estado?: string } = {
            page: page.value,
            per_page: 10
        };
        if (filtroEstado.value) {
            params.estado = filtroEstado.value;
        }

        const { data } = await pacienteService.getHistorialCitas(props.paciente.id, params);
        historialData.value = data;
        citas.value = data.data;
    } catch (error) {
        console.error("Error al cargar historial:", error);
        citas.value = [];
    } finally {
        loading.value = false;
    }
};

const getEstadoClass = (estado: string) => {
    const clases: Record<string, string> = {
        'pendiente': 'bg-yellow-100 text-yellow-800',
        'confirmada': 'bg-blue-100 text-blue-800',
        'atendida': 'bg-green-100 text-green-800',
        'cancelada': 'bg-red-100 text-red-800',
        'referido': 'bg-orange-100 text-orange-800'
    };
    return clases[estado] || 'bg-gray-100 text-gray-700';
};

const getEstadoIconBg = (estado: string) => {
    const clases: Record<string, string> = {
        'pendiente': 'bg-yellow-500',
        'confirmada': 'bg-blue-500',
        'atendida': 'bg-green-500',
        'cancelada': 'bg-red-500',
        'referido': 'bg-orange-500'
    };
    return clases[estado] || 'bg-gray-500';
};

const getEstadoIcon = (estado: string) => {
    const iconos: Record<string, any> = {
        'pendiente': ClockIcon,
        'confirmada': CheckCircleIcon,
        'atendida': CheckCircleSolid,
        'cancelada': XCircleIcon,
        'referido': ArrowRightCircleIcon
    };
    return iconos[estado] || ClockIcon;
};

const close = () => {
    emit('close');
};

// Watch para cargar historial cuando se abre el modal
watch(() => props.show, (newVal) => {
    if (newVal && props.paciente) {
        page.value = 1;
        filtroEstado.value = '';
        fetchHistorial();
    }
});
</script>

<style scoped>
/* Scrollbar personalizado */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>
