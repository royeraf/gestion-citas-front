<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Administración de Citas</h1>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Filtros de Búsqueda</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Filtro por fecha -->
        <div>
          <label for="filtroFecha" class="block text-sm font-medium text-gray-700 mb-2">
            Fecha
          </label>
          <input type="date" id="filtroFecha" v-model="filtros.fecha"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
        </div>

        <!-- Filtro por área -->
        <div>
          <label for="filtroArea" class="block text-sm font-medium text-gray-700 mb-2">
            Área
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

        <!-- Filtro por estado -->
        <div>
          <label for="filtroEstado" class="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select id="filtroEstado" v-model="filtros.estado"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white">
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="atendida">Atendida</option>
            <option value="referido">Referido</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <!-- Buscar por paciente -->
        <div>
          <label for="filtroPaciente" class="block text-sm font-medium text-gray-700 mb-2">
            Buscar Paciente
          </label>
          <input type="text" id="filtroPaciente" v-model="filtros.paciente" placeholder="DNI o nombre"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
        </div>
      </div>

      <div class="flex gap-3 mt-4">
        <button @click="aplicarFiltros"
          class="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition duration-200">
          Buscar
        </button>
        <button @click="limpiarFiltros"
          class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200">
          Limpiar
        </button>
      </div>
    </div>

    <!-- Tabla de citas -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha/Hora
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paciente
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Área
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doctor
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
            <tr v-if="isLoading">
              <td colspan="6" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center">
                  <i class="pi pi-spin pi-spinner text-4xl text-emerald-500 mb-3"></i>
                  <span class="text-gray-500 font-medium">Cargando citas...</span>
                </div>
              </td>
            </tr>
            <template v-else>
              <tr v-for="cita in citas" :key="cita.id" class="hover:bg-gray-50 transition duration-150">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ formatFechaHora(cita.fecha_registro).fecha }}</div>
                  <div class="text-sm text-gray-500">{{ formatFechaHora(cita.fecha_registro).hora }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ getNombreCompleto(cita.paciente) }}</div>
                  <div class="text-sm text-gray-500">DNI: {{ cita.paciente.dni }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatArea(cita.area) }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ cita.doctor_nombre || 'Dr. ID: ' + cita.doctor_id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getEstadoClass(cita.estado)">
                    {{ formatEstado(cita.estado) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex gap-2">
                    <button @click="verDetalle(cita)" class="text-blue-600 hover:text-blue-800 transition"
                      title="Ver detalle">
                      <i class="pi pi-eye text-lg"></i>
                    </button>
                    <button v-if="cita.estado === 'pendiente'" @click="confirmarCita(cita.id)"
                      class="text-green-600 hover:text-green-800 transition" title="Confirmar cita">
                      <i class="pi pi-check text-lg"></i>
                    </button>
                    <button v-if="!['atendida', 'cancelada', 'referido'].includes(cita.estado)"
                      @click="cambiarEstado(cita.id, 'atendida')"
                      class="text-purple-600 hover:text-purple-800 transition" title="Marcar como atendida">
                      <i class="pi pi-check-circle text-lg"></i>
                    </button>
                    <button v-if="!['atendida', 'cancelada', 'referido'].includes(cita.estado)"
                      @click="cambiarEstado(cita.id, 'referido')"
                      class="text-orange-600 hover:text-orange-800 transition" title="Referir a otro hospital">
                      <i class="pi pi-send text-lg"></i>
                    </button>
                    <button v-if="!['atendida', 'cancelada', 'referido'].includes(cita.estado)"
                      @click="cancelarCita(cita.id)" class="text-red-600 hover:text-red-800 transition"
                      title="Cancelar cita">
                      <i class="pi pi-times text-lg"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="citas.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  No se encontraron citas con los filtros aplicados
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="totalItems > 0"
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
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span>
            de
            <span class="font-medium">{{ totalItems }}</span>
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
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="modalDetalle.visible"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        @click.self="cerrarModal">
        <div class="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl transform transition-all">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-2xl font-bold text-gray-800">Detalle de la Cita</h3>
            <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600 transition">
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>

          <div v-if="modalDetalle.cita" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Paciente</p>
                <p class="font-semibold text-gray-800">{{ getNombreCompleto(modalDetalle.cita.paciente) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">DNI</p>
                <p class="font-semibold text-gray-800">{{ modalDetalle.cita.paciente.dni }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Fecha y Hora</p>
                <p class="font-semibold text-gray-800">{{ formatFechaHora(modalDetalle.cita.fecha_registro).fecha }} -
                  {{
                    formatFechaHora(modalDetalle.cita.fecha_registro).hora }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Estado</p>
                <span :class="getEstadoClass(modalDetalle.cita.estado)">
                  {{ formatEstado(modalDetalle.cita.estado) }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-500">Área</p>
                <p class="font-semibold text-gray-800">{{ formatArea(modalDetalle.cita.area) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Doctor</p>
                <p class="font-semibold text-gray-800">{{ modalDetalle.cita.doctor_nombre || 'Dr. ID: ' +
                  modalDetalle.cita.doctor_id }}</p>
              </div>
            </div>

            <div>
              <p class="text-sm text-gray-500 mb-2">Síntomas</p>
              <p class="text-gray-800 bg-gray-50 p-3 rounded-lg">{{ modalDetalle.cita.sintomas }}</p>
            </div>

            <div v-if="modalDetalle.cita.observaciones">
              <p class="text-sm text-gray-500 mb-2">Observaciones</p>
              <p class="text-gray-800 bg-gray-50 p-3 rounded-lg">{{ modalDetalle.cita.observaciones }}</p>
            </div>

            <div class="flex gap-3 pt-4 border-t">
              <button v-if="modalDetalle.cita.estado === 'pendiente'" @click="confirmarCita(modalDetalle.cita.id)"
                class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition">
                Confirmar Cita
              </button>
              <button v-if="!['atendida', 'cancelada', 'referido'].includes(modalDetalle.cita.estado)"
                @click="cambiarEstado(modalDetalle.cita.id, 'atendida')"
                class="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition">
                Marcar como Atendida
              </button>
              <button v-if="!['atendida', 'cancelada', 'referido'].includes(modalDetalle.cita.estado)"
                @click="cambiarEstado(modalDetalle.cita.id, 'referido')"
                class="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition">
                Referir Paciente
              </button>
              <button @click="cerrarModal"
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
import { ref, onMounted, watch } from 'vue'
import citaService from '../services/citaService'

interface Paciente {
  id: number
  nombres: string
  apellido_paterno: string
  apellido_materno: string
  dni: string
}

interface Cita {
  id: number
  fecha_registro: string
  estado: string
  area: string
  doctor_id: number
  sintomas: string
  observaciones?: string
  paciente: Paciente
  // Optional fields that might come from backend or be computed
  doctor_nombre?: string
}

interface Filtros {
  fecha: string
  area: string
  estado: string
  paciente: string
}

const filtros = ref<Filtros>({
  fecha: '',
  area: '',
  estado: '',
  paciente: ''
})

const modalDetalle = ref<{
  visible: boolean
  cita: Cita | null
}>({
  visible: false,
  cita: null
})

const citas = ref<Cita[]>([])
const totalItems = ref(0)
const totalPages = ref(0)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const isLoading = ref(false)

const fetchCitas = async () => {
  isLoading.value = true
  try {
    const params = {
      page: currentPage.value,
      per_page: itemsPerPage.value,
      fecha: filtros.value.fecha || undefined,
      area: filtros.value.area || undefined,
      estado: filtros.value.estado || undefined,
      // Si es número asumimos DNI, si no, búsqueda general (aunque el backend pide paciente_dni, 
      // la UI tiene un solo campo "Buscar Paciente". Asumiremos que se usa para DNI por ahora 
      // o implementaremos lógica si el backend soporta búsqueda por nombre)
      paciente_dni: filtros.value.paciente || undefined
    }

    const { data } = await citaService.getCitas(params)

    citas.value = data.data
    totalItems.value = data.total
    totalPages.value = data.pages
    currentPage.value = data.current_page
  } catch (error) {
    console.error('Error al cargar citas:', error)
  } finally {
    isLoading.value = false
  }
}

// Paginación
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Observar cambios en página para recargar
watch(currentPage, () => {
  fetchCitas()
})

// Observar cambios en itemsPerPage para recargar y volver a pág 1
watch(itemsPerPage, () => {
  currentPage.value = 1
  fetchCitas()
})

const formatArea = (area: string): string => {
  const areas: Record<string, string> = {
    odontologia: 'Odontología',
    psicologia: 'Psicología',
    nutricion: 'Nutrición',
    medicina_general: 'Medicina General'
  }
  return areas[area] || area
}

const formatEstado = (estado: string): string => {
  const estados: Record<string, string> = {
    pendiente: 'Pendiente',
    confirmada: 'Confirmada',
    atendida: 'Atendida',
    cancelada: 'Cancelada',
    referido: 'Referido'
  }
  return estados[estado] || estado
}

const getEstadoClass = (estado: string): string => {
  const classes: Record<string, string> = {
    pendiente: 'px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800',
    confirmada: 'px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800',
    atendida: 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
    cancelada: 'px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800',
    referido: 'px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800'
  }
  return classes[estado] || 'px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800'
}

const aplicarFiltros = () => {
  currentPage.value = 1
  fetchCitas()
}

const limpiarFiltros = () => {
  filtros.value = {
    fecha: '',
    area: '',
    estado: '',
    paciente: ''
  }
  aplicarFiltros()
}

const verDetalle = async (cita: Cita) => {
  try {
    // Obtener detalle completo si es necesario
    const { data } = await citaService.getCita(cita.id)
    modalDetalle.value.cita = data
    modalDetalle.value.visible = true
  } catch (error) {
    console.error('Error al obtener detalle de cita:', error)
  }
}

const cerrarModal = () => {
  modalDetalle.value.visible = false
  modalDetalle.value.cita = null
}

const confirmarCita = async (id: number) => {
  try {
    await citaService.actualizarCita(id, { estado: 'confirmada' })
    fetchCitas()
    if (modalDetalle.value.visible) cerrarModal()
  } catch (error) {
    console.error('Error al confirmar cita:', error)
  }
}

const cambiarEstado = async (id: number, nuevoEstado: string) => {
  try {
    await citaService.actualizarCita(id, { estado: nuevoEstado })
    fetchCitas()
    if (modalDetalle.value.visible) cerrarModal()
  } catch (error) {
    console.error(`Error al cambiar estado a ${nuevoEstado}:`, error)
  }
}

const cancelarCita = async (id: number) => {
  if (confirm('¿Está seguro que desea cancelar esta cita?')) {
    try {
      // Opción 1: Actualizar estado a cancelada
      await citaService.actualizarCita(id, { estado: 'cancelada' })
      // Opción 2: Eliminar registro (según requerimiento backend "Eliminar Cita" es DELETE)
      // El usuario dijo: "Eliminar Cita... Elimina permanentemente". 
      // Pero también hay estado "cancelada". 
      // Usualmente cancelar es cambiar estado. Eliminar es borrar.
      // Voy a asumir que el botón "Cancelar" cambia el estado a 'cancelada'.
      // Si hubiera un botón "Eliminar", usaría delete.

      fetchCitas()
    } catch (error) {
      console.error('Error al cancelar cita:', error)
    }
  }
}

// Helpers para formato de fecha y nombre
const formatFechaHora = (fechaRegistro: string) => {
  if (!fechaRegistro) return { fecha: '', hora: '' }
  const date = new Date(fechaRegistro)
  return {
    fecha: date.toLocaleDateString(),
    hora: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}

const getNombreCompleto = (p: Paciente) => {
  if (!p) return 'Desconocido'
  return `${p.nombres} ${p.apellido_paterno} ${p.apellido_materno}`
}

onMounted(() => {
  fetchCitas()
})
</script>