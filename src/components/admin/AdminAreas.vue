<template>
    <div>
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-800">Gestión de Áreas y Servicios</h1>
                <p class="text-sm text-gray-500 mt-1">Administra las áreas y servicios médicos del centro</p>
            </div>
            <button @click="abrirModalArea"
                class="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2">
                <PlusIcon class="w-5 h-5" />
                Nueva Área
            </button>
        </div>

        <!-- Tabla de Áreas -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden relative min-h-[200px]">
            <!-- Loader -->
            <div v-if="isLoadingListAreas"
                class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div class="flex flex-col items-center">
                    <ArrowPathIcon class="w-10 h-10 animate-spin text-teal-600" />
                    <p class="mt-2 text-gray-500 font-medium">Cargando áreas...</p>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre del Área
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descripción
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
                        <tr v-for="area in areas" :key="area.id" class="hover:bg-gray-50 transition duration-150">
                            <td class="px-6 py-4">
                                <div class="text-sm font-medium text-gray-900">{{ area.nombre }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-500">{{ area.descripcion || 'Sin descripción' }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="[
                                    'px-3 py-1 text-xs font-semibold rounded-full',
                                    area.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                ]">
                                    {{ area.activo ? 'Activo' : 'Inactivo' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <div class="flex gap-2">
                                    <button @click="editarArea(area)"
                                        class="text-blue-600 hover:text-blue-800 transition p-2 rounded-lg hover:bg-blue-50"
                                        title="Editar área">
                                        <PencilIcon class="w-5 h-5" />
                                    </button>
                                    <button @click="eliminarArea(area.id)"
                                        class="text-red-600 hover:text-red-800 transition p-2 rounded-lg hover:bg-red-50"
                                        title="Eliminar área">
                                        <TrashIcon class="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="areas.length === 0">
                            <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                                <BuildingOfficeIcon class="w-16 h-16 mx-auto text-gray-400 mb-2" />
                                <p>No hay áreas registradas</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal de Crear/Editar Área -->
        <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="modalAreaVisible"
                class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                @click.self="cerrarModalArea">
                <div class="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl transform transition-all">
                    <div class="flex justify-between items-start mb-6">
                        <h3 class="text-2xl font-bold text-gray-800">
                            {{ esEdicionArea ? 'Editar Área' : 'Nueva Área' }}
                        </h3>
                        <button @click="cerrarModalArea" class="text-gray-400 hover:text-gray-600 transition">
                            <XMarkIcon class="w-6 h-6" />
                        </button>
                    </div>

                    <form @submit="guardarArea" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Nombre del Área <span class="text-red-500">*</span>
                            </label>
                            <input v-model="nombre" v-bind="nombreAttrs" type="text"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                :class="{ 'border-red-500': areaErrors.nombre }" placeholder="Ej. Cardiología" />
                            <span class="text-red-500 text-xs mt-1">{{ areaErrors.nombre }}</span>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea v-model="descripcion" v-bind="descripcionAttrs" rows="3"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                placeholder="Descripción breve del área o servicio..."></textarea>
                        </div>

                        <div class="flex items-center gap-2">
                            <input type="checkbox" id="areaActiva" v-model="activo" v-bind="activoAttrs"
                                class="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500">
                            <label for="areaActiva" class="text-sm text-gray-700">Área activa</label>
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button type="submit" :disabled="isLoadingArea"
                                class="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2">
                                <ArrowPathIcon v-if="isLoadingArea" class="w-5 h-5 animate-spin" />
                                <CheckIcon v-else class="w-5 h-5" />
                                {{ isLoadingArea ? 'Guardando...' : (esEdicionArea ? 'Actualizar' : 'Crear Área') }}
                            </button>
                            <button type="button" @click="cerrarModalArea"
                                class="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </transition>

        <!-- Toast de notificaciones -->
        <transition enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 transform translate-y-2" enter-to-class="opacity-100 transform translate-y-0"
            leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 transform translate-y-0"
            leave-to-class="opacity-0 transform translate-y-2">
            <div v-if="showToast"
                class="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50">
                <CheckCircleIcon class="w-6 h-6" />
                <span class="font-medium">{{ toastMessage }}</span>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../../services/api'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import {
    PlusIcon,
    ArrowPathIcon,
    PencilIcon,
    TrashIcon,
    BuildingOfficeIcon,
    XMarkIcon,
    CheckIcon,
    CheckCircleIcon
} from '@heroicons/vue/24/outline'

interface Area {
    id: number
    nombre: string
    descripcion: string
    activo: boolean
}

const areas = ref<Area[]>([])

const modalAreaVisible = ref(false)
const esEdicionArea = ref(false)
const isLoadingArea = ref(false)
const isLoadingListAreas = ref(false)
const currentAreaId = ref<number | null>(null)
const showToast = ref(false)
const toastMessage = ref('')
const errorMessage = ref('')

// Esquema de validación
const areaSchema = yup.object({
    nombre: yup.string().required('El nombre del área es obligatorio'),
    descripcion: yup.string().nullable(),
    activo: yup.boolean().default(true)
})

const { handleSubmit: handleAreaSubmit, resetForm: resetAreaForm, errors: areaErrors, defineField: defineAreaField } = useForm({
    validationSchema: areaSchema,
    initialValues: {
        nombre: '',
        descripcion: '',
        activo: true
    }
})

const [nombre, nombreAttrs] = defineAreaField('nombre')
const [descripcion, descripcionAttrs] = defineAreaField('descripcion')
const [activo, activoAttrs] = defineAreaField('activo')

const abrirModalArea = () => {
    modalAreaVisible.value = true
    esEdicionArea.value = false
    currentAreaId.value = null
    resetAreaForm({
        values: {
            nombre: '',
            descripcion: '',
            activo: true
        }
    })
}

const editarArea = (area: Area) => {
    modalAreaVisible.value = true
    esEdicionArea.value = true
    currentAreaId.value = area.id
    resetAreaForm({
        values: {
            nombre: area.nombre,
            descripcion: area.descripcion,
            activo: area.activo
        }
    })
}

const cerrarModalArea = () => {
    modalAreaVisible.value = false
    esEdicionArea.value = false
    currentAreaId.value = null
    resetAreaForm()
}

const fetchAreas = async () => {
    isLoadingListAreas.value = true
    try {
        const { data } = await api.get('/areas/')
        areas.value = data
    } catch (error) {
        console.error('Error al obtener áreas:', error)
        mostrarError('Error al cargar áreas')
    } finally {
        isLoadingListAreas.value = false
    }
}

const guardarArea = handleAreaSubmit(async (values) => {
    isLoadingArea.value = true
    errorMessage.value = ''

    const payload = {
        nombre: values.nombre,
        descripcion: values.descripcion,
        activo: values.activo
    }

    try {
        if (esEdicionArea.value && currentAreaId.value) {
            await api.put(`/areas/${currentAreaId.value}`, payload)
            mostrarToast('Área actualizada exitosamente')
        } else {
            await api.post('/areas/', payload)
            mostrarToast('Área creada exitosamente')
        }
        await fetchAreas()
        cerrarModalArea()
    } catch (error: any) {
        console.error('Error al guardar área:', error)
        errorMessage.value = error?.response?.data?.message || 'Error al guardar área'
    } finally {
        isLoadingArea.value = false
    }
})

const eliminarArea = async (id: number) => {
    if (!confirm('¿Está seguro que desea eliminar esta área?')) return

    try {
        await api.delete(`/areas/${id}`)
        await fetchAreas()
        mostrarToast('Área eliminada exitosamente')
    } catch (error) {
        console.error('Error al eliminar área:', error)
        mostrarError('Error al eliminar área')
    }
}

const mostrarToast = (mensaje: string) => {
    toastMessage.value = mensaje
    showToast.value = true
    setTimeout(() => {
        showToast.value = false
    }, 3000)
}

const mostrarError = (mensaje: string) => {
    errorMessage.value = mensaje
    // Optionally show error toast or alert
}

onMounted(() => {
    fetchAreas()
})
</script>
