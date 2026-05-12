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
      path: '/booking',
      component: () => import('@/layouts/BookingLayout.vue'),
      redirect: '/booking/service',
      children: [
        { path: '', redirect: { name: 'booking-service' } },
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
        { path: 'details', name: 'booking-details', redirect: { name: 'booking-confirmation' } },
        {
          path: 'details',
          name: 'booking-details',
          component: () => import('@/views/AppointmentDetailsView.vue')
        },
        {
          path: 'guest-details',
          name: 'booking-guest-details',
          component: () => import('@/views/AppointmentDetailsGuestView.vue')
        },
        {
          path: 'confirmation',
          name: 'booking-confirmation',
          component: () => import('@/views/AppointmentConfirmationView.vue')
        },
        { path: 'payment', name: 'booking-payment', redirect: { name: 'booking-confirmation' } },
        { path: 'success', name: 'booking-success', redirect: { name: 'booking-confirmation' } }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ],
})

export default router
