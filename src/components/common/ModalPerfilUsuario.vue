<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="visible"
            class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            @click.self="cerrar">
            <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all overflow-hidden">

                <!-- Header con gradiente -->
                <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-8 text-white text-center relative">
                    <button @click="cerrar"
                        class="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
                        <XMarkIcon class="w-5 h-5 text-white" />
                    </button>

                    <!-- Avatar grande -->
                    <div
                        class="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
                        <span v-if="user?.nombres_completos" class="text-white font-bold text-2xl">
                            {{ getInitials }}
                        </span>
                        <UserIcon v-else class="w-10 h-10 text-white" />
                    </div>

                    <h2 class="text-xl font-bold">{{ user?.nombres_completos || 'Usuario' }}</h2>
                    <p class="text-teal-100 text-sm mt-1">{{ getRoleName }}</p>
                </div>

                <!-- Contenido -->
                <div class="p-6 space-y-4">
                    <!-- DNI -->
                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <IdentificationIcon class="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 uppercase font-medium">DNI</p>
                            <p class="text-gray-800 font-semibold">{{ user?.dni || '-' }}</p>
                        </div>
                    </div>

                    <!-- Usuario -->
                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <AtSymbolIcon class="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 uppercase font-medium">Nombre de Usuario</p>
                            <p class="text-gray-800 font-semibold">{{ user?.username || '-' }}</p>
                        </div>
                    </div>

                    <!-- Rol -->
                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                            <ShieldCheckIcon class="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 uppercase font-medium">Rol en el Sistema</p>
                            <p class="text-gray-800 font-semibold">{{ getRoleName }}</p>
                        </div>
                    </div>

                    <!-- Estado -->
                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center"
                            :class="user?.activo ? 'bg-green-100' : 'bg-red-100'">
                            <CheckCircleIcon v-if="user?.activo" class="w-5 h-5 text-green-600" />
                            <XCircleIcon v-else class="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 uppercase font-medium">Estado de la Cuenta</p>
                            <p class="font-semibold" :class="user?.activo ? 'text-green-600' : 'text-red-600'">
                                {{ user?.activo ? 'Activo' : 'Inactivo' }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="px-6 pb-6">
                    <button @click="cerrar"
                        class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
    XMarkIcon,
    UserIcon,
    IdentificationIcon,
    AtSymbolIcon,
    ShieldCheckIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/vue/24/outline'

interface User {
    id: number
    dni: string
    username: string | null
    nombres_completos: string | null
    rol_id: number
    activo: boolean
}

interface Props {
    visible: boolean
    user: User | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

const getInitials = computed(() => {
    if (props.user?.nombres_completos) {
        const words = props.user.nombres_completos.split(' ')
        return words.slice(0, 2).map(w => w[0]).join('').toUpperCase()
    }
    return ''
})

const getRoleName = computed(() => {
    if (props.user?.rol_id) {
        switch (props.user.rol_id) {
            case 1: return 'Administrador'
            case 2: return 'Médico'
            case 3: return 'Asistente'
            default: return 'Usuario'
        }
    }
    return 'Usuario'
})

const cerrar = () => {
    emit('close')
}
</script>
