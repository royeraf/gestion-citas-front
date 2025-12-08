<template>
    <div>
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
                <p class="text-sm text-gray-500 mt-1">Administra los usuarios del sistema</p>
            </div>
            <button @click="abrirModalCrear"
                class="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2">
                <PlusIcon class="w-5 h-5" />
                Nuevo Usuario
            </button>
        </div>

        <!-- Estadísticas rápidas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">Total Usuarios</p>
                        <p class="text-3xl font-bold text-gray-800 mt-1">{{ users.length }}</p>
                    </div>
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <UsersIcon class="w-8 h-8 text-blue-600" />
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">Administradores</p>
                        <p class="text-3xl font-bold text-gray-800 mt-1">{{ countByRole('admin') }}</p>
                    </div>
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <ShieldCheckIcon class="w-8 h-8 text-purple-600" />
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">Médicos</p>
                        <p class="text-3xl font-bold text-gray-800 mt-1">{{ countByRole('medico') }}</p>
                    </div>
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <BriefcaseIcon class="w-8 h-8 text-green-600" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Filtros de Búsqueda</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label for="filtroRol" class="block text-sm font-medium text-gray-700 mb-2">
                        Rol
                    </label>
                    <select id="filtroRol" v-model="filtroRol"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white">
                        <option value="">Todos los roles</option>
                        <option value="admin">Administrador</option>
                        <option value="medico">Médico</option>
                        <option value="asistente">Asistente Técnico</option>
                    </select>
                </div>

                <div>
                    <label for="filtroBuscar" class="block text-sm font-medium text-gray-700 mb-2">
                        Buscar
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon class="w-5 h-5 text-gray-400" />
                        </div>
                        <input type="text" id="filtroBuscar" v-model="filtroBusqueda" placeholder="Nombre o usuario"
                            class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                    </div>
                </div>

                <div class="flex items-end">
                    <button @click="limpiarFiltros"
                        class="w-full px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200">
                        Limpiar Filtros
                    </button>
                </div>
            </div>
        </div>

        <!-- Tabla de usuarios -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Usuario
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Username
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rol
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha Creación
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="user in paginatedUsers" :key="user.id"
                            class="hover:bg-gray-50 transition duration-150">
                            <td class="px-6 py-4">
                                <div class="flex items-center">
                                    <div class="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                                        <span class="text-teal-600 font-semibold">{{ getInitials(user.name) }}</span>
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-900">{{ user.username }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="[getRoleBadgeClass(user.role), 'flex items-center inline-flex gap-1']">
                                    <component :is="getRoleIconComponent(user.role)" class="w-4 h-4" />
                                    {{ getRoleLabel(user.role, user.role_nombre) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-500">{{ formatDate(user.createdAt) }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <div class="flex gap-2">
                                    <button @click="editarUsuario(user)"
                                        class="text-blue-600 hover:text-blue-800 transition p-2 rounded-lg hover:bg-blue-50"
                                        title="Editar usuario">
                                        <PencilIcon class="w-5 h-5" />
                                    </button>
                                    <button @click="eliminarUsuario(user.id)"
                                        class="text-red-600 hover:text-red-800 transition p-2 rounded-lg hover:bg-red-50"
                                        title="Eliminar usuario">
                                        <TrashIcon class="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Mensaje cuando no hay resultados -->
            <div v-if="usuariosFiltrados.length === 0" class="text-center py-12 flex flex-col items-center">
                <UsersIcon class="w-16 h-16 text-gray-400" />
                <p class="mt-4 text-gray-500">No se encontraron usuarios</p>
            </div>
        </div>

        <!-- Paginación Usuarios -->
        <div v-if="usuariosFiltrados.length > 0"
            class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg shadow-lg mt-[-24px] mb-8">
            <div class="flex-1 flex justify-between sm:hidden">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                    Anterior
                </button>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                    Siguiente
                </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div class="flex items-center gap-4">
                    <p class="text-sm text-gray-700">
                        Mostrando
                        <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                        a
                        <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, usuariosFiltrados.length)
                            }}</span>
                        de
                        <span class="font-medium">{{ usuariosFiltrados.length }}</span>
                        resultados
                    </p>
                    <select v-model="itemsPerPage"
                        class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md">
                        <option :value="5">5 por página</option>
                        <option :value="10">10 por página</option>
                        <option :value="20">20 por página</option>
                        <option :value="50">50 por página</option>
                    </select>
                </div>
                <div>
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button @click="prevPage" :disabled="currentPage === 1"
                            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                            <span class="sr-only">Anterior</span>
                            <ChevronLeftIcon class="w-5 h-5" aria-hidden="true" />
                        </button>

                        <button v-for="page in totalPages" :key="page" @click="currentPage = page"
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
                            :class="page === currentPage ? 'z-10 bg-teal-50 border-teal-500 text-teal-600' : 'text-gray-500 hover:bg-gray-50'">
                            {{ page }}
                        </button>

                        <button @click="nextPage" :disabled="currentPage === totalPages"
                            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                            <span class="sr-only">Siguiente</span>
                            <ChevronRightIcon class="w-5 h-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>

        <!-- Modal de Crear/Editar Usuario -->
        <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="modalVisible"
                class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                @click.self="cerrarModal">
                <div class="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl transform transition-all">
                    <div class="flex justify-between items-start mb-6">
                        <h3 class="text-2xl font-bold text-gray-800">
                            {{ esEdicion ? 'Editar Usuario' : 'Nuevo Usuario' }}
                        </h3>
                        <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600 transition">
                            <XMarkIcon class="w-6 h-6" />
                        </button>
                    </div>

                    <form @submit.prevent="guardarUsuario" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre Completo <span class="text-red-500">*</span>
                                </label>
                                <input v-model="newUser.name" type="text" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="Juan Pérez" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Usuario <span class="text-red-500">*</span>
                                </label>
                                <input v-model="newUser.username" type="text" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="jperez" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña <span class="text-red-500">*</span>
                                </label>
                                <input v-model="newUser.password" type="password" :required="!esEdicion"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    :placeholder="esEdicion ? 'Dejar vacío para mantener' : '********'" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Rol <span class="text-red-500">*</span>
                                </label>
                                <select v-model="newUser.role" required
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white">
                                    <option value="">Seleccionar rol</option>
                                    <option value="admin">Administrador</option>
                                    <option value="medico">Médico</option>
                                    <option value="asistente">Asistente Técnico</option>
                                </select>
                            </div>
                        </div>

                        <!-- Mensaje de error -->
                        <transition enter-active-class="transition ease-out duration-200"
                            enter-from-class="opacity-0 transform -translate-y-1"
                            enter-to-class="opacity-100 transform translate-y-0">
                            <div v-if="errorMessage"
                                class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                                <ExclamationCircleIcon class="w-5 h-5" />
                                <span class="text-sm">{{ errorMessage }}</span>
                            </div>
                        </transition>

                        <div class="flex gap-3 pt-4">
                            <button type="submit" :disabled="isLoading"
                                class="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2">
                                <ArrowPathIcon v-if="isLoading" class="w-5 h-5 animate-spin" />
                                <CheckIcon v-else class="w-5 h-5" />
                                {{ isLoading ? 'Guardando...' : (esEdicion ? 'Actualizar' : 'Crear Usuario') }}
                            </button>
                            <button type="button" @click="cerrarModal"
                                class="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </transition>

        <!-- Toast de notificaciones -->
        <transition enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 transform translate-y-2" enter-to-class="opacity-100 transform translate-y-0"
            leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 transform translate-y-0"
            leave-to-class="opacity-0 transform translate-y-2">
            <div v-if="showToast" :class="[
                'fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50',
                toastType === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'
            ]">
                <CheckCircleIcon v-if="toastType === 'success'" class="w-6 h-6" />
                <ExclamationCircleIcon v-else class="w-6 h-6" />
                <span class="font-medium">{{ toastMessage }}</span>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import userService, { type User, type CreateUserPayload, type UpdateUserPayload } from '../../services/userService'
import {
    PlusIcon,
    UsersIcon,
    ShieldCheckIcon,
    BriefcaseIcon,
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    CheckIcon,
    ExclamationCircleIcon,
    CheckCircleIcon,
    UserIcon,
    ArrowPathIcon
} from '@heroicons/vue/24/outline'

// --- Lógica de Usuarios ---
const newUser = ref({
    id: 0,
    name: '',
    username: '',
    password: '',
    role: '' as 'admin' | 'medico' | 'asistente' | '',
})

const users = ref<User[]>([])
const isLoadingList = ref(false)

const modalVisible = ref(false)
const esEdicion = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

// Filtros
const filtroRol = ref<'admin' | 'medico' | 'asistente' | ''>('')
const filtroBusqueda = ref('')

const usuariosFiltrados = computed(() => {
    return users.value.filter(user => {
        const cumpleRol = !filtroRol.value || user.role === filtroRol.value
        const cumpleBusqueda = !filtroBusqueda.value ||
            user.name.toLowerCase().includes(filtroBusqueda.value.toLowerCase()) ||
            user.username.toLowerCase().includes(filtroBusqueda.value.toLowerCase()) ||
            (user.dni && user.dni.includes(filtroBusqueda.value))

        return cumpleRol && cumpleBusqueda
    })
})

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(5)

const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return usuariosFiltrados.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(usuariosFiltrados.value.length / itemsPerPage.value) || 1
})

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

// Resetear página cuando cambian los filtros
watch(usuariosFiltrados, () => {
    currentPage.value = 1
})

const countByRole = (role: string) => {
    return users.value.filter(u => u.role === role).length
}

const getInitials = (name: string): string => {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

const getRoleLabel = (role: string, roleNombre?: string): string => {
    // Usar role_nombre del backend si está disponible
    if (roleNombre) return roleNombre

    const labels: Record<string, string> = {
        admin: 'Administrador',
        medico: 'Médico',
        asistente: 'Asistente Técnico'
    }
    return labels[role] || role
}

const getRoleIconComponent = (role: string) => {
    const icons: Record<string, any> = {
        admin: ShieldCheckIcon,
        medico: BriefcaseIcon,
        asistente: UserIcon
    }
    return icons[role] || UserIcon
}

const getRoleBadgeClass = (role: string): string => {
    const classes: Record<string, string> = {
        admin: 'px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800',
        medico: 'px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
        asistente: 'px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'
    }
    return classes[role] || 'px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800'
}

const formatDate = (date: string | null | undefined): string => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const fetchUsers = async () => {
    isLoadingList.value = true
    try {
        const { data } = await userService.getUsers()
        users.value = data
    } catch (error) {
        console.error('Error al obtener usuarios:', error)
        mostrarToast('Error al cargar usuarios', 'error')
    } finally {
        isLoadingList.value = false
    }
}

const abrirModalCrear = () => {
    modalVisible.value = true
    esEdicion.value = false
    newUser.value = { id: 0, name: '', username: '', password: '', role: '' }
    errorMessage.value = ''
}

const editarUsuario = (user: User) => {
    modalVisible.value = true
    esEdicion.value = true
    newUser.value = {
        id: user.id,
        name: user.name,
        username: user.username,
        password: '',
        role: user.role
    }
    errorMessage.value = ''
}

const cerrarModal = () => {
    modalVisible.value = false
    esEdicion.value = false
    newUser.value = { id: 0, name: '', username: '', password: '', role: '' }
    errorMessage.value = ''
}

const guardarUsuario = async () => {
    errorMessage.value = ''
    isLoading.value = true

    try {
        if (esEdicion.value) {
            const payload: UpdateUserPayload = {
                name: newUser.value.name,
                username: newUser.value.username,
                role: newUser.value.role as 'admin' | 'medico' | 'asistente'
            }
            // Solo incluir password si se proporcionó uno nuevo
            if (newUser.value.password) {
                payload.password = newUser.value.password
            }
            await userService.updateUser(newUser.value.id, payload)
            mostrarToast('Usuario actualizado exitosamente', 'success')
        } else {
            const payload: CreateUserPayload = {
                name: newUser.value.name,
                username: newUser.value.username,
                password: newUser.value.password,
                role: newUser.value.role as 'admin' | 'medico' | 'asistente'
            }
            await userService.createUser(payload)
            mostrarToast('Usuario creado exitosamente', 'success')
        }

        await fetchUsers()
        cerrarModal()
    } catch (error: any) {
        const mensaje = error?.response?.data?.error || error?.response?.data?.message || 'Error al guardar usuario'
        errorMessage.value = mensaje
        console.error('Error al guardar usuario:', error)
    } finally {
        isLoading.value = false
    }
}

const eliminarUsuario = async (id: number) => {
    if (!confirm('¿Está seguro que desea eliminar este usuario?')) return

    try {
        await userService.deleteUser(id)
        await fetchUsers()
        mostrarToast('Usuario eliminado exitosamente', 'success')
    } catch (error: any) {
        console.error('Error al eliminar usuario:', error)
        const mensaje = error?.response?.data?.error || 'Error al eliminar usuario'
        mostrarToast(mensaje, 'error')
    }
}

const limpiarFiltros = () => {
    filtroRol.value = ''
    filtroBusqueda.value = ''
}

const mostrarToast = (mensaje: string, tipo: 'success' | 'error' = 'success') => {
    toastMessage.value = mensaje
    toastType.value = tipo
    showToast.value = true
    setTimeout(() => {
        showToast.value = false
    }, 3000)
}

onMounted(() => {
    fetchUsers()
})
</script>
