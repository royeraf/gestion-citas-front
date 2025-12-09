<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="visible"
            class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            @click.self="cerrar">
            <div
                class="bg-white rounded-2xl max-w-2xl w-full shadow-2xl transform transition-all max-h-[90vh] overflow-hidden flex flex-col">

                <!-- Header del modal -->
                <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-xl font-bold">{{ esEdicion ? "Editar Médico" : "Nuevo Médico" }}</h3>
                            <p class="text-teal-100 text-sm mt-1">{{ esEdicion ? "Actualiza los datos del médico" :
                                "Registra un nuevo médico en el sistema" }}</p>
                        </div>
                        <button @click="cerrar"
                            class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
                            <XMarkIcon class="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                <!-- Contenido del modal -->
                <div class="p-6 overflow-y-auto flex-1">

                    <form @submit.prevent="guardar" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre Completo <span class="text-red-500">*</span>
                                </label>
                                <input type="text" v-model="form.nombre" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="Dr. Juan Pérez" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    CMP <span class="text-red-500">*</span>
                                </label>
                                <input type="text" v-model="form.cmp" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="123456" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span class="text-red-500">*</span>
                                </label>
                                <input type="email" v-model="form.email" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="doctor@ejemplo.com" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Teléfono <span class="text-red-500">*</span>
                                </label>
                                <input type="tel" v-model="form.telefono" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="999 999 999" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Área <span class="text-red-500">*</span>
                                </label>
                                <select v-model="form.area" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white">
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
                                <input type="text" v-model="form.especialidad" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="Ej: Ortodoncista" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Horario <span class="text-red-500">*</span>
                                </label>
                                <input type="text" v-model="form.horario" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="8:00 AM - 2:00 PM" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Cupos por Día <span class="text-red-500">*</span>
                                </label>
                                <input type="number" v-model.number="form.cuposDia" required min="1" max="50"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="10" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Dirección de Consultorio
                            </label>
                            <input type="text" v-model="form.direccion"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                placeholder="Dirección completa" />
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button type="submit"
                                class="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                                {{ esEdicion ? "Actualizar" : "Registrar" }} Médico
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
import { ref, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface FormData {
    id: number
    nombre: string
    email: string
    telefono: string
    cmp: string
    area: string
    especialidad: string
    horario: string
    cuposDia: number
    direccion: string
}

interface Props {
    visible: boolean
    esEdicion: boolean
    medicoData: FormData | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'save', data: FormData): void
}>()

const form = ref<FormData>({
    id: 0,
    nombre: '',
    email: '',
    telefono: '',
    cmp: '',
    area: '',
    especialidad: '',
    horario: '',
    cuposDia: 10,
    direccion: ''
})

watch(() => props.visible, (newVal) => {
    if (newVal && props.medicoData) {
        form.value = { ...props.medicoData }
    } else if (newVal && !props.esEdicion) {
        form.value = {
            id: 0,
            nombre: '',
            email: '',
            telefono: '',
            cmp: '',
            area: '',
            especialidad: '',
            horario: '',
            cuposDia: 10,
            direccion: ''
        }
    }
})

const cerrar = () => {
    emit('close')
}

const guardar = () => {
    emit('save', { ...form.value })
}
</script>
