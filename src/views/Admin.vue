<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Tabs Navigation -->
    <div class="mb-8 border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button @click="activeTab = 'usuarios'" :class="[
          activeTab === 'usuarios'
            ? 'border-teal-500 text-teal-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
        ]">
          <UsersIcon class="w-5 h-5" />
          Usuarios
        </button>
        <button @click="activeTab = 'areas'" :class="[
          activeTab === 'areas'
            ? 'border-teal-500 text-teal-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
        ]">
          <BuildingOfficeIcon class="w-5 h-5" />
          Áreas / Servicios
        </button>
        <button @click="activeTab = 'horarios'" :class="[
          activeTab === 'horarios'
            ? 'border-teal-500 text-teal-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
        ]">
          <CalendarIcon class="w-5 h-5" />
          Horarios
        </button>
      </nav>
    </div>

    <!-- Tab Usuarios -->
    <div v-show="activeTab === 'usuarios'">
      <AdminUsuarios />
    </div>

    <!-- Tab Áreas / Servicios -->
    <div v-show="activeTab === 'areas'">
      <AdminAreas />
    </div>

    <!-- Tab Horarios -->
    <div v-show="activeTab === 'horarios'">
      <AdminHorarios />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminUsuarios from '../components/admin/AdminUsuarios.vue'
import AdminAreas from '../components/admin/AdminAreas.vue'
import AdminHorarios from '../components/admin/AdminHorarios.vue'
import { UsersIcon, BuildingOfficeIcon, CalendarIcon } from '@heroicons/vue/24/outline'

const activeTab = ref('usuarios')
</script>