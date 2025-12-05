<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800">
        Administración de Médicos
      </h1>
      <button @click="abrirModalCrear"
        class="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2">
        <i class="pi pi-user-plus"></i>
        Nuevo Médico
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">
        Filtros de Búsqueda
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="filtroArea" class="block text-sm font-medium text-gray-700 mb-2">
            Área/Especialidad
          </label>
          <select id="filtroArea" v-model="filtros.area"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white">
            <option value="">Todas las áreas</option>
            <option value="odontologia">Odontología</option>
            <option value="psicologia">Psicología</option>
            <option value="nutricion">Nutrición</option>
            <option value="medicina_general">Medicina General</option>
          </select>
        </div>

        <div>
          <label for="filtroEstado" class="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select id="filtroEstado" v-model="filtros.estado"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white">
            <option value="">Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <div>
          <label for="filtroBuscar" class="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <input type="text" id="filtroBuscar" v-model="filtros.busqueda" placeholder="Nombre o CMP"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
        </div>
      </div>
    </div>

    <!-- Tabla de médicos -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Médico
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Especialidad
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CMP
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horario
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cupos/Día
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="medico in paginatedMedicos" :key="medico.id" class="hover:bg-gray-50 transition duration-150">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span class="text-emerald-600 font-semibold">{{
                      medico.iniciales
                    }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ medico.nombre }}
                    </div>
                    <div class="text-sm text-gray-500">{{ medico.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">
                  {{ formatArea(medico.area) }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ medico.especialidad }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ medico.cmp }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ medico.horario }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ medico.cuposDia }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-semibold rounded-full',
                  medico.estado === 'activo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800',
                ]">
                  {{ medico.estado === "activo" ? "Activo" : "Inactivo" }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex gap-2">
                  <button @click="verDetalle(medico)" class="text-blue-600 hover:text-blue-800 transition"
                    title="Ver detalle">
                    <i class="pi pi-eye"></i>
                  </button>
                  <button @click="editarMedico(medico)" class="text-green-600 hover:text-green-800 transition"
                    title="Editar">
                    <i class="pi pi-pen-to-square"></i>
                  </button>
                  <button @click="toggleEstado(medico)" :class="[
                    'transition',
                    medico.estado === 'activo'
                      ? 'text-red-600 hover:text-red-800'
                      : 'text-green-600 hover:text-green-800',
                  ]" :title="medico.estado === 'activo' ? 'Desactivar' : 'Activar'
                    ">
                    <i :class="[
                      medico.estado === 'activo'
                        ? 'pi pi-ban'
                        : 'pi pi-check-circle',
                    ]"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mensaje cuando no hay resultados -->
      <div v-if="medicosFiltrados.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="mt-4 text-gray-500">
          No se encontraron médicos con los filtros aplicados
        </p>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="medicosFiltrados.length > 0"
      class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg shadow-lg mt-[-24px] mb-8">
      <div class="flex-1 flex justify-between sm:hidden">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
          Anterior
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
          Siguiente
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <p class="text-sm text-gray-700">
            Mostrando
            <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
            a
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, medicosFiltrados.length) }}</span>
            de
            <span class="font-medium">{{ medicosFiltrados.length }}</span>
            resultados
          </p>
          <select v-model="itemsPerPage"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md">
            <option :value="5">5 por página</option>
            <option :value="10">10 por página</option>
            <option :value="20">20 por página</option>
            <option :value="50">50 por página</option>
          </select>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button @click="prevPage" :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
              <span class="sr-only">Anterior</span>
              <i class="pi pi-chevron-left" aria-hidden="true"></i>
            </button>

            <button v-for="page in totalPages" :key="page" @click="currentPage = page"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
              :class="page === currentPage ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'">
              {{ page }}
            </button>

            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
              <span class="sr-only">Siguiente</span>
              <i class="pi pi-chevron-right" aria-hidden="true"></i>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Modal de Crear/Editar -->
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="modalForm.visible"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        @click.self="cerrarModalForm">
        <div
          class="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl transform transition-all max-h-screen overflow-y-auto">
          <div class="flex justify-between items-start mb-6">
            <h3 class="text-2xl font-bold text-gray-800">
              {{ modalForm.esEdicion ? "Editar Médico" : "Nuevo Médico" }}
            </h3>
            <button @click="cerrarModalForm" class="text-gray-400 hover:text-gray-600 transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="guardarMedico" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo <span class="text-red-500">*</span>
                </label>
                <input type="text" v-model="formData.nombre" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Dr. Juan Pérez" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  CMP <span class="text-red-500">*</span>
                </label>
                <input type="text" v-model="formData.cmp" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="123456" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email <span class="text-red-500">*</span>
                </label>
                <input type="email" v-model="formData.email" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="doctor@ejemplo.com" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono <span class="text-red-500">*</span>
                </label>
                <input type="tel" v-model="formData.telefono" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="999 999 999" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Área <span class="text-red-500">*</span>
                </label>
                <select v-model="formData.area" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white">
                  <option value="">Seleccione un área</option>
                  <option value="odontologia">Odontología</option>
                  <option value="psicologia">Psicología</option>
                  <option value="nutricion">Nutrición</option>
                  <option value="medicina_general">Medicina General</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Especialidad <span class="text-red-500">*</span>
                </label>
                <input type="text" v-model="formData.especialidad" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Ej: Ortodoncista" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Horario <span class="text-red-500">*</span>
                </label>
                <input type="text" v-model="formData.horario" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="8:00 AM - 2:00 PM" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cupos por Día <span class="text-red-500">*</span>
                </label>
                <input type="number" v-model.number="formData.cuposDia" required min="1" max="50"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="10" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Dirección de Consultorio
              </label>
              <input type="text" v-model="formData.direccion"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Dirección completa" />
            </div>

            <div class="flex gap-3 pt-4">
              <button type="submit"
                class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                {{ modalForm.esEdicion ? "Actualizar" : "Registrar" }} Médico
              </button>
              <button type="button" @click="cerrarModalForm"
                class="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal de Detalle -->
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="modalDetalle.visible"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        @click.self="cerrarModalDetalle">
        <div class="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-2xl font-bold text-gray-800">Detalle del Médico</h3>
            <button @click="cerrarModalDetalle" class="text-gray-400 hover:text-gray-600 transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="modalDetalle.medico" class="space-y-4">
            <div class="flex items-center gap-4 pb-4 border-b">
              <div class="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <span class="text-emerald-600 font-bold text-xl">{{
                  modalDetalle.medico.iniciales
                }}</span>
              </div>
              <div>
                <h4 class="text-xl font-semibold text-gray-800">
                  {{ modalDetalle.medico.nombre }}
                </h4>
                <p class="text-gray-600">
                  {{ modalDetalle.medico.especialidad }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">CMP</p>
                <p class="font-semibold text-gray-800">
                  {{ modalDetalle.medico.cmp }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Área</p>
                <p class="font-semibold text-gray-800">
                  {{ formatArea(modalDetalle.medico.area) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Email</p>
                <p class="font-semibold text-gray-800">
                  {{ modalDetalle.medico.email }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Teléfono</p>
                <p class="font-semibold text-gray-800">
                  {{ modalDetalle.medico.telefono }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Horario</p>
                <p class="font-semibold text-gray-800">
                  {{ modalDetalle.medico.horario }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Cupos por Día</p>
                <p class="font-semibold text-gray-800">
                  {{ modalDetalle.medico.cuposDia }}
                </p>
              </div>
              <div class="col-span-2">
                <p class="text-sm text-gray-500">Dirección</p>
                <p class="font-semibold text-gray-800">
                  {{ modalDetalle.medico.direccion || "No especificada" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Estado</p>
                <span :class="[
                  'inline-block px-2 py-1 text-xs font-semibold rounded-full',
                  modalDetalle.medico.estado === 'activo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800',
                ]">
                  {{
                    modalDetalle.medico.estado === "activo"
                      ? "Activo"
                      : "Inactivo"
                  }}
                </span>
              </div>
            </div>

            <div class="flex gap-3 pt-4 border-t">
              <button @click="editarMedico(modalDetalle.medico)"
                class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg transition">
                Editar
              </button>
              <button @click="cerrarModalDetalle"
                class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Medico {
  id: number;
  nombre: string;
  iniciales: string;
  email: string;
  telefono: string;
  cmp: string;
  area: string;
  especialidad: string;
  horario: string;
  cuposDia: number;
  direccion?: string;
  estado: "activo" | "inactivo";
}

interface Filtros {
  area: string;
  estado: string;
  busqueda: string;
}

const filtros = ref<Filtros>({
  area: "",
  estado: "",
  busqueda: "",
});

const modalForm = ref({
  visible: false,
  esEdicion: false,
});

const modalDetalle = ref<{
  visible: boolean;
  medico: Medico | null;
}>({
  visible: false,
  medico: null,
});

const formData = ref({
  id: 0,
  nombre: "",
  email: "",
  telefono: "",
  cmp: "",
  area: "",
  especialidad: "",
  horario: "",
  cuposDia: 10,
  direccion: "",
});

// Datos de ejemplo
const medicos = ref<Medico[]>([
  {
    id: 1,
    nombre: "Dr. Carlos Mendoza García",
    iniciales: "CM",
    email: "cmendoza@clinica.com",
    telefono: "987 654 321",
    cmp: "045678",
    area: "odontologia",
    especialidad: "Odontólogo General",
    horario: "8:00 AM - 2:00 PM",
    cuposDia: 12,
    direccion: "Av. Principal 123, Lima",
    estado: "activo",
  },
  {
    id: 2,
    nombre: "Dra. Ana Torres Silva",
    iniciales: "AT",
    email: "atorres@clinica.com",
    telefono: "987 123 456",
    cmp: "056789",
    area: "odontologia",
    especialidad: "Ortodoncista",
    horario: "2:00 PM - 6:00 PM",
    cuposDia: 8,
    direccion: "Av. Los Olivos 456, Lima",
    estado: "activo",
  },
  {
    id: 3,
    nombre: "Dra. María González Ruiz",
    iniciales: "MG",
    email: "mgonzalez@clinica.com",
    telefono: "986 321 654",
    cmp: "067890",
    area: "psicologia",
    especialidad: "Psicóloga Clínica",
    horario: "9:00 AM - 5:00 PM",
    cuposDia: 10,
    direccion: "Jr. Las Flores 789, Lima",
    estado: "activo",
  },
  {
    id: 4,
    nombre: "Dra. Laura Pérez Vega",
    iniciales: "LP",
    email: "lperez@clinica.com",
    telefono: "985 987 321",
    cmp: "078901",
    area: "nutricion",
    especialidad: "Nutricionista Clínica",
    horario: "8:00 AM - 2:00 PM",
    cuposDia: 15,
    direccion: "Av. Universitaria 321, Lima",
    estado: "activo",
  },
  {
    id: 5,
    nombre: "Dr. Fernando López Díaz",
    iniciales: "FL",
    email: "flopez@clinica.com",
    telefono: "984 654 987",
    cmp: "089012",
    area: "medicina_general",
    especialidad: "Médico General",
    horario: "7:00 AM - 3:00 PM",
    cuposDia: 20,
    direccion: "Av. Arequipa 654, Lima",
    estado: "inactivo",
  },
]);

const medicosFiltrados = computed(() => {
  return medicos.value.filter((medico) => {
    const cumpleArea =
      !filtros.value.area || medico.area === filtros.value.area;
    const cumpleEstado =
      !filtros.value.estado || medico.estado === filtros.value.estado;
    const cumpleBusqueda =
      !filtros.value.busqueda ||
      medico.nombre
        .toLowerCase()
        .includes(filtros.value.busqueda.toLowerCase()) ||
      medico.cmp.includes(filtros.value.busqueda);

    return cumpleArea && cumpleEstado && cumpleBusqueda;
  });
});

// Paginación
const currentPage = ref(1);
const itemsPerPage = ref(5);

const paginatedMedicos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return medicosFiltrados.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(medicosFiltrados.value.length / itemsPerPage.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Resetear página cuando cambian los filtros
watch(medicosFiltrados, () => {
  currentPage.value = 1;
});

const formatArea = (area: string): string => {
  const areas: Record<string, string> = {
    odontologia: "Odontología",
    psicologia: "Psicología",
    nutricion: "Nutrición",
    medicina_general: "Medicina General",
  };
  return areas[area] || area;
};

const obtenerIniciales = (nombre: string): string => {
  const palabras = nombre.split(" ");
  return palabras
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
};

const abrirModalCrear = () => {
  modalForm.value.visible = true;
  modalForm.value.esEdicion = false;
  formData.value = {
    id: 0,
    nombre: "",
    email: "",
    telefono: "",
    cmp: "",
    area: "",
    especialidad: "",
    horario: "",
    cuposDia: 10,
    direccion: "",
  };
};

const editarMedico = (medico: Medico) => {
  modalForm.value.visible = true;
  modalForm.value.esEdicion = true;
  formData.value = {
    id: medico.id,
    nombre: medico.nombre,
    email: medico.email,
    telefono: medico.telefono,
    cmp: medico.cmp,
    area: medico.area,
    especialidad: medico.especialidad,
    horario: medico.horario,
    cuposDia: medico.cuposDia,
    direccion: medico.direccion || "",
  };
  if (modalDetalle.value.visible) {
    cerrarModalDetalle();
  }
};

const guardarMedico = () => {
  if (modalForm.value.esEdicion) {
    // Actualizar médico existente
    const index = medicos.value.findIndex((m) => m.id === formData.value.id);
    if (index !== -1) {
      medicos.value[index] = {
        ...medicos.value[index],
        nombre: formData.value.nombre,
        iniciales: obtenerIniciales(formData.value.nombre),
        email: formData.value.email,
        telefono: formData.value.telefono,
        cmp: formData.value.cmp,
        area: formData.value.area,
        especialidad: formData.value.especialidad,
        horario: formData.value.horario,
        cuposDia: formData.value.cuposDia,
        direccion: formData.value.direccion,
      };
      console.log("Médico actualizado:", medicos.value[index]);
    }
  } else {
    // Crear nuevo médico
    const nuevoMedico: Medico = {
      id: medicos.value.length + 1,
      nombre: formData.value.nombre,
      iniciales: obtenerIniciales(formData.value.nombre),
      email: formData.value.email,
      telefono: formData.value.telefono,
      cmp: formData.value.cmp,
      area: formData.value.area,
      especialidad: formData.value.especialidad,
      horario: formData.value.horario,
      cuposDia: formData.value.cuposDia,
      direccion: formData.value.direccion,
      estado: "activo",
    };
    medicos.value.push(nuevoMedico);
    console.log("Nuevo médico creado:", nuevoMedico);
  }

  cerrarModalForm();
};

const verDetalle = (medico: Medico) => {
  modalDetalle.value.medico = medico;
  modalDetalle.value.visible = true;
};

const toggleEstado = (medico: Medico) => {
  const accion = medico.estado === "activo" ? "desactivar" : "activar";
  if (confirm(`¿Está seguro que desea ${accion} a ${medico.nombre}?`)) {
    medico.estado = medico.estado === "activo" ? "inactivo" : "activo";
    console.log(`Médico ${medico.id} ${accion}do`);
  }
};

const cerrarModalForm = () => {
  modalForm.value.visible = false;
  modalForm.value.esEdicion = false;
};

const cerrarModalDetalle = () => {
  modalDetalle.value.visible = false;
  modalDetalle.value.medico = null;
};
</script>