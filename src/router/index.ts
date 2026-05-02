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
          component: () => import('@/views/ServicesView.vue'), // Temporalmente a Services
        },
        {
          path: 'services',
          name: 'services',
          component: () => import('@/views/ServicesView.vue'),
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
    // ── Booking (Vista cliente) ───────────────────────
    {
      path: '/booking',
      component: () => import('@/layouts/BookingLayout.vue'),
      children: [
        {
          path: 'confirmation',
          name: 'booking-confirmation',
          component: () => import('@/views/AppointmentConfirmationView.vue')
        }
      ]
    }
  ],
})

export default router
