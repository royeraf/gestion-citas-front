<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">
      Gestión de Pacientes
    </h1>

    <!-- Tabs: solo visibles si el usuario puede registrar pacientes -->
    <div v-if="canRegisterPatients" class="flex justify-center mb-8">
      <div class="bg-gray-100 p-1 rounded-lg inline-flex">
        <button @click="activeTab = 'registro'"
          :class="['px-6 py-2 rounded-md text-sm font-medium transition-all', activeTab === 'registro' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700']">
          Nuevo Registro
        </button>
        <button @click="activeTab = 'lista'"
          :class="['px-6 py-2 rounded-md text-sm font-medium transition-all', activeTab === 'lista' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700']">
          Listado de Pacientes
        </button>
      </div>
    </div>

    <!-- Contenido con Transición -->
    <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2" mode="out-in">
      <!-- Registro: solo visible si puede registrar pacientes -->
      <div v-if="activeTab === 'registro' && canRegisterPatients" key="registro">
        <PacienteRegistro />
      </div>

      <!-- Listado: siempre visible -->
      <div v-else key="lista">
        <PacienteLista />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import PacienteRegistro from "../components/pacientes/PacienteRegistro.vue";
import PacienteLista from "../components/pacientes/PacienteLista.vue";
import { useAuthStore } from "../store/auth";

const auth = useAuthStore();

// El médico no puede registrar pacientes, solo ver la lista
// Rol 1 = Admin, Rol 2 = Médico, Rol 3 = Asistente
const canRegisterPatients = computed(() => {
  return auth.user?.rol_id === 1 || auth.user?.rol_id === 3;
});

// Si el usuario no puede registrar, mostrar directamente el listado
const activeTab = ref('registro');

onMounted(() => {
  if (!canRegisterPatients.value) {
    activeTab.value = 'lista';
  }
});
</script>
