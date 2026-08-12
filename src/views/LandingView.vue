<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const isLoggedIn = computed(() => authStore.isAuthenticated)
const userName = computed(() => authStore.user?.name || 'Usuario')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(async () => {
  handleScroll()
  window.addEventListener('scroll', handleScroll)
  await authStore.restoreSession()
})
onBeforeUnmount(() => window.removeEventListener('scroll', handleScroll))

function scrollTo(id: string) {
  mobileMenuOpen.value = false
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function goToRegister() {
  router.push('/register/onboarding')
}

function goToLogin() {
  router.push('/login')
}

function handleLogout() {
  mobileMenuOpen.value = false
  authStore.logout()
}

const benefits = [
  {
    icon: 'edit_off',
    title: 'Sin papelería',
    description: 'Olvidate de las agendas físicas y los mensajes de WhatsApp. Todo centralizado en un solo lugar.',
  },
  {
    icon: 'schedule',
    title: 'Reservas 24/7',
    description: 'Tus clientes pueden sacar turno en cualquier momento, incluso cuando estás durmiendo.',
  },
  {
    icon: 'payments',
    title: 'Pagos integrados',
    description: 'Aceptá señas o pagos completos con MercadoPago de forma automática al confirmar el turno.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Registrate',
    description: 'Creá tu cuenta y cargá los datos de tu negocio en pocos minutos.',
    icon: 'person_add',
  },
  {
    number: '02',
    title: 'Configurás tus servicios',
    description: 'Definí servicios, precios, duración y los horarios en los que querés atender.',
    icon: 'tune',
  },
  {
    number: '03',
    title: 'Tus clientes reservan',
    description: 'Compartí tu enlace y dejá que elijan servicio, día y horario por su cuenta.',
    icon: 'event_available',
  },
]

const features = [
  { icon: 'grid_view', title: 'Dashboard', description: 'Métricas de turnos, ingresos estimados y variación mensual en tiempo real.' },
  { icon: 'calendar_month', title: 'Agenda visual', description: 'Vista semanal y mensual con todos tus turnos organizados por estado.' },
  { icon: 'inventory_2', title: 'Gestión de servicios', description: 'Creá, editá y desactivá servicios con duración, precio y descripción.' },
  { icon: 'group', title: 'Clientes', description: 'Historial de cada cliente: turnos anteriores, datos de contacto y más.' },
  { icon: 'notifications_active', title: 'Recordatorios', description: 'Notificaciones automáticas para vos y tus clientes antes del turno.' },
  { icon: 'account_balance_wallet', title: 'MercadoPago', description: 'Cobrá señas o el total al reservar. Sin complicaciones, sin intermediarios.' },
]

const industries = [
  { icon: 'content_cut', label: 'Peluquerías y barberías' },
  { icon: 'favorite', label: 'Salud y bienestar' },
  { icon: 'fitness_center', label: 'Fitness y entrenamiento' },
  { icon: 'school', label: 'Tutorías y clases' },
]
</script>

<template>
  <div class="landing">

    <!-- ── NAVBAR ──────────────────────────────────────────────── -->
    <header class="landing-nav" :class="{ 'landing-nav--scrolled': isScrolled }">
      <div class="landing-nav__inner">
        <button class="landing-nav__logo" type="button" @click="scrollTo('hero')" aria-label="Ir al inicio">
          <img src="/logo.png" alt="Sloty" class="landing-nav__logo-img" />
          <span class="landing-nav__logo-text">Sloty</span>
        </button>

        <nav class="landing-nav__links">
          <button class="landing-nav__link" @click="scrollTo('como-funciona')">Cómo funciona</button>
          <button class="landing-nav__link" @click="scrollTo('features')">Funcionalidades</button>
          <button class="landing-nav__link" @click="scrollTo('para-quien')">Para quién</button>
        </nav>

        <div v-if="isLoggedIn" class="landing-nav__actions">
          <span class="landing-nav__user">
            <span class="landing-nav__user-avatar">{{ userInitial }}</span>
            <span>Hola, {{ userName }}</span>
          </span>
          <button class="landing-nav__btn-ghost" @click="handleLogout">Cerrar sesión</button>
        </div>
        <div v-else class="landing-nav__actions">
          <button class="landing-nav__btn-ghost" @click="goToLogin">Iniciar sesión</button>
          <button class="landing-nav__btn-primary" @click="goToRegister">Comenzar gratis</button>
        </div>

        <!-- Mobile hamburger -->
        <button class="landing-nav__hamburger" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Menú">
          <span class="material-symbols-outlined">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
        </button>
      </div>

      <!-- Mobile menu -->
      <div class="landing-nav__mobile-menu" :class="{ 'landing-nav__mobile-menu--open': mobileMenuOpen }">
        <button class="landing-nav__mobile-link" @click="scrollTo('como-funciona')">Cómo funciona</button>
        <button class="landing-nav__mobile-link" @click="scrollTo('features')">Funcionalidades</button>
        <button class="landing-nav__mobile-link" @click="scrollTo('para-quien')">Para quién</button>
        <template v-if="isLoggedIn">
          <span class="landing-nav__mobile-user">Hola, {{ userName }}</span>
          <button class="landing-nav__mobile-link landing-nav__mobile-link--secondary" @click="handleLogout">Cerrar sesión</button>
        </template>
        <template v-else>
          <button class="landing-nav__mobile-link landing-nav__mobile-link--secondary" @click="goToLogin">Iniciar sesión</button>
          <button class="landing-nav__mobile-link landing-nav__mobile-link--primary" @click="goToRegister">Comenzar gratis →</button>
        </template>
      </div>
    </header>

    <main>

      <!-- ── HERO ───────────────────────────────────────────────── -->
      <section id="hero" class="hero">
        <div class="hero__bg-orb hero__bg-orb--1"></div>
        <div class="hero__bg-orb hero__bg-orb--2"></div>
        <div class="hero__bg-orb hero__bg-orb--3"></div>

        <div class="hero__container">
          <div class="hero__content">
            <div class="hero__badge">
              <span class="material-symbols-outlined hero__badge-icon">bolt</span>
              <span>Gestión de turnos inteligente</span>
            </div>

            <h1 class="hero__title">
              Gestioná tus turnos<br />
              <span class="hero__title-gradient">sin esfuerzo</span>
            </h1>

            <p class="hero__subtitle">
              Sloty es la plataforma todo-en-uno para profesionales independientes.
              Organizá tu agenda, aceptá reservas online y cobrá con MercadoPago.
              Todo desde un solo lugar.
            </p>

            <div class="hero__ctas">
              <button class="hero__btn-primary" @click="isLoggedIn ? scrollTo('features') : goToRegister()">
                <span>{{ isLoggedIn ? 'Conocé Sloty' : 'Empezar gratis' }}</span>
                <span class="material-symbols-outlined">arrow_forward</span>
              </button>
              <button class="hero__btn-ghost" @click="scrollTo('como-funciona')">
                <span class="material-symbols-outlined">play_circle</span>
                <span>Ver cómo funciona</span>
              </button>
            </div>

            <div class="hero__stats">
              <div class="hero__stat">
                <span class="hero__stat-value">24/7</span>
                <span class="hero__stat-label">Reservas online</span>
              </div>
              <div class="hero__stat-divider"></div>
              <div class="hero__stat">
                <span class="hero__stat-value">$0</span>
                <span class="hero__stat-label">Para empezar</span>
              </div>
              <div class="hero__stat-divider"></div>
              <div class="hero__stat">
                <span class="hero__stat-value">100%</span>
                <span class="hero__stat-label">Adaptable a tu rubro</span>
              </div>
            </div>
          </div>

          <div class="hero__visual">
            <div class="hero__card hero__card--main">
              <div class="hero__card-header">
                <div class="hero__card-dot hero__card-dot--red"></div>
                <div class="hero__card-dot hero__card-dot--yellow"></div>
                <div class="hero__card-dot hero__card-dot--green"></div>
                <span class="hero__card-title-bar">Agenda · Hoy</span>
              </div>
              <div class="hero__appointments">
                <div class="hero__appt hero__appt--confirmed">
                  <div class="hero__appt-time">09:00</div>
                  <div class="hero__appt-info">
                    <span class="hero__appt-name">María González</span>
                    <span class="hero__appt-service">Corte + Color</span>
                  </div>
                  <div class="hero__appt-badge hero__appt-badge--confirmed">Confirmado</div>
                </div>
                <div class="hero__appt hero__appt--pending">
                  <div class="hero__appt-time">11:30</div>
                  <div class="hero__appt-info">
                    <span class="hero__appt-name">Lucas Pereyra</span>
                    <span class="hero__appt-service">Barba</span>
                  </div>
                  <div class="hero__appt-badge hero__appt-badge--pending">Pendiente</div>
                </div>
                <div class="hero__appt hero__appt--confirmed">
                  <div class="hero__appt-time">14:00</div>
                  <div class="hero__appt-info">
                    <span class="hero__appt-name">Ana Ruiz</span>
                    <span class="hero__appt-service">Mechas</span>
                  </div>
                  <div class="hero__appt-badge hero__appt-badge--confirmed">Confirmado</div>
                </div>
                <div class="hero__appt hero__appt--new">
                  <div class="hero__appt-time">16:30</div>
                  <div class="hero__appt-info">
                    <span class="hero__appt-name">Carlos Díaz</span>
                    <span class="hero__appt-service">Corte clásico</span>
                  </div>
                  <div class="hero__appt-badge hero__appt-badge--new">Nuevo ✨</div>
                </div>
              </div>
            </div>

            <div class="hero__card hero__card--metric">
              <div class="hero__metric-label">Ingresos del mes</div>
              <div class="hero__metric-value">$148.500</div>
              <div class="hero__metric-trend">
                <span class="material-symbols-outlined">trending_up</span>
                +18% respecto al mes anterior
              </div>
            </div>

            <div class="hero__card hero__card--notify">
              <span class="material-symbols-outlined hero__notify-icon">notifications_active</span>
              <div>
                <div class="hero__notify-title">Nuevo turno</div>
                <div class="hero__notify-body">Carlos Díaz — Hoy 16:30</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── BENEFICIOS ─────────────────────────────────────────── -->
      <section id="beneficios" class="benefits">
        <div class="benefits__container">
          <div class="benefits__header">
            <h2 class="benefits__title">¿Por qué Sloty?</h2>
            <p class="benefits__subtitle">Diseñado para que pases menos tiempo coordinando y más tiempo trabajando.</p>
          </div>
          <div class="benefits__grid">
            <div
              v-for="benefit in benefits"
              :key="benefit.title"
              class="benefit-card"
            >
              <div class="benefit-card__icon-wrap">
                <span class="material-symbols-outlined benefit-card__icon">{{ benefit.icon }}</span>
              </div>
              <h3 class="benefit-card__title">{{ benefit.title }}</h3>
              <p class="benefit-card__desc">{{ benefit.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── CÓMO FUNCIONA ──────────────────────────────────────── -->
      <section id="como-funciona" class="how-it-works">
        <div class="how-it-works__container">
          <div class="how-it-works__header">
            <span class="how-it-works__eyebrow">Fácil de usar</span>
            <h2 class="how-it-works__title">Empezá en 3 pasos</h2>
            <p class="how-it-works__subtitle">Sin instalaciones. Sin configuraciones complicadas. En minutos ya estás operativo.</p>
          </div>

          <div class="how-it-works__steps">
            <div
              v-for="(step, i) in steps"
              :key="step.number"
              class="step-card"
            >
              <div class="step-card__connector" v-if="i < steps.length - 1"></div>
              <div class="step-card__number-wrap">
                <span class="step-card__number">{{ step.number }}</span>
              </div>
              <div class="step-card__icon-wrap">
                <span class="material-symbols-outlined step-card__icon">{{ step.icon }}</span>
              </div>
              <h3 class="step-card__title">{{ step.title }}</h3>
              <p class="step-card__desc">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── FEATURES ───────────────────────────────────────────── -->
      <section id="features" class="features-section">
        <div class="features-section__container">
          <div class="features-section__header">
            <span class="features-section__eyebrow">Todo incluido</span>
            <h2 class="features-section__title">Funcionalidades pensadas para vos</h2>
            <p class="features-section__subtitle">Cada herramienta de Sloty fue diseñada para ahorrarle tiempo a profesionales independientes.</p>
          </div>

          <div class="features-section__grid">
            <div
              v-for="feature in features"
              :key="feature.title"
              class="feature-card"
            >
              <div class="feature-card__icon-wrap">
                <span class="material-symbols-outlined feature-card__icon">{{ feature.icon }}</span>
              </div>
              <h3 class="feature-card__title">{{ feature.title }}</h3>
              <p class="feature-card__desc">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── PARA QUIÉN ─────────────────────────────────────────── -->
      <section id="para-quien" class="for-who">
        <div class="for-who__container">
          <div class="for-who__header">
            <span class="for-who__eyebrow">Industrias</span>
            <h2 class="for-who__title">Hecho para profesionales como vos</h2>
            <p class="for-who__subtitle">Sloty se adapta a cualquier servicio que trabaje con turnos.</p>
          </div>

          <div class="for-who__grid">
            <div
              v-for="industry in industries"
              :key="industry.label"
              class="industry-chip"
            >
              <span class="material-symbols-outlined industry-chip__icon">{{ industry.icon }}</span>
              <span class="industry-chip__label">{{ industry.label }}</span>
            </div>
          </div>

          <p class="for-who__note">¿Tu rubro no está en la lista? <strong>Sloty funciona para cualquier servicio con turnos.</strong></p>
        </div>
      </section>

      <!-- ── CTA FINAL ──────────────────────────────────────────── -->
      <section class="final-cta">
        <div class="final-cta__bg-orb final-cta__bg-orb--1"></div>
        <div class="final-cta__bg-orb final-cta__bg-orb--2"></div>
        <div class="final-cta__container">
          <div class="final-cta__icon-wrap">
            <span class="material-symbols-outlined final-cta__icon">rocket_launch</span>
          </div>
          <h2 class="final-cta__title">Empezá a organizar tu agenda hoy</h2>
          <p class="final-cta__subtitle">
            Creá tu cuenta gratis, configurá tus servicios en minutos y compartí tu enlace con tus clientes.
          </p>
          <div class="final-cta__actions">
            <button class="final-cta__btn-primary" @click="isLoggedIn ? scrollTo('features') : goToRegister()">
              {{ isLoggedIn ? 'Ver funcionalidades' : 'Crear cuenta gratis' }}
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
            <button v-if="!isLoggedIn" class="final-cta__btn-ghost" @click="goToLogin">Ya tengo cuenta</button>
          </div>
        </div>
      </section>

    </main>

    <!-- ── FOOTER ─────────────────────────────────────────────── -->
    <footer class="landing-footer">
      <div class="landing-footer__inner">
        <div class="landing-footer__brand">
          <img src="/logo.png" alt="Sloty" class="landing-footer__logo" />
          <span class="landing-footer__name">Sloty</span>
        </div>
        <p class="landing-footer__copy">© {{ new Date().getFullYear() }} Sloty. Todos los derechos reservados.</p>
        <div class="landing-footer__links">
          <button class="landing-footer__link" @click="scrollTo('como-funciona')">Cómo funciona</button>
          <button class="landing-footer__link" @click="scrollTo('features')">Funcionalidades</button>
          <button class="landing-footer__link" @click="goToLogin">Ingresar</button>
        </div>
      </div>
    </footer>

  </div>
</template>

<style scoped>
/* ─────────────────────────────────────────────────────────── */
/*  BASE                                                        */
/* ─────────────────────────────────────────────────────────── */
.landing {
  font-family: var(--font-family-body);
  color: var(--color-text-primary);
  background-color: var(--color-background);
  overflow-x: hidden;
}

.landing section[id] {
  scroll-margin-top: calc(var(--header-height) + var(--space-4));
}

/* ─────────────────────────────────────────────────────────── */
/*  NAVBAR                                                      */
/* ─────────────────────────────────────────────────────────── */
.landing-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background var(--transition-slow), box-shadow var(--transition-slow), backdrop-filter var(--transition-slow);
  padding: 0 var(--space-8);
}

.landing-nav--scrolled {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: var(--shadow-md);
}

.landing-nav__inner {
  max-width: var(--container-max-width);
  margin: 0 auto;
  height: 68px;
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.landing-nav__logo {
  background: none;
  border: 0;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  padding: 0;
  text-decoration: none;
  flex-shrink: 0;
}

.landing-nav__logo-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.landing-nav__logo-text {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-primary);
  letter-spacing: -0.02em;
}

.landing-nav__links {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex: 1;
  margin-left: var(--space-4);
}

.landing-nav__link {
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-family-body);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  transition: color var(--transition-fast), background var(--transition-fast);
}

.landing-nav__link:hover {
  color: var(--color-primary);
  background: var(--color-surface-container-low);
}

.landing-nav__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.landing-nav__user {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.landing-nav__user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  color: #fff;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}

.landing-nav__btn-ghost {
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-family-body);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  transition: color var(--transition-fast);
}

.landing-nav__btn-ghost:hover {
  color: var(--color-primary);
}

.landing-nav__btn-primary {
  background: var(--gradient-primary);
  color: #fff;
  border: none;
  cursor: pointer;
  font-family: var(--font-family-body);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-primary);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.landing-nav__btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 50, 86, 0.35);
}

.landing-nav__hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-primary);
  padding: var(--space-2);
}

.landing-nav__mobile-menu {
  display: none;
  flex-direction: column;
  gap: var(--space-1);
  /* Sin padding vertical mientras está cerrado: con `box-sizing: border-box`
   * el `max-height: 0` no puede comprimir el padding, así que el menú
   * cerrado igual dibujaba una franja blanca de ~33px debajo del navbar.
   * Por lo mismo el borde arranca transparente. */
  padding: 0 var(--space-4);
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(12px);
  border-top: 1px solid transparent;
  overflow: hidden;
  max-height: 0;
  transition:
    max-height var(--transition-slow),
    padding var(--transition-slow),
    border-top-color var(--transition-slow);
}

.landing-nav__mobile-menu--open {
  max-height: 400px;
  padding-top: var(--space-4);
  padding-bottom: var(--space-4);
  border-top-color: var(--color-border);
}

.landing-nav__mobile-link {
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-family-body);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-xl);
  text-align: left;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.landing-nav__mobile-link:hover {
  background: var(--color-surface-container-low);
  color: var(--color-primary);
}

.landing-nav__mobile-link--primary {
  background: var(--gradient-primary);
  color: #fff !important;
  font-weight: var(--font-weight-semibold);
  margin-top: var(--space-2);
}

.landing-nav__mobile-link--secondary {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.landing-nav__mobile-user {
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

/* ─────────────────────────────────────────────────────────── */
/*  HERO                                                        */
/* ─────────────────────────────────────────────────────────── */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(160deg, #f0f6ff 0%, #ffffff 45%, #f0f6ff 100%);
  padding-top: 68px;
  overflow: hidden;
}

.hero__bg-orb {
  position: absolute;
  border-radius: var(--radius-full);
  filter: blur(80px);
  pointer-events: none;
}

.hero__bg-orb--1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0, 73, 122, 0.12) 0%, transparent 70%);
  top: -100px;
  right: -100px;
}

.hero__bg-orb--2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0, 50, 86, 0.08) 0%, transparent 70%);
  bottom: 50px;
  left: -80px;
}

.hero__bg-orb--3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(156, 202, 255, 0.2) 0%, transparent 70%);
  top: 50%;
  right: 15%;
}

.hero__container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: var(--space-16) var(--space-8);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: center;
  width: 100%;
}

.hero__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--color-primary-fixed);
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-1-5) var(--space-4);
  border-radius: var(--radius-full);
  width: fit-content;
  border: 1px solid rgba(0, 50, 86, 0.15);
}

.hero__badge-icon {
  font-size: 18px;
}

.hero__title {
  font-family: var(--font-family-headline);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: var(--font-weight-extrabold);
  line-height: 1.08;
  letter-spacing: -0.04em;
  color: var(--color-text-primary);
  margin: 0;
}

.hero__title-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  line-height: var(--line-height-loose);
  max-width: 480px;
  margin: 0;
}

.hero__ctas {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.hero__btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--gradient-primary);
  color: #fff;
  border: none;
  cursor: pointer;
  font-family: var(--font-family-body);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-primary-xl);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.hero__btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0, 50, 86, 0.4);
}

.hero__btn-primary .material-symbols-outlined {
  font-size: 20px;
  transition: transform var(--transition-fast);
}

.hero__btn-primary:hover .material-symbols-outlined {
  transform: translateX(4px);
}

.hero__btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: none;
  border: 1.5px solid var(--color-border);
  cursor: pointer;
  font-family: var(--font-family-body);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-full);
  transition: border-color var(--transition-fast), color var(--transition-fast), background var(--transition-fast);
}

.hero__btn-ghost:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-fixed);
}

.hero__stats {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.hero__stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hero__stat-value {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-primary);
  line-height: 1;
}

.hero__stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-disabled);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hero__stat-divider {
  width: 1px;
  height: 36px;
  background: var(--color-border);
}

/* ── Hero Visual ── */
.hero__visual {
  position: relative;
  height: 460px;
}

.hero__card {
  position: absolute;
  background: #fff;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  border: 1px solid rgba(0, 50, 86, 0.08);
}

.hero__card--main {
  width: 340px;
  right: 0;
  top: 0;
  padding: var(--space-4);
}

.hero__card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border);
}

.hero__card-dot {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
}

.hero__card-dot--red { background: #ff5f57; }
.hero__card-dot--yellow { background: #febc2e; }
.hero__card-dot--green { background: #28c840; }

.hero__card-title-bar {
  font-size: var(--font-size-xs);
  color: var(--color-text-disabled);
  font-weight: var(--font-weight-medium);
  margin-left: auto;
}

.hero__appointments {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.hero__appt {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-xl);
  background: var(--color-surface-container-low);
  transition: transform var(--transition-fast);
}

.hero__appt:hover { transform: translateX(4px); }

.hero__appt-time {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  min-width: 36px;
  font-family: var(--font-family-headline);
}

.hero__appt-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.hero__appt-name {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.hero__appt-service {
  font-size: 0.7rem;
  color: var(--color-text-disabled);
}

.hero__appt-badge {
  font-size: 0.6rem;
  font-weight: var(--font-weight-bold);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.hero__appt-badge--confirmed {
  background: #e8f5e9;
  color: #2e7d32;
}

.hero__appt-badge--pending {
  background: #fff8e1;
  color: #f57f17;
}

.hero__appt-badge--new {
  background: var(--color-primary-fixed);
  color: var(--color-primary);
}

/* metric card */
.hero__card--metric {
  left: 0;
  bottom: 60px;
  padding: var(--space-4) var(--space-5);
  width: 200px;
  animation: float 4s ease-in-out infinite;
}

.hero__metric-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-disabled);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-1);
}

.hero__metric-value {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-primary);
  line-height: 1;
  margin-bottom: var(--space-2);
}

.hero__metric-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  color: var(--color-success);
  font-weight: var(--font-weight-semibold);
}

.hero__metric-trend .material-symbols-outlined {
  font-size: 16px;
}

/* notification card */
.hero__card--notify {
  left: 80px;
  top: 20px;
  padding: var(--space-3) var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  animation: float 4s ease-in-out 2s infinite;
  max-width: 220px;
}

.hero__notify-icon {
  font-size: 24px;
  color: var(--color-primary);
}

.hero__notify-title {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.hero__notify-body {
  font-size: 0.7rem;
  color: var(--color-text-disabled);
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* ─────────────────────────────────────────────────────────── */
/*  BENEFITS                                                    */
/* ─────────────────────────────────────────────────────────── */
.benefits {
  padding: 6rem var(--space-8);
  background: var(--color-surface);
}

.benefits__container {
  max-width: var(--container-max-width);
  margin: 0 auto;
}

.benefits__header {
  text-align: center;
  margin-bottom: var(--space-16);
}

.benefits__title {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-extrabold);
  letter-spacing: -0.03em;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4);
}

.benefits__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 520px;
  margin: 0 auto;
  line-height: var(--line-height-loose);
}

.benefits__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

.benefit-card {
  background: var(--color-background);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  border: 1px solid var(--color-border);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.benefit-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-primary-soft);
  border-color: var(--color-primary-fixed-dim);
}

.benefit-card__icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-xl);
  background: var(--color-primary-fixed);
  display: flex;
  align-items: center;
  justify-content: center;
}

.benefit-card__icon {
  font-size: 26px;
  color: var(--color-primary);
  font-variation-settings: 'FILL' 1;
}

.benefit-card__title {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.benefit-card__desc {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: var(--line-height-loose);
  margin: 0;
}

/* ─────────────────────────────────────────────────────────── */
/*  HOW IT WORKS                                               */
/* ─────────────────────────────────────────────────────────── */
.how-it-works {
  padding: 6rem var(--space-8);
  background: var(--color-background);
}

.how-it-works__container {
  max-width: var(--container-max-width);
  margin: 0 auto;
}

.how-it-works__header {
  text-align: center;
  margin-bottom: var(--space-16);
}

.how-it-works__eyebrow {
  display: inline-block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-4);
  background: var(--color-primary-fixed);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
}

.how-it-works__title {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-extrabold);
  letter-spacing: -0.03em;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4);
}

.how-it-works__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 520px;
  margin: 0 auto;
  line-height: var(--line-height-loose);
}

.how-it-works__steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
  position: relative;
}

.step-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-4);
  padding: var(--space-8) var(--space-6);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-border);
  background: var(--color-background);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.step-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-primary-soft);
  border-color: var(--color-primary-fixed-dim);
}

.step-card__connector {
  position: absolute;
  top: calc(var(--space-8) + 26px);
  right: calc(-1 * var(--space-4) - 16px);
  width: calc(var(--space-8) + 32px);
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary-fixed-dim), var(--color-primary-fixed));
  z-index: 1;
  display: none;
}

.step-card__number-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-card__number {
  font-family: var(--font-family-headline);
  font-size: 0.75rem;
  font-weight: var(--font-weight-extrabold);
  color: var(--color-primary);
  background: var(--color-primary-fixed);
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0;
}

.step-card__icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-2xl);
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-primary);
}

.step-card__icon {
  font-size: 30px;
  color: #fff;
  font-variation-settings: 'FILL' 1;
}

.step-card__title {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.step-card__desc {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: var(--line-height-loose);
  margin: 0;
}

/* ─────────────────────────────────────────────────────────── */
/*  FEATURES                                                    */
/* ─────────────────────────────────────────────────────────── */
.features-section {
  padding: 6rem var(--space-8);
  background: var(--color-surface);
}

.features-section__container {
  max-width: var(--container-max-width);
  margin: 0 auto;
}

.features-section__header {
  text-align: center;
  margin-bottom: var(--space-16);
}

.features-section__eyebrow {
  display: inline-block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-4);
  background: var(--color-primary-fixed);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
}

.features-section__title {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-extrabold);
  letter-spacing: -0.03em;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4);
}

.features-section__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 520px;
  margin: 0 auto;
  line-height: var(--line-height-loose);
}

.features-section__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

.feature-card {
  background: var(--color-background);
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-primary-soft);
  border-color: var(--color-primary-fixed-dim);
}

.feature-card__icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-xl);
  background: var(--color-primary-fixed);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-card__icon {
  font-size: 22px;
  color: var(--color-primary);
  font-variation-settings: 'FILL' 1;
}

.feature-card__title {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.feature-card__desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin: 0;
}

/* ─────────────────────────────────────────────────────────── */
/*  FOR WHO                                                     */
/* ─────────────────────────────────────────────────────────── */
.for-who {
  padding: 6rem var(--space-8);
  background: var(--color-background);
}

.for-who__container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  text-align: center;
}

.for-who__header {
  margin-bottom: var(--space-12);
}

.for-who__eyebrow {
  display: inline-block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-4);
  background: var(--color-primary-fixed);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
}

.for-who__title {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-extrabold);
  letter-spacing: -0.03em;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4);
}

.for-who__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 480px;
  margin: 0 auto;
  line-height: var(--line-height-loose);
}

.for-who__grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  justify-content: center;
  margin-bottom: var(--space-10);
}

.industry-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: var(--space-3) var(--space-6);
  cursor: default;
  transition: background var(--transition-base), border-color var(--transition-base), transform var(--transition-fast);
}

.industry-chip:hover {
  background: var(--color-primary-fixed);
  border-color: var(--color-primary-fixed-dim);
  transform: translateY(-3px);
}

.industry-chip__icon {
  font-size: 22px;
  color: var(--color-primary);
  font-variation-settings: 'FILL' 1;
}

.industry-chip__label {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.for-who__note {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin: 0;
}

/* ─────────────────────────────────────────────────────────── */
/*  FINAL CTA                                                   */
/* ─────────────────────────────────────────────────────────── */
.final-cta {
  position: relative;
  padding: 6rem var(--space-8);
  background: var(--gradient-primary);
  overflow: hidden;
  text-align: center;
}

.final-cta__bg-orb {
  position: absolute;
  border-radius: var(--radius-full);
  filter: blur(60px);
  pointer-events: none;
}

.final-cta__bg-orb--1 {
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.08);
  top: -100px;
  left: -80px;
}

.final-cta__bg-orb--2 {
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.06);
  bottom: -80px;
  right: -60px;
}

.final-cta__container {
  position: relative;
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
}

.final-cta__icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-2xl);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.final-cta__icon {
  font-size: 36px;
  color: #fff;
  font-variation-settings: 'FILL' 1;
}

.final-cta__title {
  font-family: var(--font-family-headline);
  font-size: clamp(1.75rem, 4vw, 3rem);
  font-weight: var(--font-weight-extrabold);
  color: #fff;
  letter-spacing: -0.03em;
  margin: 0;
  line-height: 1.1;
}

.final-cta__subtitle {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.8);
  line-height: var(--line-height-loose);
  margin: 0;
}

.final-cta__actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
  justify-content: center;
}

.final-cta__btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: #fff;
  color: var(--color-primary);
  border: none;
  cursor: pointer;
  font-family: var(--font-family-body);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-full);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.final-cta__btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.3);
}

.final-cta__btn-primary .material-symbols-outlined {
  font-size: 20px;
}

.final-cta__btn-ghost {
  background: rgba(255, 255, 255, 0.1);
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  font-family: var(--font-family-body);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: #fff;
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-full);
  transition: background var(--transition-fast), border-color var(--transition-fast);
  backdrop-filter: blur(8px);
}

.final-cta__btn-ghost:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

/* ─────────────────────────────────────────────────────────── */
/*  FOOTER                                                      */
/* ─────────────────────────────────────────────────────────── */
.landing-footer {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: var(--space-8) var(--space-8);
}

.landing-footer__inner {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  flex-wrap: wrap;
}

.landing-footer__brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.landing-footer__logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.landing-footer__name {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.landing-footer__copy {
  font-size: var(--font-size-sm);
  color: var(--color-text-disabled);
  margin: 0;
}

.landing-footer__links {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.landing-footer__link {
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-family-body);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
  padding: 0;
}

.landing-footer__link:hover {
  color: var(--color-primary);
}

/* ─────────────────────────────────────────────────────────── */
/*  RESPONSIVE                                                  */
/* ─────────────────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .hero__container {
    grid-template-columns: 1fr;
    gap: var(--space-12);
    text-align: center;
  }

  .hero__subtitle { max-width: 100%; }
  .hero__ctas { justify-content: center; }
  .hero__stats { justify-content: center; }

  .hero__visual {
    height: 320px;
    max-width: 500px;
    margin: 0 auto;
  }

  .hero__card--main {
    width: 300px;
    right: 0;
  }

  .benefits__grid,
  .features-section__grid,
  .how-it-works__steps {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .landing-nav__links,
  .landing-nav__actions {
    display: none;
  }

  .landing-nav__hamburger {
    display: flex;
    margin-left: auto;
  }

  .landing-nav__mobile-menu {
    display: flex;
  }

  .hero__visual { display: none; }

  .hero__container {
    padding: var(--space-12) var(--space-6);
  }

  .benefits__grid,
  .features-section__grid,
  .how-it-works__steps {
    grid-template-columns: 1fr;
  }

  .benefits,
  .how-it-works,
  .features-section,
  .for-who,
  .final-cta {
    padding: 4rem var(--space-6);
  }

  .landing-footer__inner {
    flex-direction: column;
    text-align: center;
  }

  .landing-footer__links { justify-content: center; }
}
</style>
