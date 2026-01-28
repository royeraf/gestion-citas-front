<template>
    <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Welcome Section -->
        <WelcomeSection :nombreUsuario="getNombreUsuario" />

        <!-- Stats Cards -->
        <StatsCards :stats="stats" :isLoading="isLoading" />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Próximas Citas -->
            <UpcomingAppointments :citas="proximasCitas" :isLoading="isLoading" />

            <!-- Acciones Rápidas y Estado del Sistema -->
            <div class="space-y-8">
                <!-- Acciones Rápidas -->
                <QuickActions :rolId="auth.user?.rol_id" />

                <!-- Distribución por Especialidad -->
                <SpecialtyChart v-if="canSeeSpecialtyStats" :data="citasPorEspecialidad" :isLoading="isLoading" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import dashboardService, { type DashboardStats, type UpcomingAppointment, type AppointmentBySpecialty } from '../services/dashboardService';

// Components
import WelcomeSection from '../components/dashboard/WelcomeSection.vue';
import StatsCards from '../components/dashboard/StatsCards.vue';
import UpcomingAppointments from '../components/dashboard/UpcomingAppointments.vue';
import QuickActions from '../components/dashboard/QuickActions.vue';
import SpecialtyChart from '../components/dashboard/SpecialtyChart.vue';

const auth = useAuthStore();
const isLoading = ref(true);

const canSeeSpecialtyStats = computed(() => {
    // Solo Asistente (Rol 3) puede ver las estadísticas por especialidad
    return auth.user?.rol_id === 3;
});

const getNombreUsuario = computed<string>(() => {
    if (auth.user?.nombres_completos) {
        // Obtener solo el primer nombre
        const nombres = auth.user.nombres_completos.split(' ');
        return nombres[0] || 'Usuario';
    }
    return auth.user?.username || 'Usuario';
});

const stats = ref<DashboardStats>({
    totalPacientes: 0,
    citasHoy: 0,
    citasPendientesHoy: 0,
    medicosActivos: 0,
    citasPendientesTotal: 0
});

const proximasCitas = ref<UpcomingAppointment[]>([]);
const citasPorEspecialidad = ref<AppointmentBySpecialty[]>([]);

const fetchData = async () => {
    isLoading.value = true;
    try {
        const promises: any[] = [
            dashboardService.getStats(),
            dashboardService.getUpcomingAppointments()
        ];

        if (canSeeSpecialtyStats.value) {
            promises.push(dashboardService.getAppointmentsBySpecialty());
        }

        const [statsRes, upcomingRes, specialtyRes] = await Promise.all(promises);

        stats.value = statsRes.data;
        proximasCitas.value = upcomingRes.data;

        if (specialtyRes) {
            citasPorEspecialidad.value = specialtyRes.data;
        }
    } catch (error) {
        console.error("Error cargando dashboard:", error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchData();
});
</script>