// src/router/index.ts

import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import DashboardLayout from "../layouts/DashboardLayout.vue";
import LoginView from "../views/Login.vue";
import PacientesView from "../views/PacientesView.vue";
import CitasView from "../views/CitasView.vue";
import MedicosView from "../views/MedicosView.vue";
import Admin from "../views/Admin.vue";
import ReportesView from "../views/ReportesView.vue";
import DashboardView from "../views/DashboardView.vue";
import { useAuthStore } from "../store/auth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/",
    component: DashboardLayout, // Usar el layout
    children: [
      {
        path: "",
        redirect: "/dashboard",
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: DashboardView,
      },
      {
        path: "pacientes",
        name: "Pacientes",
        component: PacientesView,
      },
      {
        path: "citas",
        name: "Citas",
        component: CitasView,
      },
      {
        path: "medicos",
        name: "Medicos",
        component: MedicosView,
      },
      {
        path: "reportes",
        name: "Reportes",
        component: ReportesView,
      },
      {
        path: "admin",
        name: "Administrador",
        component: Admin,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();
  
  // Si el usuario está autenticado y trata de ir al login, redirigir al dashboard
  if (to.name === "Login" && auth.isAuthenticated) {
    next({ name: "Dashboard" });
    return;
  }

  // Si el usuario NO está autenticado y trata de ir a una ruta protegida (cualquiera que no sea Login)
  if (to.name !== "Login" && !auth.isAuthenticated) {
    next({ name: "Login" });
    return;
  }

  // En cualquier otro caso, permitir la navegación
  next();
});


export default router;