<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="visible"
            class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            @click.self="cerrar">
            <div
                class="bg-white rounded-2xl max-w-3xl w-full shadow-2xl transform transition-all max-h-[95vh] overflow-hidden flex flex-col">

                <!-- Header del modal -->
                <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-xl font-bold">{{ esEdicion ? "Editar Profesional" : "Nuevo Profesional" }}
                            </h3>
                            <p class="text-teal-100 text-sm mt-1">
                                {{ subtitulo }}
                            </p>
                        </div>
                        <button @click="cerrar"
                            class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
                            <XMarkIcon class="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                <!-- Contenido del modal -->
                <div class="p-6 overflow-y-auto flex-1 text-left relative">
                    <!-- Loader Overlay -->
                    <div v-if="guardando"
                        class="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center">
                        <div
                            class="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl border border-teal-100">
                            <ArrowPathIcon class="w-12 h-12 text-teal-600 animate-spin mb-4" />
                            <p class="text-teal-900 font-bold text-lg anime-pulse">Procesando solicitud...</p>
                            <p class="text-teal-600/70 text-sm">Por favor, espera un momento</p>
                        </div>
                    </div>

                    <form @submit="onSubmit" class="space-y-6">
                        <!-- Sección Datos Personales -->
                        <div>
                            <h4 class="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-4 border-b pb-2">
                                Datos Personales
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div class="md:col-span-1">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Nombres <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" v-model="nombres" @blur="nombresBlur"
                                        @input="nombres = nombres.toUpperCase()"
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                                        :class="((nombresMeta.touched || submitCount > 0) && errors.nombres) ? 'border-red-500 bg-red-50' : 'border-gray-300'"
                                        placeholder="EJ. JUAN" />
                                    <span class="text-xs text-red-500 mt-1 block h-4">{{ ((nombresMeta.touched ||
                                        submitCount > 0) && errors.nombres) ? errors.nombres : '' }}</span>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Apellido Paterno <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" v-model="apellido_paterno" @blur="apellido_paternoBlur"
                                        @input="apellido_paterno = apellido_paterno.toUpperCase()"
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                                        :class="((apellido_paternoMeta.touched || submitCount > 0) && errors.apellido_paterno) ? 'border-red-500 bg-red-50' : 'border-gray-300'"
                                        placeholder="EJ. PÉREZ" />
                                    <span class="text-xs text-red-500 mt-1 block h-4">{{
                                        ((apellido_paternoMeta.touched || submitCount > 0) &&
                                            errors.apellido_paterno) ? errors.apellido_paterno : '' }}</span>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Apellido Materno <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" v-model="apellido_materno" @blur="apellido_maternoBlur"
                                        @input="apellido_materno = apellido_materno.toUpperCase()"
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                                        :class="((apellido_maternoMeta.touched || submitCount > 0) && errors.apellido_materno) ? 'border-red-500 bg-red-50' : 'border-gray-300'"
                                        placeholder="EJ. GARCÍA" />
                                    <span class="text-xs text-red-500 mt-1 block h-4">{{
                                        ((apellido_maternoMeta.touched || submitCount > 0) &&
                                            errors.apellido_materno) ? errors.apellido_materno : '' }}</span>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        DNI <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" v-model="dni" @blur="dniBlur"
                                        @input="dni = dni.replace(/\D/g, '').slice(0, 8)" maxlength="8"
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                                        :class="((dniMeta.touched || submitCount > 0) && errors.dni) ? 'border-red-500 bg-red-50' : 'border-gray-300'"
                                        placeholder="12345678" />
                                    <span class="text-xs text-red-500 mt-1 block h-4">{{ ((dniMeta.touched ||
                                        submitCount > 0) && errors.dni) ? errors.dni : '' }}</span>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Teléfono
                                    </label>
                                    <input type="text" v-model="telefono" @blur="telefonoBlur"
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                                        :class="((telefonoMeta.touched || submitCount > 0) && errors.telefono) ? 'border-red-500 bg-red-50' : 'border-gray-300'"
                                        placeholder="987654321" />
                                    <span class="text-xs text-red-500 mt-1 block h-4">{{ ((telefonoMeta.touched ||
                                        submitCount > 0) && errors.telefono) ? errors.telefono : '' }}</span>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input type="email" v-model="email" @blur="emailBlur"
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                                        :class="((emailMeta.touched || submitCount > 0) && errors.email) ? 'border-red-500 bg-red-50' : 'border-gray-300'"
                                        placeholder="doctor@ejemplo.com" />
                                    <span class="text-xs text-red-500 mt-1 block h-4">{{ ((emailMeta.touched ||
                                        submitCount > 0) && errors.email) ? errors.email : '' }}</span>
                                </div>
                                <div class="md:col-span-3">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Dirección
                                    </label>
                                    <input type="text" v-model="direccion" @blur="direccionBlur"
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                                        :class="((direccionMeta.touched || submitCount > 0) && errors.direccion) ? 'border-red-500 bg-red-50' : 'border-gray-300'"
                                        placeholder="Av. Las Flores 123" />
                                    <span class="text-xs text-red-500 mt-1 block h-4">{{ ((direccionMeta.touched
                                        || submitCount > 0) && errors.direccion) ? errors.direccion : '' }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Sección Usuario y Seguridad -->
                        <div>
                            <h4 class="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-4 border-b pb-2">
                                Credenciales de Acceso
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-1 gap-4">

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        {{ esEdicion ? 'Nueva Contraseña' : 'Contraseña' }} <span v-if="!esEdicion"
                                            class="text-red-500">*</span>
                                    </label>
                                    <div class="relative">
                                        <input :type="showPassword ? 'text' : 'password'" v-model="password"
                                            @blur="passwordBlur"
                                            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition pr-10"
                                            :class="((passwordMeta.touched || submitCount > 0) && errors.password) ? 'border-red-500 bg-red-50' : 'border-gray-300'"
                                            placeholder="********" />
                                        <button type="button" @click="showPassword = !showPassword"
                                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-teal-600 focus:outline-none">
                                            <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                                            <EyeSlashIcon v-else class="h-5 w-5" />
                                        </button>
                                    </div>
                                    <p v-if="esEdicion" class="text-xs text-gray-500 mt-1">Dejar en blanco para mantener
                                        la actual</p>
                                    <span class="text-xs text-red-500 mt-1 block h-4">{{ ((passwordMeta.touched ||
                                        submitCount > 0) && errors.password) ? errors.password : '' }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Sección Especialidades -->
                        <div>
                            <h4 class="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-4 border-b pb-2">
                                Especialidades Médicas
                            </h4>
                            <div v-if="loadingEspecialidades"
                                class="flex items-center gap-2 text-gray-500 text-sm py-2">
                                <ArrowPathIcon class="w-4 h-4 animate-spin" /> Cargando especialidades...
                            </div>
                            <div v-else>
                                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    <div v-for="esp in listEspecialidades" :key="esp.id"
                                        class="flex items-center p-3 border rounded-xl hover:bg-teal-50 transition cursor-pointer"
                                        :class="{ 'border-teal-500 bg-teal-50': especialidades_ids.includes(esp.id) }"
                                        @click="toggleEspecialidad(esp.id)">
                                        <input type="checkbox" :value="esp.id" v-model="especialidades_ids"
                                            class="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                            @click.stop />
                                        <label class="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                                            {{ esp.nombre }}
                                        </label>
                                    </div>
                                </div>
                                <span class="text-xs text-red-500 mt-2 block h-4">{{
                                    ((especialidades_idsMeta.touched || submitCount > 0) &&
                                        errors.especialidades_ids) ? errors.especialidades_ids : '' }}</span>
                            </div>
                        </div>

                        <div class="flex gap-3 pt-6 border-t">
                            <button type="submit" :disabled="guardando"
                                class="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                                <ArrowPathIcon v-if="guardando" class="w-5 h-5 animate-spin" />
                                {{ esEdicion ? "Actualizar" : "Registrar" }} Profesional
                            </button>
                            <button type="button" @click="cerrar" :disabled="guardando"
                                class="px-6 py-3 border-2 border-gray-200 text-gray-500 hover:bg-gray-50 font-bold rounded-xl transition">
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
import { ref, watch, computed } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { XMarkIcon, ArrowPathIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import catalogoService, { type Especialidad } from '../../services/catalogoService'

interface FormData {
    id: number
    nombres: string
    apellido_paterno: string
    apellido_materno: string
    name: string
    dni: string
    username: string
    password?: string
    role: string
    email: string
    telefono: string
    direccion: string
    especialidades_ids: number[]
}

interface Props {
    visible: boolean
    esEdicion: boolean
    medicoData: any | null
    guardando: boolean
}

const props = defineProps<Props>()

const subtitulo = computed(() => props.esEdicion
    ? "Actualiza los datos del profesional"
    : "Registra un nuevo profesional en el sistema")

const showPassword = ref(false)

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'save', data: FormData): void
}>()

// Esquema de validación
const schema = yup.object({
    nombres: yup.string()
        .required('Nombres son obligatorios')
        .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/, 'Debe estar en MAYÚSCULAS'),
    apellido_paterno: yup.string()
        .required('Apellido paterno es obligatorio')
        .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/, 'Debe estar en MAYÚSCULAS'),
    apellido_materno: yup.string()
        .required('Apellido materno es obligatorio')
        .matches(/^[A-ZÁÉÍÓÚÑ\s]+$/, 'Debe estar en MAYÚSCULAS'),
    dni: yup.string()
        .required('DNI es obligatorio')
        .matches(/^[0-9]+$/, 'Sólo se permiten números')
        .min(8, 'DNI debe tener 8 números')
        .max(8, 'DNI debe tener 8 números'),

    password: yup.string().when('esEdicion', {
        is: false,
        then: (schema) => schema.required('Contraseña es obligatoria').min(8, 'Mínimo 8 caracteres'),
        otherwise: (schema) => schema.optional().transform((v) => v === '' ? undefined : v).test('min-length', 'Mínimo 8 caracteres', (val) => !val || val.length >= 8)
    }),
    email: yup.string().email('Email inválido').nullable().transform((v) => v === '' ? null : v),
    telefono: yup.string().matches(/^[0-9]*$/, 'Sólo números').nullable().transform((v) => v === '' ? null : v),
    direccion: yup.string().nullable().transform((v) => v === '' ? null : v),
    especialidades_ids: yup.array().min(1, 'Selecciona al menos una especialidad'),
    id: yup.number().optional()
})

const { handleSubmit, errors, resetForm, setValues, submitCount } = useForm({
    validationSchema: schema,
    initialValues: {
        id: 0,
        nombres: '',
        apellido_paterno: '',
        apellido_materno: '',
        dni: '',

        password: '',
        email: '',
        telefono: '',
        direccion: '',
        especialidades_ids: [] as number[],
        esEdicion: props.esEdicion
    }
})

// Uso de useField para vinculación reactiva
const { value: nombres, meta: nombresMeta, handleBlur: nombresBlur } = useField<string>('nombres')
const { value: apellido_paterno, meta: apellido_paternoMeta, handleBlur: apellido_paternoBlur } = useField<string>('apellido_paterno')
const { value: apellido_materno, meta: apellido_maternoMeta, handleBlur: apellido_maternoBlur } = useField<string>('apellido_materno')
const { value: dni, meta: dniMeta, handleBlur: dniBlur } = useField<string>('dni')
const { value: password, meta: passwordMeta, handleBlur: passwordBlur } = useField<string>('password')
const { value: email, meta: emailMeta, handleBlur: emailBlur } = useField<string | null>('email')
const { value: telefono, meta: telefonoMeta, handleBlur: telefonoBlur } = useField<string | null>('telefono')
const { value: direccion, meta: direccionMeta, handleBlur: direccionBlur } = useField<string | null>('direccion')
const { value: especialidades_ids, meta: especialidades_idsMeta, handleBlur: especialidades_idsBlur } = useField<number[]>('especialidades_ids')
const { value: id } = useField<number>('id')

const listEspecialidades = ref<Especialidad[]>([])
const loadingEspecialidades = ref(false)

const fetchEspecialidades = async () => {
    loadingEspecialidades.value = true
    try {
        const { data } = await catalogoService.getEspecialidades()
        listEspecialidades.value = data
    } catch (error) {
        console.error('Error fetching especialidades:', error)
    } finally {
        loadingEspecialidades.value = false
    }
}

watch(() => props.visible, (newVal) => {
    if (newVal) {
        fetchEspecialidades()
        if (props.medicoData) {
            setValues({
                id: props.medicoData.id,
                nombres: props.medicoData.nombres || '',
                apellido_paterno: props.medicoData.apellido_paterno || '',
                apellido_materno: props.medicoData.apellido_materno || '',
                dni: props.medicoData.dni || '',

                password: '',
                email: props.medicoData.email || '',
                telefono: props.medicoData.telefono || '',
                direccion: props.medicoData.direccion || '',
                especialidades_ids: props.medicoData.especialidades ? props.medicoData.especialidades.map((e: any) => e.id) : [],
                esEdicion: true
            })
        } else {
            resetForm({
                values: {
                    id: 0,
                    nombres: '',
                    apellido_paterno: '',
                    apellido_materno: '',
                    dni: '',

                    password: '',
                    email: '',
                    telefono: '',
                    direccion: '',
                    especialidades_ids: [],
                    esEdicion: false
                }
            })
        }
    }
})

const toggleEspecialidad = (id: number) => {
    const current = especialidades_ids.value || []
    const index = current.indexOf(id)
    if (index === -1) {
        especialidades_ids.value = [...current, id]
    } else {
        especialidades_ids.value = current.filter(itemId => itemId !== id)
    }
    especialidades_idsBlur()
}

const cerrar = () => {
    emit('close')
}

const onSubmit = handleSubmit((values) => {
    const payload: FormData = {
        id: id.value,
        nombres: values.nombres,
        apellido_paterno: values.apellido_paterno,
        apellido_materno: values.apellido_materno,
        name: `${values.nombres} ${values.apellido_paterno} ${values.apellido_materno}`.trim(),
        dni: values.dni,
        username: values.dni,
        password: values.password || undefined,
        role: 'profesional',
        email: values.email || '',
        telefono: values.telefono || '',
        direccion: values.direccion || '',
        especialidades_ids: values.especialidades_ids
    }
    emit('save', payload)
})
</script>
