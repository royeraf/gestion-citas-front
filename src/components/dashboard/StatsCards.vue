<script setup lang="ts">
import {
    UsersIcon,
    ArrowTrendingUpIcon,
    CalendarIcon,
    UserPlusIcon,
    ClockIcon,
    ExclamationCircleIcon
} from '@heroicons/vue/24/outline';
import type { DashboardStats } from '../../services/dashboardService';

defineProps<{
    stats: DashboardStats;
    isLoading: boolean;
}>();
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <template v-if="isLoading">
            <div v-for="i in 4" :key="i"
                class="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-200 animate-pulse">
                <div class="flex items-center justify-between">
                    <div class="w-full">
                        <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div class="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div class="bg-gray-100 p-3 rounded-full w-12 h-12"></div>
                </div>
                <div class="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
        </template>
        <template v-else>
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
                    <span>Registros activos</span>
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
                    Personal disponible
                </p>
            </div>

            <!-- Citas Pendientes Total -->
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
                    <span>Total general</span>
                </p>
            </div>
        </template>
    </div>
</template>
