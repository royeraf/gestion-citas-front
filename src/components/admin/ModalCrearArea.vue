<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="visible"
            class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            @click.self="cerrar">
            <div
                class="bg-white rounded-2xl max-w-lg w-full shadow-2xl transform transition-all max-h-[90vh] overflow-hidden flex flex-col">

                <!-- Header del modal -->
                <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-xl font-bold">{{ esEdicion ? 'Editar Área' : 'Nueva Área' }}</h3>
                            <p class="text-teal-100 text-sm mt-1">{{ esEdicion ? 'Actualiza los datos del área' :
                                'Registra una nueva área o servicio' }}</p>
                        </div>
                        <button @click="cerrar"
                            class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
                            <XMarkIcon class="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                <!-- Contenido del modal -->
                <div class="p-6 overflow-y-auto flex-1">
                    <form @submit="onSubmit" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Nombre del Área <span class="text-red-500">*</span>
                            </label>
                            <input v-model="nombre" v-bind="nombreAttrs" type="text"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                :class="{ 'border-red-500': errors.nombre }" placeholder="Ej. Cardiología" />
                            <span v-if="errors.nombre" class="text-red-500 text-xs mt-1">{{ errors.nombre }}</span>
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
                            <button type="submit" :disabled="loading"
                                class="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                                <ArrowPathIcon v-if="loading" class="w-5 h-5 animate-spin" />
                                <CheckIcon v-else class="w-5 h-5" />
                                {{ loading ? 'Guardando...' : (esEdicion ? 'Actualizar' : 'Crear Área') }}
                            </button>
                            <button type="button" @click="cerrar"
                                class="px-6 py-3 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl transition">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import api from '../../services/api'
import {
    XMarkIcon,
    ArrowPathIcon,
    CheckIcon
} from '@heroicons/vue/24/outline'

interface Area {
    id: number
    nombre: string
    descripcion: string
    activo: boolean
}

interface Props {
    visible: boolean
    area: Area | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'close'): void
    (e: 'saved'): void
}>()

const loading = ref(false)
const esEdicion = computed(() => !!props.area)

// Esquema de validación
const schema = yup.object({
    nombre: yup.string().required('El nombre del área es obligatorio'),
    descripcion: yup.string().nullable(),
    activo: yup.boolean().default(true)
})

const { handleSubmit, resetForm, errors, defineField, setValues } = useForm({
    validationSchema: schema,
    initialValues: {
        nombre: '',
        descripcion: '',
        activo: true
    }
})

const [nombre, nombreAttrs] = defineField('nombre')
const [descripcion, descripcionAttrs] = defineField('descripcion')
const [activo, activoAttrs] = defineField('activo')

watch(() => props.visible, (newVal) => {
    if (newVal) {
        if (props.area) {
            setValues({
                nombre: props.area.nombre,
                descripcion: props.area.descripcion,
                activo: props.area.activo
            })
        } else {
            resetForm({
                values: {
                    nombre: '',
                    descripcion: '',
                    activo: true
                }
            })
        }
    }
})

const cerrar = () => {
    emit('close')
    resetForm()
}

const onSubmit = handleSubmit(async (values) => {
    loading.value = true
    try {
        const payload = {
            nombre: values.nombre,
            descripcion: values.descripcion,
            activo: values.activo
        }

        if (esEdicion.value && props.area) {
            await api.put(`/areas/${props.area.id}`, payload)
        } else {
            await api.post('/areas/', payload)
        }

        emit('saved')
        cerrar()
    } catch (error: any) {
        console.error('Error al guardar área:', error)
        // Aquí podrías manejar el error, p.ej. emitiendo un evento o mostrando una alerta
    } finally {
        loading.value = false
    }
})
</script>
