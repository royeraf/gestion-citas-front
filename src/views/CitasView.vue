<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Administración de Citas</h1>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Filtros de Búsqueda</h2>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Filtro por fecha de cita -->
        <div>
          <label for="filtroFecha" class="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Cita
          </label>
          <input type="date" id="filtroFecha" v-model="filtros.fecha"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
        </div>

        <!-- Filtro por área (dinámico) -->
        <div>
          <label for="filtroArea" class="block text-sm font-medium text-gray-700 mb-2">
            Área
          </label>
          <select id="filtroArea" v-model="filtros.area"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white">
            <option value="">Todas las áreas</option>
            <option v-for="area in areas" :key="area.id" :value="area.nombre">
              {{ area.nombre }}
            </option>
          </select>
        </div>

        <!-- Filtro por turno -->
        <div>
          <label for="filtroTurno" class="block text-sm font-medium text-gray-700 mb-2">
            Turno
          </label>
          <select id="filtroTurno" v-model="filtros.turno"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white">
            <option value="">Todos los turnos</option>
            <option value="M">Mañana</option>
            <option value="T">Tarde</option>
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

        <!-- Buscar por paciente (DNI) -->
        <div>
          <label for="filtroPaciente" class="block text-sm font-medium text-gray-700 mb-2">
            DNI Paciente
          </label>
          <input type="text" id="filtroPaciente" v-model="filtros.paciente_dni" placeholder="DNI del paciente"
            maxlength="8"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
        </div>
      </div>

      <div class="flex gap-3 mt-4">
        <button @click="aplicarFiltros"
          class="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2">
          <MagnifyingGlassIcon class="w-5 h-5" />
          Buscar
        </button>
        <button @click="limpiarFiltros"
          class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2">
          <XMarkIcon class="w-5 h-5" />
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
                Fecha / Turno
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
                  <ArrowPathIcon class="w-10 h-10 text-emerald-500 mb-3 animate-spin" />
                  <span class="text-gray-500 font-medium">Cargando citas...</span>
                </div>
              </td>
            </tr>
            <template v-else>
              <tr v-for="cita in citas" :key="cita.id" class="hover:bg-gray-50 transition duration-150">
                <!-- Fecha y Turno -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="cita.fecha" class="text-sm font-medium text-gray-900">
                    {{ formatFecha(cita.fecha) }}
                  </div>
                  <div v-else class="text-sm font-medium text-gray-500">
                    Sin programar
                  </div>
                  <!-- Mostrar turno si existe -->
                  <div v-if="cita.horario_turno" class="mt-1">
                    <span :class="[
                      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                      cita.horario_turno === 'M'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-indigo-100 text-indigo-800'
                    ]">
                      <SunIcon v-if="cita.horario_turno === 'M'" class="w-3 h-3 mr-1" />
                      <MoonIcon v-else class="w-3 h-3 mr-1" />
                      {{ cita.horario_turno_nombre }}
                    </span>
                  </div>
                  <!-- Horario si existe -->
                  <div v-if="cita.horario" class="text-xs text-gray-500 mt-1">
                    {{ cita.horario.hora_inicio?.slice(0, 5) }} - {{ cita.horario.hora_fin?.slice(0, 5) }}
                  </div>
                </td>
                <!-- Paciente -->
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ getNombreCompleto(cita.paciente) }}</div>
                  <div class="text-sm text-gray-500">DNI: {{ cita.paciente?.dni || 'N/A' }}</div>
                  <div v-if="cita.paciente?.telefono" class="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <PhoneIcon class="w-3 h-3" />
                    {{ cita.paciente.telefono }}
                  </div>
                </td>
                <!-- Área -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ cita.area_nombre || cita.area || 'N/A' }}</div>
                </td>
                <!-- Doctor -->
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ cita.doctor_nombre || 'Sin asignar' }}</div>
                </td>
                <!-- Estado -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getEstadoClass(cita.estado)">
                    {{ formatEstado(cita.estado) }}
                  </span>
                </td>
                <!-- Acciones -->
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div v-if="procesandoCitaId === cita.id"
                    class="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    <ArrowPathIcon class="w-4 h-4 animate-spin" />
                    <span class="text-xs font-medium">Procesando...</span>
                  </div>
                  <div v-else class="flex gap-2">
                    <button @click="verDetalle(cita)" class="text-blue-600 hover:text-blue-800 transition"
                      title="Ver detalle">
                      <EyeIcon class="w-5 h-5" />
                    </button>
                    <button v-if="cita.estado === 'pendiente'" @click="confirmarCita(cita.id)"
                      class="text-green-600 hover:text-green-800 transition" title="Confirmar cita">
                      <CheckIcon class="w-5 h-5" />
                    </button>
                    <button v-if="!['atendida', 'cancelada', 'referido'].includes(cita.estado)"
                      @click="cambiarEstado(cita.id, 'atendida')"
                      class="text-purple-600 hover:text-purple-800 transition" title="Marcar como atendida">
                      <CheckCircleIcon class="w-5 h-5" />
                    </button>
                    <button v-if="!['atendida', 'cancelada', 'referido'].includes(cita.estado)"
                      @click="cambiarEstado(cita.id, 'referido')"
                      class="text-orange-600 hover:text-orange-800 transition" title="Referir a otro hospital">
                      <PaperAirplaneIcon class="w-5 h-5" />
                    </button>
                    <button v-if="!['atendida', 'cancelada', 'referido'].includes(cita.estado)"
                      @click="cancelarCita(cita.id)" class="text-red-600 hover:text-red-800 transition"
                      title="Cancelar cita">
                      <XMarkIcon class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="citas.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  <div class="flex flex-col items-center">
                    <CalendarIcon class="w-10 h-10 text-gray-300 mb-3" />
                    <p>No se encontraron citas con los filtros aplicados</p>
                  </div>
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
              <ChevronLeftIcon class="w-4 h-4" />
            </button>

            <button v-for="page in paginationPages" :key="page" @click="currentPage = page"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
              :class="page === currentPage ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'">
              {{ page }}
            </button>

            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
              <span class="sr-only">Siguiente</span>
              <ChevronRightIcon class="w-4 h-4" />
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Modal Detalle de Cita -->
    <ModalDetalleCita :visible="modalDetalle.visible" :loading="modalDetalle.loading" :cita="modalDetalle.cita"
      @close="cerrarModal" @confirmar="confirmarCita" @cambiar-estado="cambiarEstado" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import citaService from '../services/citaService'
import api from '../services/api'
import ModalDetalleCita from '../components/citas/ModalDetalleCita.vue'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  PhoneIcon,
  EyeIcon,
  CheckIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  CalendarIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

// Interfaces actualizadas según el nuevo backend
interface Paciente {
  id: number
  nombres: string
  apellido_paterno: string
  apellido_materno: string
  dni: string
  telefono?: string | null
  email?: string | null
  fecha_nacimiento?: string | null
  sexo?: string
  direccion?: string
  seguro?: string | null
}

interface Horario {
  id: number
  turno: 'M' | 'T'
  turno_nombre: string
  hora_inicio: string
  hora_fin: string
  cupos?: number
}

interface Cita {
  id: number
  paciente_id: number
  horario_id: number | null
  doctor_id: number | null
  area_id: number | null
  area: string | null
  area_nombre: string | null
  fecha: string | null          // Fecha de la cita (YYYY-MM-DD)
  fecha_registro: string        // Cuando se registró
  sintomas: string
  estado: string
  doctor_nombre: string | null
  horario_turno: 'M' | 'T' | null
  horario_turno_nombre: string | null
  dni_acompanante: string | null
  nombre_acompanante: string | null
  telefono_acompanante: string | null
  observaciones?: string
  paciente?: Paciente
  horario?: Horario
}

interface Area {
  id: number
  nombre: string
  descripcion?: string
  activo: boolean
}

interface Filtros {
  fecha: string
  area: string
  turno: '' | 'M' | 'T'
  estado: string
  paciente_dni: string
}

const filtros = ref<Filtros>({
  fecha: '',
  area: '',
  turno: '',
  estado: '',
  paciente_dni: ''
})

const modalDetalle = ref<{
  visible: boolean
  loading: boolean
  cita: Cita | null
}>({
  visible: false,
  loading: false,
  cita: null
})

const citas = ref<Cita[]>([])
const areas = ref<Area[]>([])
const totalItems = ref(0)
const totalPages = ref(0)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const isLoading = ref(false)
const procesandoCitaId = ref<number | null>(null)

// Computed para limitar páginas en paginación
const paginationPages = computed(() => {
  const pages: number[] = []
  const maxPages = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
  const end = Math.min(totalPages.value, start + maxPages - 1)

  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Cargar áreas desde el backend
const fetchAreas = async () => {
  try {
    const { data } = await api.get<Area[]>('/areas/')
    areas.value = data.filter(a => a.activo)
  } catch (error) {
    console.error('Error al cargar áreas:', error)
  }
}

const fetchCitas = async () => {
  isLoading.value = true
  try {
    const params = {
      page: currentPage.value,
      per_page: itemsPerPage.value,
      fecha: filtros.value.fecha || undefined,
      area: filtros.value.area || undefined,
      turno: (filtros.value.turno || undefined) as 'M' | 'T' | undefined,
      estado: filtros.value.estado || undefined,
      paciente_dni: filtros.value.paciente_dni || undefined
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

// Función para formatear fecha de cita (solo fecha, sin hora)
const formatFecha = (fechaStr: string): string => {
  if (!fechaStr) return ''
  const fecha = new Date(fechaStr + 'T00:00:00') // Evitar problemas de timezone
  return fecha.toLocaleDateString('es-PE', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
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
    turno: '',
    estado: '',
    paciente_dni: ''
  }
  aplicarFiltros()
}

const verDetalle = async (cita: Cita) => {
  // Abrir modal inmediatamente con estado de carga
  modalDetalle.value.visible = true
  modalDetalle.value.loading = true
  modalDetalle.value.cita = null

  try {
    // Obtener detalle completo
    const { data } = await citaService.getCita(cita.id)
    modalDetalle.value.cita = data as Cita
  } catch (error) {
    console.error('Error al obtener detalle de cita:', error)
    cerrarModal()
  } finally {
    modalDetalle.value.loading = false
  }
}

const cerrarModal = () => {
  modalDetalle.value.visible = false
  modalDetalle.value.loading = false
  modalDetalle.value.cita = null
}

const confirmarCita = async (id: number) => {
  const result = await Swal.fire({
    title: '¿Confirmar cita?',
    text: "La cita pasará a estado confirmada",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10B981',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    procesandoCitaId.value = id
    try {
      await citaService.actualizarCita(id, { estado: 'confirmada' })
      await fetchCitas()
      if (modalDetalle.value.visible) cerrarModal()
      Swal.fire({
        title: '¡Confirmada!',
        text: 'La cita ha sido confirmada exitosamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('Error al confirmar cita:', error)
      Swal.fire('Error', 'No se pudo confirmar la cita', 'error')
    } finally {
      procesandoCitaId.value = null
    }
  }
}

const cambiarEstado = async (id: number, nuevoEstado: string) => {
  const estadosLabel: Record<string, string> = {
    'atendida': 'Atendida',
    'referido': 'Referido',
    'cancelada': 'Cancelada'
  }

  const colors: Record<string, string> = {
    'atendida': '#8B5CF6',
    'referido': '#F97316',
    'cancelada': '#EF4444'
  }

  const result = await Swal.fire({
    title: `¿Marcar como ${estadosLabel[nuevoEstado]}?`,
    text: `La cita cambiará a estado ${nuevoEstado}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: colors[nuevoEstado] || '#3B82F6',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Sí, cambiar estado',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    procesandoCitaId.value = id
    try {
      await citaService.actualizarCita(id, { estado: nuevoEstado })
      await fetchCitas()
      if (modalDetalle.value.visible) cerrarModal()
      Swal.fire({
        title: '¡Actualizado!',
        text: `La cita ha sido marcada como ${estadosLabel[nuevoEstado]}.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      console.error(`Error al cambiar estado a ${nuevoEstado}:`, error)
      Swal.fire('Error', 'No se pudo actualizar el estado', 'error')
    } finally {
      procesandoCitaId.value = null
    }
  }
}

const cancelarCita = async (id: number) => {
  const result = await Swal.fire({
    title: '¿Cancelar esta cita?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#EF4444',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Sí, cancelar cita',
    cancelButtonText: 'No, mantener'
  })

  if (result.isConfirmed) {
    procesandoCitaId.value = id
    try {
      await citaService.actualizarCita(id, { estado: 'cancelada' })
      await fetchCitas()
      Swal.fire({
        title: 'Cancelada',
        text: 'La cita ha sido cancelada.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('Error al cancelar cita:', error)
      Swal.fire('Error', 'No se pudo cancelar la cita', 'error')
    } finally {
      procesandoCitaId.value = null
    }
  }
}

const getNombreCompleto = (p: Paciente | undefined) => {
  if (!p) return 'Desconocido'
  return `${p.nombres} ${p.apellido_paterno} ${p.apellido_materno}`
}

onMounted(() => {
  fetchAreas()
  fetchCitas()
})
</script>