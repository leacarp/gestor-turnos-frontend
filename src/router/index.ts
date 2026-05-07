import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── App (con layout de dashboard) ─────────────────
    {
      path: '/',
      component: () => import('@/layouts/DashboardLayout.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/ProviderView.vue'), // Ahora la vista por defecto es el perfil
        },
        {
          path: 'services',
          name: 'services',
          component: () => import('@/views/ServicesView.vue'),
        },
        {
          path: 'perfil',
          name: 'perfil',
          component: () => import('@/views/ProviderView.vue'),
        },
        {
          path: 'clientes',
          name: 'clientes',
          component: () => import('@/views/ClientsView.vue'),
        },
        {
          path: 'agenda',
          name: 'agenda',
          component: () => import('@/views/CalendarView.vue'),
        },
        {
          path: 'configuracion',
          component: () => import('@/views/configuration/ConfigurationView.vue'),
          redirect: '/configuracion/servicios',
          children: [
            {
              path: 'servicios',
              name: 'config-servicios',
              component: () => import('@/views/configuration/ConfigurationServiciosView.vue')
            },
            {
              path: 'horarios',
              name: 'config-horarios',
              component: () => import('@/views/configuration/ConfigurationHorariosView.vue')
            },
            {
              path: 'recordatorios',
              name: 'config-recordatorios',
              component: () => import('@/views/configuration/ConfigurationRecordatoriosView.vue')
            },
            {
              path: 'pagos',
              name: 'config-pagos',
              component: () => import('@/views/configuration/ConfigurationPagosView.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/register/onboarding',
      component: () => import('@/views/OnboardingView.vue'),
      redirect: '/register/onboarding/identity',
      children: [
        {
          path: 'identity',
          name: 'onboarding-identity',
          component: () => import('@/views/onboarding/steps/StepIdentity.vue')
        },
        {
          path: 'business',
          name: 'onboarding-business',
          component: () => import('@/views/onboarding/steps/StepBusiness.vue')
        },
        {
          path: 'schedule',
          name: 'onboarding-schedule',
          component: () => import('@/views/onboarding/steps/StepSchedule.vue')
        },
        {
          path: 'finalize',
          name: 'onboarding-finalize',
          component: () => import('@/views/onboarding/steps/StepFinalize.vue')
        }
      ]
    },
    {
<<<<<<< HEAD
      path: '/booking',
      component: () => import('@/layouts/BookingLayout.vue'),
      redirect: '/booking/service',
      children: [
        {
          path: 'service',
          name: 'booking-service',
          component: () => import('@/views/AppointmentSelectServiceView.vue')
        },
        {
          path: 'schedule',
          name: 'booking-schedule',
          component: () => import('@/views/AppointmentSelectDateView.vue')
        },
        {
          path: 'confirmation',
          name: 'booking-confirmation',
          component: () => import('@/views/AppointmentConfirmationView.vue')
        }
      ]
=======
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
>>>>>>> af09b70fd495e9b0bd5f4b5f0c0c1cffd98a5642
    }
  ],
})

export default router
