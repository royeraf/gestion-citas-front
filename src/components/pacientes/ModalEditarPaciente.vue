<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="show" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            @click.self="close">
            <div
                class="bg-white rounded-2xl max-w-2xl w-full shadow-2xl transform transition-all max-h-[90vh] overflow-hidden flex flex-col">

                <!-- Header del modal -->
                <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-xl font-bold">Editar Paciente</h3>
                            <p class="text-teal-100 text-sm mt-1">{{ form.nombres }} {{ form.apellido_paterno }}</p>
                        </div>
                        <button @click="close"
                            class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
                            <XMarkIcon class="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                <!-- Info del paciente -->
                <div class="p-4 border-b bg-gray-50 flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <IdentificationIcon class="w-4 h-4 text-gray-500" />
                        <span class="text-sm text-gray-600">DNI: <span class="font-semibold">{{ form.dni
                                }}</span></span>
                    </div>
                    <span v-if="form.seguro"
                        :class="['px-3 py-1 text-sm font-medium rounded-full', form.seguro === 'SIS' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700']">
                        {{ form.seguro }}
                    </span>
                </div>

                <!-- Formulario -->
                <form @submit.prevent="guardar" class="flex-1 overflow-y-auto p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Nombres -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombres *</label>
                            <input type="text" v-model="form.nombres" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                        </div>

                        <!-- Apellido Paterno -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno *</label>
                            <input type="text" v-model="form.apellido_paterno" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                        </div>

                        <!-- Apellido Materno -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Apellido Materno *</label>
                            <input type="text" v-model="form.apellido_materno" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                        </div>

                        <!-- Fecha de Nacimiento -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                            <input type="date" v-model="form.fecha_nacimiento"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                        </div>

                        <!-- Sexo -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                            <select v-model="form.sexo"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white">
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                        </div>

                        <!-- Estado Civil -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
                            <select v-model="form.estado_civil"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white">
                                <option value="S">Soltero(a)</option>
                                <option value="C">Casado(a)</option>
                                <option value="V">Viudo(a)</option>
                                <option value="D">Divorciado(a)</option>
                            </select>
                        </div>

                        <!-- Ocupación -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Ocupación</label>
                            <input type="text" v-model="form.ocupacion"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                        </div>

                        <!-- Teléfono -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <input type="tel" v-model="form.telefono" maxlength="9"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                        </div>

                        <!-- Email -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" v-model="form.email"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                        </div>

                        <!-- Seguro -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Seguro</label>
                            <select v-model="form.seguro"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white">
                                <option value="">Particular</option>
                                <option value="SIS">SIS</option>
                                <option value="ESSALUD">ESSALUD</option>
                            </select>
                        </div>

                        <!-- Dirección (ancho completo) -->
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                            <input type="text" v-model="form.direccion"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                        </div>

                        <!-- Número de Seguro -->
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Número de Seguro</label>
                            <input type="text" v-model="form.numero_seguro"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                        </div>
                    </div>
                </form>

                <!-- Footer del modal -->
                <div class="p-4 border-t bg-gray-50 flex justify-between items-center">
                    <p class="text-sm text-gray-500">
                        * Campos obligatorios
                    </p>
                    <div class="flex items-center gap-3">
                        <button type="button" @click="close"
                            class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">
                            Cancelar
                        </button>
                        <button @click="guardar" :disabled="saving"
                            class="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition font-medium flex items-center gap-2">
                            <ArrowPathIcon v-if="saving" class="w-4 h-4 animate-spin" />
                            <span v-if="saving">Guardando...</span>
                            <span v-else>Guardar Cambios</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import pacienteService, { type Paciente } from '../../services/pacienteService';
import { XMarkIcon, ArrowPathIcon, IdentificationIcon } from '@heroicons/vue/24/outline';

interface Props {
    show: boolean;
    paciente: Paciente | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'saved'): void;
}>();

// Estado
const saving = ref(false);
const form = ref({
    id: 0,
    dni: '',
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    fecha_nacimiento: '',
    sexo: '',
    estado_civil: '',
    ocupacion: '',
    telefono: '',
    email: '',
    direccion: '',
    seguro: '',
    numero_seguro: ''
});

// Métodos
const guardar = async () => {
    saving.value = true;
    try {
        const payload = {
            nombres: form.value.nombres,
            apellido_paterno: form.value.apellido_paterno,
            apellido_materno: form.value.apellido_materno,
            fecha_nacimiento: form.value.fecha_nacimiento,
            sexo: form.value.sexo,
            estado_civil: form.value.estado_civil,
            ocupacion: form.value.ocupacion,
            telefono: form.value.telefono,
            email: form.value.email,
            direccion: form.value.direccion,
            seguro: form.value.seguro,
            numero_seguro: form.value.numero_seguro
        };

        await pacienteService.updatePaciente(form.value.id, payload);
        emit('saved');
        close();
    } catch (error: any) {
        console.error("Error al guardar:", error);
        alert(error.response?.data?.error || 'Error al actualizar paciente');
    } finally {
        saving.value = false;
    }
};

const close = () => {
    emit('close');
};

// Watch para cargar datos del paciente cuando se abre el modal
watch(() => props.show, (newVal) => {
    if (newVal && props.paciente) {
        form.value = {
            id: props.paciente.id,
            dni: props.paciente.dni,
            nombres: props.paciente.nombres,
            apellido_paterno: props.paciente.apellido_paterno || props.paciente.apellidoPaterno,
            apellido_materno: props.paciente.apellido_materno || props.paciente.apellidoMaterno,
            fecha_nacimiento: props.paciente.fecha_nacimiento || props.paciente.fechaNacimiento,
            sexo: props.paciente.sexo,
            estado_civil: props.paciente.estado_civil,
            ocupacion: props.paciente.ocupacion || '',
            telefono: props.paciente.telefono || '',
            email: props.paciente.email || '',
            direccion: props.paciente.direccion,
            seguro: props.paciente.seguro || '',
            numero_seguro: props.paciente.numero_seguro || ''
        };
    }
});
</script>

<style scoped>
/* Scrollbar personalizado */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>
