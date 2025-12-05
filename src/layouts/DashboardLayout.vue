<template>
  <div class="h-screen bg-gray-100 flex overflow-hidden">
    <!-- Mobile Backdrop -->
    <div v-if="mobileMenuOpen" class="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden"
      @click="mobileMenuOpen = false"></div>

    <!-- Sidebar -->
    <aside :class="[
      'bg-teal-700 text-white transition-all duration-300 flex flex-col',
      'fixed inset-y-0 left-0 z-30 md:relative',
      sidebarOpen ? 'md:w-64' : 'md:w-20',
      'w-64',
      mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]">
      <!-- Header del Sidebar -->
      <div class="p-4 border-b border-teal-600">
        <div class="flex items-center justify-between">
          <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <h1 :class="{ 'md:hidden': !sidebarOpen }" class="font-bold text-lg whitespace-nowrap">
              C.S. LA UNIÓN
            </h1>
          </transition>
          <!-- Desktop Toggle Button -->
          <button @click="toggleSidebar" class="hidden md:block p-2 rounded-lg hover:bg-teal-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
          <!-- Mobile Close Button -->
          <button @click="mobileMenuOpen = false" class="md:hidden p-2 rounded-lg hover:bg-teal-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Navegación -->
      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <router-link to="/dashboard"
          class="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden"
          :class="isActive('/dashboard') ?
            'bg-white text-teal-700 shadow-lg translate-x-2' :
            'text-teal-100 hover:bg-teal-600 hover:text-white hover:translate-x-1'" @click="mobileMenuOpen = false">
          <svg class="w-6 h-6 flex-shrink-0 transition-transform duration-300"
            :class="{ 'scale-110': isActive('/dashboard') }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span :class="{ 'md:hidden': !sidebarOpen }" class="font-medium whitespace-nowrap">Dashboard</span>
        </router-link>

        <router-link to="/pacientes"
          class="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden"
          :class="isActive('/pacientes') ?
            'bg-white text-teal-700 shadow-lg translate-x-2' :
            'text-teal-100 hover:bg-teal-600 hover:text-white hover:translate-x-1'" @click="mobileMenuOpen = false">
          <svg class="w-6 h-6 flex-shrink-0 transition-transform duration-300"
            :class="{ 'scale-110': isActive('/pacientes') }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span :class="{ 'md:hidden': !sidebarOpen }" class="font-medium whitespace-nowrap">Pacientes</span>
        </router-link>

        <router-link to="/citas"
          class="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden"
          :class="isActive('/citas') ?
            'bg-white text-teal-700 shadow-lg translate-x-2' :
            'text-teal-100 hover:bg-teal-600 hover:text-white hover:translate-x-1'" @click="mobileMenuOpen = false">
          <svg class="w-6 h-6 flex-shrink-0 transition-transform duration-300"
            :class="{ 'scale-110': isActive('/citas') }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span :class="{ 'md:hidden': !sidebarOpen }" class="font-medium whitespace-nowrap">Citas</span>
        </router-link>

        <router-link to="/medicos"
          class="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden"
          :class="isActive('/medicos') ?
            'bg-white text-teal-700 shadow-lg translate-x-2' :
            'text-teal-100 hover:bg-teal-600 hover:text-white hover:translate-x-1'" @click="mobileMenuOpen = false">
          <svg class="w-6 h-6 flex-shrink-0 transition-transform duration-300"
            :class="{ 'scale-110': isActive('/medicos') }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span :class="{ 'md:hidden': !sidebarOpen }" class="font-medium whitespace-nowrap">Médicos</span>
        </router-link>

        <div class="pt-4 mt-4 border-t border-teal-600">
          <router-link to="/reportes"
            class="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden"
            :class="isActive('/reportes') ?
              'bg-white text-teal-700 shadow-lg translate-x-2' :
              'text-teal-100 hover:bg-teal-600 hover:text-white hover:translate-x-1'" @click="mobileMenuOpen = false">
            <svg class="w-6 h-6 flex-shrink-0 transition-transform duration-300"
              :class="{ 'scale-110': isActive('/reportes') }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span :class="{ 'md:hidden': !sidebarOpen }" class="font-medium whitespace-nowrap">Reportes</span>
          </router-link>

          <router-link to="/admin"
            class="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden"
            :class="isActive('/admin') ?
              'bg-white text-teal-700 shadow-lg translate-x-2' :
              'text-teal-100 hover:bg-teal-600 hover:text-white hover:translate-x-1'" @click="mobileMenuOpen = false">
            <svg class="w-6 h-6 flex-shrink-0 transition-transform duration-300"
              :class="{ 'scale-110': isActive('/admin') }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span :class="{ 'md:hidden': !sidebarOpen }" class="font-medium whitespace-nowrap">Configuración</span>
          </router-link>
        </div>
      </nav>

      <!-- Usuario -->
      <div class="p-4 border-t border-teal-600">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div :class="{ 'md:hidden': !sidebarOpen }" class="flex-1 min-w-0">
            <p class="font-medium truncate">{{ auth.user?.dni }}</p>
            <p class="text-xs text-teal-200 truncate">{{ getUserRole }}</p>
          </div>
          <button :class="{ 'md:hidden': !sidebarOpen }" @click="cerrarSesion"
            class="p-2 rounded-lg hover:bg-teal-600 transition-colors" title="Cerrar sesión">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Contenido Principal -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header -->
      <header class="bg-white shadow-sm sticky top-0 z-10">
        <div class="px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <!-- Mobile Menu Button -->
            <button @click="mobileMenuOpen = true"
              class="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <transition enter-active-class="transition ease-out duration-300"
                enter-from-class="opacity-0 -translate-x-2" enter-to-class="opacity-100 translate-x-0" mode="out-in">
                <h2 :key="tituloActual" class="text-xl md:text-2xl font-bold text-gray-800">{{ tituloActual }}</h2>
              </transition>
              <transition enter-active-class="transition ease-out duration-300 delay-75"
                enter-from-class="opacity-0 -translate-x-2" enter-to-class="opacity-100 translate-x-0" mode="out-in">
                <p :key="subtituloActual" class="hidden md:block text-sm text-gray-500 mt-1">{{ subtituloActual }}</p>
              </transition>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <!-- Notificaciones -->
            <button class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <i class="pi pi-bell"></i>
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- Usuario -->
            <div class="hidden md:flex items-center gap-2">
              <span class="text-sm font-medium text-gray-700">Hoy: {{ fechaActual }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Contenido -->
      <main class="flex-1 p-4 md:p-6 overflow-y-auto">
        <router-view v-slot="{ Component }">
          <transition enter-active-class="transition ease-out duration-300"
            enter-from-class="transform opacity-0 translate-y-4" enter-to-class="transform opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-200" leave-from-class="transform opacity-100 translate-y-0"
            leave-to-class="transform opacity-0 -translate-y-4" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 px-6 py-3">
        <div class="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 gap-2">
          <p class="text-center md:text-left">© {{ new Date().getFullYear() }} Centro de Salud La Unión - Huánuco</p>
          <p>Versión 1.0.0</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const auth = useAuthStore()

const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(true)
const mobileMenuOpen = ref(false)

const isActive = (path: string) => {
  return route.path.startsWith(path)
}

const getUserRole = computed(() => {
  if (auth.user && auth.user.role_id) {
    switch (auth.user.role_id) {
      case 1:
        return 'Administrador'
      case 2:
        return 'Medico'
      case 3:
        return 'Asistente'
      default:
        return 'Invitado'
    }
  }
  return 'Invitado'
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const cerrarSesion = async () => {
  if (confirm('¿Está seguro que desea cerrar sesión?')) {
    await auth.logout()
    router.push('/login')
  }
}

const tituloActual = computed(() => {
  const titulos: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/pacientes': 'Gestión de Pacientes',
    '/citas': 'Administración de Citas',
    '/medicos': 'Gestión de Médicos',
    '/reportes': 'Reportes y Estadísticas',
    '/admin': 'Configuración'
  }
  return titulos[route.path] || 'Panel de Control'
})

const subtituloActual = computed(() => {
  const subtitulos: Record<string, string> = {
    '/dashboard': 'Vista general del sistema',
    '/pacientes': 'Registro y gestión de pacientes',
    '/citas': 'Control de citas médicas',
    '/medicos': 'Administración del personal médico',
    '/reportes': 'Análisis y estadísticas del centro',
    '/admin': 'Ajustes del sistema'
  }
  return subtitulos[route.path] || 'Bienvenido al sistema'
})

const fechaActual = computed(() => {
  const fecha = new Date()
  return fecha.toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>