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
                            <h3 class="text-xl font-bold">{{ esEdicion ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
                            <p class="text-teal-100 text-sm mt-1">{{ esEdicion ? 'Actualiza los datos del usuario' :
                                'Registra un nuevo usuario en el sistema' }}</p>
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
                                <input v-model="form.name" type="text" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="Juan Pérez" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Usuario <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.username" type="text" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="jperez" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.password" type="password" :required="!esEdicion"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    :placeholder="esEdicion ? 'Dejar vacío para mantener' : '********'" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Rol <span class="text-red-500">*</span>
                                </label>
                                <select v-model="form.role" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white">
                                    <option value="">Seleccionar rol</option>
                                    <option value="admin">Administrador</option>
                                    <option value="profesional">Profesional</option>
                                    <option value="asistente">Asistente Técnico</option>
                                </select>
                            </div>
                        </div>

                        <!-- Mensaje de error -->
                        <transition enter-active-class="transition ease-out duration-200"
                            enter-from-class="opacity-0 transform -translate-y-1"
                            enter-to-class="opacity-100 transform translate-y-0">
                            <div v-if="error"
                                class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                                <ExclamationCircleIcon class="w-5 h-5" />
                                <span class="text-sm">{{ error }}</span>
                            </div>
                        </transition>

                        <div class="flex gap-3 pt-4">
                            <button type="submit" :disabled="loading"
                                class="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                                <ArrowPathIcon v-if="loading" class="w-5 h-5 animate-spin" />
                                <CheckIcon v-else class="w-5 h-5" />
                                {{ loading ? 'Guardando...' : (esEdicion ? 'Actualizar' : 'Crear Usuario') }}
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
import {
    XMarkIcon,
    CheckIcon,
    ArrowPathIcon,
    ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

interface UserFormData {
    id: number
    name: string
    username: string
    password: string
    role: 'admin' | 'profesional' | 'asistente' | ''
}

interface Props {
    visible: boolean
    esEdicion: boolean
    userData: UserFormData | null
    loading?: boolean
    error?: string
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    error: ''
})

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'save', data: UserFormData): void
}>()

const form = ref<UserFormData>({
    id: 0,
    name: '',
    username: '',
    password: '',
    role: ''
})

watch(() => props.visible, (newVal) => {
    if (newVal && props.userData) {
        form.value = { ...props.userData }
    } else if (newVal && !props.esEdicion) {
        form.value = {
            id: 0,
            name: '',
            username: '',
            password: '',
            role: ''
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
