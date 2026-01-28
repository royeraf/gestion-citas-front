<script setup lang="ts">
import { computed } from 'vue';
import {
    BoltIcon,
    UserPlusIcon,
    CalendarDaysIcon,
    IdentificationIcon
} from '@heroicons/vue/24/outline';

const props = defineProps<{
    rolId?: number;
}>();

const canSeeMedicos = computed(() => {
    // Solo Administrador puede ver la sección de Profesionales
    return props.rolId === 1;
});
</script>

<template>
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-emerald-100 rounded-lg">
                <BoltIcon class="w-5 h-5 text-emerald-600" />
            </div>
            <h2 class="text-lg font-semibold text-gray-800">Acciones Rápidas</h2>
        </div>
        <div class="grid grid-cols-1 gap-3">
            <router-link to="/pacientes"
                class="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition group">
                <div class="bg-blue-100 p-2 rounded-full mr-3 group-hover:bg-blue-200 transition">
                    <UserPlusIcon class="w-5 h-5 text-blue-600" />
                </div>
                <span class="font-medium text-gray-700 group-hover:text-blue-700">Registrar citas</span>
            </router-link>

            <router-link to="/citas"
                class="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 transition group">
                <div class="bg-emerald-100 p-2 rounded-full mr-3 group-hover:bg-emerald-200 transition">
                    <CalendarDaysIcon class="w-5 h-5 text-emerald-600" />
                </div>
                <span class="font-medium text-gray-700 group-hover:text-emerald-700">Gestionar citas</span>
            </router-link>

            <!-- Solo visible para Administrador -->
            <router-link v-if="canSeeMedicos" to="/medicos"
                class="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition group">
                <div class="bg-purple-100 p-2 rounded-full mr-3 group-hover:bg-purple-200 transition">
                    <IdentificationIcon class="w-5 h-5 text-purple-600" />
                </div>
                <span class="font-medium text-gray-700 group-hover:text-purple-700">Gestionar
                    Profesionales</span>
            </router-link>
        </div>
    </div>
</template>
