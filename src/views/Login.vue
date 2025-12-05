<!-- src/views/Login.vue -->

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-100 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <!-- Logo o encabezado -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-full mb-4">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-800">Centro de Salud</h2>
        <h3 class="text-xl font-semibold text-teal-600 mt-1">La Unión</h3>
        <p class="text-sm text-gray-500 mt-2">
          Ingrese sus credenciales para acceder
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Campo de correo -->
        <div>
          <label for="dni" class="block text-sm font-medium text-gray-700 mb-2">
            DNI
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="pi pi-id-card"></i>
            </div>
            <input id="dni" v-model="dni" type="text" required
              class="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              placeholder="20252025" />
          </div>
        </div>

        <!-- Campo de contraseña -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="pi pi-lock"></i>
            </div>
            <input id="password" v-model="password" type="password" required
              class="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              placeholder="••••••••" />
          </div>
        </div>

        <!-- Mensaje de error -->
        <transition enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 transform -translate-y-1" enter-to-class="opacity-100 transform translate-y-0">
          <div v-if="error"
            class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd" />
            </svg>
            <span class="text-sm">{{ error }}</span>
          </div>
        </transition>

        <!-- Botón de login -->
        <button type="submit" :disabled="isLoading"
          class="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2">
          <svg v-if="isLoading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <span>{{
            isLoading ? "Iniciando sesión..." : "Iniciar Sesión"
            }}</span>
        </button>
      </form>

      <!-- Información adicional -->
      <div class="mt-6 pt-6 border-t border-gray-200">
        <p class="text-center text-xs text-gray-500">
          ¿Olvidaste tu contraseña? Contacta al administrador
        </p>
        <p class="text-center text-xs text-gray-400 mt-2">
          Sistema de gestión médica v1.0
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";

const dni = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);
const auth = useAuthStore();
const router = useRouter();

async function handleLogin() {
  error.value = "";
  isLoading.value = true;

  try {
    await auth.login(dni.value, password.value);
    // Redirigir al dashboard
    router.push({ path: "/dashboard" });
  } catch (e: any) {
    error.value =
      e?.response?.data?.msg ||
      "Credenciales incorrectas. Verifique sus datos e intente nuevamente.";
  } finally {
    isLoading.value = false;
  }
}
</script>
