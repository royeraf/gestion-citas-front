<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="visible"
            class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
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
                    <form @submit="onSubmit" class="space-y-4">
                        <!-- Sección: Datos Personales -->
                        <div class="border-b border-gray-200 pb-4 mb-4">
                            <h4
                                class="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <UserIcon class="w-4 h-4" />
                                Datos Personales
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="col-span-1 md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Nombres <span class="text-red-500">*</span>
                                    </label>
                                    <input v-model="nombres" v-bind="nombresAttrs" type="text"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:outline-none uppercase"
                                        :class="{ 'border-red-500': errors.nombres }" placeholder="JUAN CARLOS"
                                        @input="nombres = ($event.target as HTMLInputElement).value.toUpperCase()" />
                                    <span v-if="errors.nombres" class="text-red-500 text-xs mt-1">{{ errors.nombres
                                        }}</span>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Apellido Paterno <span class="text-red-500">*</span>
                                    </label>
                                    <input v-model="apellidoPaterno" v-bind="apellidoPaternoAttrs" type="text"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:outline-none uppercase"
                                        :class="{ 'border-red-500': errors.apellidoPaterno }" placeholder="PÉREZ"
                                        @input="apellidoPaterno = ($event.target as HTMLInputElement).value.toUpperCase()" />
                                    <span v-if="errors.apellidoPaterno" class="text-red-500 text-xs mt-1">{{
                                        errors.apellidoPaterno }}</span>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Apellido Materno <span class="text-red-500">*</span>
                                    </label>
                                    <input v-model="apellidoMaterno" v-bind="apellidoMaternoAttrs" type="text"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:outline-none uppercase"
                                        :class="{ 'border-red-500': errors.apellidoMaterno }" placeholder="GARCÍA"
                                        @input="apellidoMaterno = ($event.target as HTMLInputElement).value.toUpperCase()" />
                                    <span v-if="errors.apellidoMaterno" class="text-red-500 text-xs mt-1">{{
                                        errors.apellidoMaterno }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Sección: Credenciales -->
                        <div class="border-b border-gray-200 pb-4 mb-4">
                            <h4
                                class="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <KeyIcon class="w-4 h-4" />
                                Credenciales de Acceso
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        DNI <span class="text-red-500">*</span>
                                    </label>
                                    <div class="relative">
                                        <input v-model="dni" v-bind="dniAttrs" type="text" maxlength="8"
                                            class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:outline-none"
                                            :class="{
                                                'border-red-500': errors.dni,
                                                'border-green-500 bg-green-50': dniVerificado,
                                                'border-blue-500': verificandoDni
                                            }" placeholder="12345678" />
                                        <div class="absolute right-3 top-1/2 -translate-y-1/2">
                                            <ArrowPathIcon v-if="verificandoDni"
                                                class="w-5 h-5 text-blue-500 animate-spin" />
                                            <CheckCircleIcon v-else-if="dniVerificado" class="w-5 h-5 text-green-500" />
                                        </div>
                                    </div>
                                    <span v-if="errors.dni" class="text-red-500 text-xs mt-1">{{ errors.dni }}</span>
                                    <span v-else-if="verificandoDni"
                                        class="text-blue-600 text-xs mt-1 flex items-center gap-1">
                                        <ArrowPathIcon class="w-3 h-3 animate-spin" /> Verificando DNI en RENIEC...
                                    </span>
                                    <span v-else-if="dniVerificado"
                                        class="text-green-600 text-xs mt-1 flex items-center gap-1">
                                        <CheckIcon class="w-3 h-3" /> DNI verificado - datos autocompletados
                                    </span>
                                    <span v-else-if="dni.length === 8 && !esEdicion" class="text-gray-500 text-xs mt-1">
                                        Ingrese un DNI válido para autocompletar datos
                                    </span>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Contraseña <span v-if="!esEdicion" class="text-red-500">*</span>
                                    </label>
                                    <div class="relative">
                                        <input v-model="password" v-bind="passwordAttrs"
                                            :type="showPassword ? 'text' : 'password'"
                                            class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:outline-none"
                                            :class="{ 'border-red-500': errors.password }"
                                            :placeholder="esEdicion ? 'Dejar vacío para mantener' : '********'" />
                                        <button type="button" @click="showPassword = !showPassword"
                                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                                            <EyeSlashIcon v-if="showPassword" class="w-5 h-5" />
                                            <EyeIcon v-else class="w-5 h-5" />
                                        </button>
                                    </div>
                                    <span v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password
                                        }}</span>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Confirmar Contraseña <span v-if="!esEdicion" class="text-red-500">*</span>
                                    </label>
                                    <div class="relative">
                                        <input v-model="confirmPassword" v-bind="confirmPasswordAttrs"
                                            :type="showConfirmPassword ? 'text' : 'password'"
                                            class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:outline-none"
                                            :class="{ 'border-red-500': errors.confirmPassword }"
                                            :placeholder="esEdicion ? 'Dejar vacío para mantener' : '********'" />
                                        <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                                            <EyeSlashIcon v-if="showConfirmPassword" class="w-5 h-5" />
                                            <EyeIcon v-else class="w-5 h-5" />
                                        </button>
                                    </div>
                                    <span v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1">{{
                                        errors.confirmPassword }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Sección: Rol -->
                        <div>
                            <h4
                                class="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <ShieldCheckIcon class="w-4 h-4" />
                                Rol del Sistema
                            </h4>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Rol <span class="text-red-500">*</span>
                                </label>
                                <select v-model="role" v-bind="roleAttrs"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:outline-none bg-white"
                                    :class="{ 'border-red-500': errors.role }">
                                    <option value="">Seleccionar rol</option>
                                    <option value="admin">Administrador</option>
                                    <option value="profesional">Profesional</option>
                                    <option value="asistente">Asistente Técnico</option>
                                </select>
                                <span v-if="errors.role" class="text-red-500 text-xs mt-1">{{ errors.role }}</span>
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
import { computed, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import userService from '../../services/userService'
import {
    XMarkIcon,
    CheckIcon,
    ArrowPathIcon,
    ExclamationCircleIcon,
    EyeIcon,
    EyeSlashIcon,
    UserIcon,
    KeyIcon,
    ShieldCheckIcon,
    CheckCircleIcon
} from '@heroicons/vue/24/outline'

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const verificandoDni = ref(false)
const dniVerificado = ref(false)

export interface UserFormData {
    id: number
    nombres: string
    apellidoPaterno: string
    apellidoMaterno: string
    dni: string
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

// Esquema de validación con yup
const schema = computed(() => yup.object({
    nombres: yup.string()
        .required('Los nombres son obligatorios')
        .min(2, 'Los nombres deben tener al menos 2 caracteres')
        .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/, 'Los nombres deben estar en mayúsculas'),
    apellidoPaterno: yup.string()
        .required('El apellido paterno es obligatorio')
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/, 'El apellido debe estar en mayúsculas'),
    apellidoMaterno: yup.string()
        .required('El apellido materno es obligatorio')
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/, 'El apellido debe estar en mayúsculas'),
    dni: yup.string()
        .required('El DNI es obligatorio')
        .matches(/^\d{8}$/, 'El DNI debe contener exactamente 8 dígitos numéricos'),
    password: props.esEdicion
        ? yup.string().nullable()
        : yup.string()
            .required('La contraseña es obligatoria')
            .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: props.esEdicion
        ? yup.string().nullable()
        : yup.string()
            .required('Debe confirmar la contraseña')
            .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
    role: yup.string()
        .required('Debe seleccionar un rol')
        .oneOf(['admin', 'profesional', 'asistente'], 'Seleccione un rol válido')
}))

const { handleSubmit, resetForm, errors, defineField } = useForm({
    validationSchema: schema,
    initialValues: {
        nombres: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        dni: '',
        password: '',
        confirmPassword: '',
        role: ''
    },
    validateOnMount: false
})

// Configuración para validar solo cuando el campo pierde el foco
const fieldConfig = {
    validateOnModelUpdate: false,
    validateOnBlur: true
}

const [nombres, nombresAttrs] = defineField('nombres', fieldConfig)
const [apellidoPaterno, apellidoPaternoAttrs] = defineField('apellidoPaterno', fieldConfig)
const [apellidoMaterno, apellidoMaternoAttrs] = defineField('apellidoMaterno', fieldConfig)
const [dni, dniAttrs] = defineField('dni', fieldConfig)
const [password, passwordAttrs] = defineField('password', fieldConfig)
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword', fieldConfig)
const [role, roleAttrs] = defineField('role', fieldConfig)

watch(() => props.visible, (newVal) => {
    if (newVal && props.userData) {
        // Modo edición: cargar datos del usuario
        resetForm({
            values: {
                nombres: props.userData.nombres,
                apellidoPaterno: props.userData.apellidoPaterno,
                apellidoMaterno: props.userData.apellidoMaterno,
                dni: props.userData.dni,
                password: '',
                confirmPassword: '',
                role: props.userData.role
            }
        })
    } else if (newVal && !props.esEdicion) {
        // Modo nuevo: limpiar formulario y errores
        resetForm({
            values: {
                nombres: '',
                apellidoPaterno: '',
                apellidoMaterno: '',
                dni: '',
                password: '',
                confirmPassword: '',
                role: ''
            }
        })
    }
    // Resetear estado de mostrar contraseña
    showPassword.value = false
    showConfirmPassword.value = false
})

// Watcher para verificar DNI automáticamente cuando tenga 8 dígitos
watch(dni, async (newDni) => {
    // Solo verificar si es modo creación y tiene exactamente 8 dígitos numéricos
    if (!props.esEdicion && /^\d{8}$/.test(newDni)) {
        verificandoDni.value = true
        dniVerificado.value = false

        try {
            const { data } = await userService.verificarDni(newDni)

            // Autocompletar los campos con los datos de RENIEC
            if (data.nombres) {
                nombres.value = data.nombres
                apellidoPaterno.value = data.apellido_paterno || ''
                apellidoMaterno.value = data.apellido_materno || ''
                dniVerificado.value = true
            }
        } catch (error: any) {
            console.error('Error al verificar DNI:', error)
            // No mostrar error, solo dejar que el usuario ingrese manualmente
            dniVerificado.value = false
        } finally {
            verificandoDni.value = false
        }
    } else {
        // Resetear estado si el DNI no tiene 8 dígitos
        dniVerificado.value = false
    }
}, { immediate: false })

const cerrar = () => {
    emit('close')
    resetForm({
        values: {
            nombres: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            dni: '',
            password: '',
            confirmPassword: '',
            role: ''
        }
    })
    showPassword.value = false
    dniVerificado.value = false
}

const onSubmit = handleSubmit((values) => {
    const formData: UserFormData = {
        id: props.userData?.id || 0,
        nombres: values.nombres,
        apellidoPaterno: values.apellidoPaterno,
        apellidoMaterno: values.apellidoMaterno,
        dni: values.dni,
        password: values.password || '',
        role: values.role as 'admin' | 'profesional' | 'asistente' | ''
    }
    emit('save', formData)
})
</script>
