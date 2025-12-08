<!-- src/views/Login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gray-50">
    <!-- Main Card Container -->
    <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl flex overflow-hidden min-h-[600px]">

      <!-- Left Side: Visual/Context (Hidden on mobile) -->
      <div
        class="hidden md:flex md:w-1/2 bg-gradient-to-br from-teal-600 to-emerald-600 relative flex-col items-center justify-center text-white p-12 overflow-hidden">
        <!-- Abstract Circles Background -->
        <div class="absolute top-0 left-0 w-full h-full opacity-10">
          <div class="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          <div class="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-teal-200 blur-3xl"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 text-center">
          <div
            class="mb-8 w-48 h-48 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto shadow-inner border border-white/20">
            <BuildingOfficeIcon class="w-24 h-24 text-white" />
          </div>
          <h2 class="text-3xl font-bold mb-2 tracking-tight">Centro de Salud</h2>
          <h1 class="text-4xl font-extrabold mb-6 tracking-wide">La Unión</h1>
          <p class="text-teal-50 text-lg max-w-xs mx-auto leading-relaxed">
            Gestión integral de citas médicas, pacientes y personal de salud.
          </p>
        </div>

        <!-- Decoration Dots -->
        <div class="absolute bottom-10 left-10 flex gap-2">
          <div class="w-2 h-2 rounded-full bg-white/50"></div>
          <div class="w-2 h-2 rounded-full bg-white/30"></div>
          <div class="w-2 h-2 rounded-full bg-white/10"></div>
        </div>
      </div>

      <!-- Right Side: Login Form -->
      <div class="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white relative">
        <div class="max-w-md mx-auto w-full">

          <!-- Mobile visual aid -->
          <div class="md:hidden text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-3 text-teal-600">
              <BuildingOfficeIcon class="w-8 h-8" />
            </div>
            <h2 class="text-xl font-bold text-gray-800">C.S. La Unión</h2>
          </div>

          <h2 class="text-3xl font-bold text-gray-800 mb-2">Bienvenido</h2>
          <p class="text-gray-500 mb-10">Ingresa a tu cuenta para continuar</p>

          <form @submit.prevent="onSubmit" class="space-y-6">
            <!-- DNI Input -->
            <div class="space-y-2">
              <label for="dni" class="text-sm font-semibold text-gray-700 ml-1">Usuario / DNI</label>
              <div class="relative group">
                <div
                  class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-teal-600">
                  <IdentificationIcon
                    class="w-5 h-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                </div>
                <input id="dni" v-model="dni" v-bind="dniAttrs" type="text"
                  class="block w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 font-medium text-gray-700 placeholder-gray-400"
                  :class="errors.dni ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'"
                  placeholder="Ingrese su DNI" />
              </div>
              <span v-if="errors.dni" class="text-red-500 text-sm ml-1">{{ errors.dni }}</span>
            </div>

            <!-- Password Input -->
            <div class="space-y-2">
              <label for="password" class="text-sm font-semibold text-gray-700 ml-1">Contraseña</label>
              <div class="relative group">
                <div
                  class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-teal-600">
                  <LockClosedIcon class="w-5 h-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                </div>
                <input id="password" v-model="password" v-bind="passwordAttrs"
                  :type="showPassword ? 'text' : 'password'"
                  class="block w-full pl-12 pr-12 py-4 bg-gray-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 font-medium text-gray-700 placeholder-gray-400"
                  :class="errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'"
                  placeholder="••••••••" />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-teal-600 focus:outline-none transition-colors">
                  <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                  <EyeSlashIcon v-else class="w-5 h-5" />
                </button>
              </div>
              <span v-if="errors.password" class="text-red-500 text-sm ml-1">{{ errors.password }}</span>
            </div>

            <!-- Contact Admin Hint -->
            <div class="text-sm text-center text-gray-500">
              En caso de olvidar su contraseña, <span class="text-teal-600 font-medium">contacte con el
                administrador</span>
            </div>

            <!-- Error Message -->
            <transition enter-active-class="transition ease-out duration-300"
              enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0">
              <div v-if="error"
                class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
                <ExclamationCircleIcon class="w-5 h-5 flex-shrink-0" />
                <span>{{ error }}</span>
              </div>
            </transition>

            <!-- Submit Button -->
            <button type="submit" :disabled="isLoading"
              class="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-600/40 transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200 flex items-center justify-center gap-2">
              <ArrowPathIcon v-if="isLoading" class="animate-spin h-5 w-5" />
              <span>{{ isLoading ? "Iniciando..." : "Iniciar Sesión" }}</span>
            </button>
          </form>

          <div class="mt-10 text-center">
            <p class="text-sm text-gray-400">© 2025 Sistema C.S. La Unión</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import * as yup from "yup";
import {
  IdentificationIcon,
  LockClosedIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  BuildingOfficeIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline';

const error = ref("");
const isLoading = ref(false);
const showPassword = ref(false);
const auth = useAuthStore();
const router = useRouter();

// Validación
const schema = yup.object({
  dni: yup.string().required("El DNI es obligatorio"),
  password: yup.string().required("La contraseña es obligatoria").min(8, "La contraseña debe tener al menos 8 caracteres")
});

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema
});

const [dni, dniAttrs] = defineField("dni");
const [password, passwordAttrs] = defineField("password");

const onSubmit = handleSubmit(async (values) => {
  error.value = "";
  isLoading.value = true;

  try {
    await auth.login(values.dni, values.password);
    router.push({ path: "/dashboard" });
  } catch (e: any) {
    error.value =
      e?.response?.data?.msg ||
      "Acceso denegado. Verifique sus credenciales.";
  } finally {
    isLoading.value = false;
  }
});
</script>
