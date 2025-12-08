<template>
    <div class="max-w-7xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">Dashboard General</h1>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Total Pacientes -->
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 font-medium uppercase">Total Pacientes</p>
                        <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.totalPacientes }}</p>
                    </div>
                    <div class="bg-blue-100 p-3 rounded-full">
                        <UsersIcon class="w-6 h-6 text-blue-600" />
                    </div>
                </div>
                <p class="text-sm text-green-600 mt-4 flex items-center">
                    <ArrowTrendingUpIcon class="w-4 h-4 mr-1" />
                    <span>+12% este mes</span>
                </p>
            </div>

            <!-- Citas Hoy -->
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 font-medium uppercase">Citas Hoy</p>
                        <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.citasHoy }}</p>
                    </div>
                    <div class="bg-emerald-100 p-3 rounded-full">
                        <CalendarIcon class="w-6 h-6 text-emerald-600" />
                    </div>
                </div>
                <p class="text-sm text-gray-500 mt-4">
                    {{ stats.citasPendientesHoy }} pendientes de atención
                </p>
            </div>

            <!-- Médicos Activos -->
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 font-medium uppercase">Médicos Activos</p>
                        <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.medicosActivos }}</p>
                    </div>
                    <div class="bg-purple-100 p-3 rounded-full">
                        <UserPlusIcon class="w-6 h-6 text-purple-600" />
                    </div>
                </div>
                <p class="text-sm text-gray-500 mt-4">
                    En 4 especialidades
                </p>
            </div>

            <!-- Ingresos (Simulado) -->
            <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500 font-medium uppercase">Citas Pendientes</p>
                        <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.citasPendientesTotal }}</p>
                    </div>
                    <div class="bg-orange-100 p-3 rounded-full">
                        <ClockIcon class="w-6 h-6 text-orange-600" />
                    </div>
                </div>
                <p class="text-sm text-orange-600 mt-4 flex items-center">
                    <ExclamationCircleIcon class="w-4 h-4 mr-1" />
                    <span>Requieren confirmación</span>
                </p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Próximas Citas -->
            <div class="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 class="text-lg font-semibold text-gray-800">Próximas Citas</h2>
                    <router-link to="/citas" class="text-sm text-blue-600 hover:text-blue-800 font-medium">Ver
                        todas</router-link>
                </div>
                <div class="divide-y divide-gray-200">
                    <div v-for="cita in proximasCitas" :key="cita.id"
                        class="p-6 hover:bg-gray-50 transition duration-150">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="bg-gray-100 p-3 rounded-lg text-center min-w-[60px]">
                                    <p class="text-xs text-gray-500 uppercase font-bold">{{ getMes(cita.fecha) }}</p>
                                    <p class="text-xl font-bold text-gray-800">{{ getDia(cita.fecha) }}</p>
                                </div>
                                <div>
                                    <h3 class="text-base font-semibold text-gray-900">{{ cita.paciente }}</h3>
                                    <p class="text-sm text-gray-500">{{ cita.especialidad }} - {{ cita.doctor }}</p>
                                    <p class="text-xs text-gray-400 mt-1 flex items-center">
                                        <ClockIcon class="w-3 h-3 mr-1" />
                                        {{ cita.hora }}
                                    </p>
                                </div>
                            </div>
                            <span :class="getEstadoClass(cita.estado)">
                                {{ cita.estado }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Acciones Rápidas y Estado del Sistema -->
            <div class="space-y-8">
                <!-- Acciones Rápidas -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
                    <div class="grid grid-cols-1 gap-3">
                        <router-link to="/pacientes"
                            class="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition group">
                            <div class="bg-blue-100 p-2 rounded-full mr-3 group-hover:bg-blue-200 transition">
                                <UserPlusIcon class="w-5 h-5 text-blue-600" />
                            </div>
                            <span class="font-medium text-gray-700 group-hover:text-blue-700">Registrar Paciente</span>
                        </router-link>

                        <router-link to="/citas"
                            class="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 transition group">
                            <div class="bg-emerald-100 p-2 rounded-full mr-3 group-hover:bg-emerald-200 transition">
                                <CalendarDaysIcon class="w-5 h-5 text-emerald-600" />
                            </div>
                            <span class="font-medium text-gray-700 group-hover:text-emerald-700">Nueva Cita</span>
                        </router-link>

                        <router-link to="/medicos"
                            class="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition group">
                            <div class="bg-purple-100 p-2 rounded-full mr-3 group-hover:bg-purple-200 transition">
                                <IdentificationIcon class="w-5 h-5 text-purple-600" />
                            </div>
                            <span class="font-medium text-gray-700 group-hover:text-purple-700">Gestionar Médicos</span>
                        </router-link>
                    </div>
                </div>

                <!-- Distribución por Especialidad (Simulado con barras simples) -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-lg font-semibold text-gray-800 mb-4">Citas por Especialidad (Hoy)</h2>
                    <div class="space-y-4">
                        <div v-for="item in citasPorEspecialidad" :key="item.nombre">
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-gray-600">{{ item.nombre }}</span>
                                <span class="font-medium text-gray-800">{{ item.cantidad }}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-blue-500 h-2 rounded-full" :style="{ width: item.porcentaje + '%' }">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    UsersIcon,
    ArrowTrendingUpIcon,
    CalendarIcon,
    UserPlusIcon,
    ClockIcon,
    ExclamationCircleIcon,
    IdentificationIcon,
    CalendarDaysIcon
} from '@heroicons/vue/24/outline';

// Datos simulados para el dashboard
const stats = ref({
    totalPacientes: 1248,
    citasHoy: 42,
    citasPendientesHoy: 15,
    medicosActivos: 18,
    citasPendientesTotal: 86
});

const proximasCitas = ref([
    {
        id: 1,
        fecha: '2024-11-23',
        hora: '09:00 AM',
        paciente: 'Juan Pérez García',
        doctor: 'Dr. Carlos Mendoza',
        especialidad: 'Odontología',
        estado: 'Confirmada'
    },
    {
        id: 2,
        fecha: '2024-11-23',
        hora: '09:30 AM',
        paciente: 'María López Silva',
        doctor: 'Dra. Ana Torres',
        especialidad: 'Psicología',
        estado: 'Pendiente'
    },
    {
        id: 3,
        fecha: '2024-11-23',
        hora: '10:00 AM',
        paciente: 'Pedro Ramírez',
        doctor: 'Dr. Fernando López',
        especialidad: 'Medicina General',
        estado: 'Atendida'
    },
    {
        id: 4,
        fecha: '2024-11-23',
        hora: '10:30 AM',
        paciente: 'Luisa Martínez',
        doctor: 'Dra. Laura Pérez',
        especialidad: 'Nutrición',
        estado: 'Pendiente'
    }
]);

const citasPorEspecialidad = ref([
    { nombre: 'Medicina General', cantidad: 15, porcentaje: 45 },
    { nombre: 'Odontología', cantidad: 12, porcentaje: 35 },
    { nombre: 'Psicología', cantidad: 8, porcentaje: 25 },
    { nombre: 'Nutrición', cantidad: 7, porcentaje: 20 }
]);

// Helpers para fechas
const getMes = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString('es-ES', { month: 'short' }).replace('.', '');
};

const getDia = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.getDate();
};

const getEstadoClass = (estado: string) => {
    const classes: Record<string, string> = {
        'Pendiente': 'px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
        'Confirmada': 'px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
        'Atendida': 'px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800',
        'Cancelada': 'px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800',
        'Referido': 'px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800'
    };
    return classes[estado] || 'px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800';
};
</script>