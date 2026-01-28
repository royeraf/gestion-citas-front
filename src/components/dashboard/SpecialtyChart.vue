<script setup lang="ts">
import { ChartPieIcon } from '@heroicons/vue/24/outline';
import type { AppointmentBySpecialty } from '../../services/dashboardService';

defineProps<{
    data: AppointmentBySpecialty[];
    isLoading: boolean;
}>();
</script>

<template>
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-emerald-100 rounded-lg">
                <ChartPieIcon class="w-5 h-5 text-emerald-600" />
            </div>
            <h2 class="text-lg font-semibold text-gray-800">Citas por Especialidad (Hoy)</h2>
        </div>

        <div v-if="isLoading" class="space-y-4 animate-pulse">
            <div v-for="i in 3" :key="i">
                <div class="flex justify-between mb-1">
                    <div class="h-3 bg-gray-200 rounded w-1/3"></div>
                    <div class="h-3 bg-gray-200 rounded w-10"></div>
                </div>
                <div class="h-2 bg-gray-200 rounded-full w-full"></div>
            </div>
        </div>

        <div v-else class="space-y-4">
            <div v-if="data.length === 0" class="text-sm text-gray-500 italic">
                No hay datos para mostrar hoy.
            </div>
            <div v-for="item in data" :key="item.nombre">
                <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-600">{{ item.nombre }}</span>
                    <span class="font-medium text-gray-800">{{ item.cantidad }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        :style="{ width: item.porcentaje + '%' }">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
