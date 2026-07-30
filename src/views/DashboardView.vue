<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js'
import { dashboardService, type DashboardMetrics } from '@/services/dashboardService'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const router = useRouter()

const metrics   = ref<DashboardMetrics | null>(null)
const isLoading = ref(true)
const error     = ref<string | null>(null)

onMounted(async () => {
  try {
    metrics.value = await dashboardService.getMetrics()
  } catch {
    error.value = 'No se pudieron cargar las métricas.'
  } finally {
    isLoading.value = false
  }
})

// ─── KPI helpers ──────────────────────────────────────────────────────────────
const variacionLabel = computed(() => {
  const v = metrics.value?.variacionMensual
  if (v === null || v === undefined) return 'Sin datos previos'
  return v >= 0 ? `+${v}% vs mes anterior` : `${v}% vs mes anterior`
})

const variacionPositiva = computed(() => (metrics.value?.variacionMensual ?? 0) >= 0)

const ingresoFormateado = computed(() => {
  const n = metrics.value?.ingresoEstimado ?? 0
  return '$' + n.toLocaleString('es-AR')
})

// ─── Bar chart ────────────────────────────────────────────────────────────────
const barChartData = computed(() => {
  const mesActual = new Date().getMonth()
  const data      = metrics.value?.turnosPorMes ?? []
  const labels    = data.map(d => d.mes)
  const valores   = data.map(d => d.cantidad)
  const colors    = data.map((_, i) => (i === mesActual ? '#003256' : '#edeeef'))

  return {
    labels,
    datasets: [{
      label: 'Turnos',
      backgroundColor: colors,
      hoverBackgroundColor: '#00497a',
      borderRadius: 6,
      data: valores,
    }],
  }
})

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { display: false, beginAtZero: true },
    x: { grid: { display: false, drawBorder: false } },
  },
}

// ─── Donut chart ──────────────────────────────────────────────────────────────
const donutChartData = computed(() => {
  const servicios = metrics.value?.serviciosMasPedidos ?? []
  return {
    labels: servicios.map(s => s.nombre),
    datasets: [{
      backgroundColor: ['#003256', '#00497a', '#48626e', '#8da9b6', '#edeeef'],
      data: servicios.map(s => s.cantidad),
      borderWidth: 0,
      cutout: '72%',
    }],
  }
})

const donutTotal = computed(() =>
  metrics.value?.serviciosMasPedidos.reduce((acc, s) => acc + s.cantidad, 0) ?? 0,
)

const donutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 14,
        font: { family: "'Inter', sans-serif", size: 11 },
      },
    },
    tooltip: {
      callbacks: { label: (ctx: any) => ` ${ctx.label}: ${ctx.raw}` },
    },
  },
}

// ─── Tabla ────────────────────────────────────────────────────────────────────
function iniciales(nombre?: string) {
  if (!nombre) return '?'
  return nombre
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
}
</script>

<template>
  <div class="dashboard-view">
    <div class="dashboard-content">

      <!-- Loading -->
      <div v-if="isLoading" class="loading-state">
        <span class="material-symbols-outlined spin">progress_activity</span>
        <p>Cargando métricas…</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state">
        <span class="material-symbols-outlined">error</span>
        <p>{{ error }}</p>
      </div>

      <template v-else>
        <!-- KPI -->
        <section class="dashboard-kpi">
          <article class="kpi-card kpi-card--success">
            <div class="kpi-card__header">
              <div class="kpi-card__icon kpi-card__icon--success">
                <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;font-size:18px">calendar_today</span>
              </div>
              <span class="kpi-card__badge" :class="variacionPositiva ? 'badge--success' : 'badge--error'">
                {{ variacionLabel }}
              </span>
            </div>
            <p class="kpi-card__label">Turnos este mes</p>
            <h3 class="kpi-card__value">{{ metrics?.turnosEsteMes ?? 0 }}</h3>
          </article>

          <article class="kpi-card kpi-card--secondary">
            <div class="kpi-card__header">
              <div class="kpi-card__icon kpi-card__icon--secondary">
                <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;font-size:18px">how_to_reg</span>
              </div>
              <span class="kpi-card__badge badge--primary">Histórico</span>
            </div>
            <p class="kpi-card__label">Tasa de asistencia</p>
            <h3 class="kpi-card__value">{{ metrics?.tasaAsistencia ?? 0 }}%</h3>
          </article>

          <article class="kpi-card kpi-card--primary">
            <div class="kpi-card__header">
              <div class="kpi-card__icon kpi-card__icon--primary">
                <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;font-size:18px">payments</span>
              </div>
              <span class="kpi-card__badge badge--neutral">Estimado</span>
            </div>
            <p class="kpi-card__label">Ingreso este mes</p>
            <h3 class="kpi-card__value kpi-card__value--sm">{{ ingresoFormateado }}</h3>
          </article>
        </section>

        <!-- Charts -->
        <section class="dashboard-charts">
          <article class="chart-card chart-card--span-3">
            <div class="chart-card__header">
              <h4 class="chart-card__title">Turnos por mes</h4>
              <div class="legend-item">
                <span class="legend-dot legend-dot--primary"></span> Este año
              </div>
            </div>
            <div class="chart-container">
              <Bar :data="barChartData" :options="barChartOptions" />
            </div>
          </article>

          <article class="chart-card chart-card--span-2 chart-card--flex">
            <h4 class="chart-card__title" style="margin-bottom:var(--space-4)">Servicios más pedidos</h4>
            <div class="donut-wrapper">
              <Doughnut :data="donutChartData" :options="donutChartOptions" />
              <div class="donut-center">
                <span class="donut-center__value">{{ donutTotal }}</span>
                <p class="donut-center__label">Total</p>
              </div>
            </div>
          </article>
        </section>

        <!-- Tabla últimos turnos -->
        <section class="table-section">
          <div class="table-header">
            <h4 class="chart-card__title">Últimos turnos</h4>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Servicio</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="turno in metrics?.ultimosTurnos"
                  :key="turno._id"
                  class="clickable-row"
                  @click="router.push('/clientes')"
                >
                  <td>
                    <div class="client-cell">
                      <div class="avatar">{{ iniciales(turno.clienteNombre) }}</div>
                      <span class="client-name">{{ turno.clienteNombre }}</span>
                    </div>
                  </td>
                  <td class="td-service">{{ turno.servicioNombre }}</td>
                  <td class="td-date">{{ fechaCorta(turno.fecha) }} {{ turno.horaInicio }}</td>
                  <td class="td-amount">${{ turno.precio.toLocaleString('es-AR') }}</td>
                  <td>
                    <span class="status-badge" :class="`status-badge--${turno.estado}`">
                      <span class="status-dot" :class="`status-dot--${turno.estado}`"></span>
                      {{ turno.estado.charAt(0).toUpperCase() + turno.estado.slice(1) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* ── layout ─────────────────────────────────────────────────────────────────── */
.dashboard-view {
  min-height: 100vh;
  font-family: var(--font-family-base);
  background-color: var(--color-background);
  color: var(--color-on-surface);
}

.dashboard-content {
  padding: var(--space-6);
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

/* ── loading / error ─────────────────────────────────────────────────────────── */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-16);
  color: var(--color-on-surface-variant);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.spin { animation: spin 1s linear infinite; }

/* ── KPI cards ───────────────────────────────────────────────────────────────── */
.dashboard-kpi {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 768px) {
  .dashboard-kpi { grid-template-columns: repeat(3, 1fr); }
}

.kpi-card {
  background-color: var(--color-surface-container-lowest);
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-dashboard-card);
  border-left: 3px solid transparent;
  transition: transform var(--transition-slow);
}

.kpi-card:hover { transform: scale(1.015); }

.kpi-card--success   { border-left-color: var(--color-emerald-600); }
.kpi-card--secondary { border-left-color: var(--color-secondary); }
.kpi-card--primary   { border-left-color: var(--color-primary); }

.kpi-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.kpi-card__icon {
  padding: var(--space-2);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-card__icon--success   { background-color: var(--color-emerald-50);        color: var(--color-emerald-600); }
.kpi-card__icon--secondary { background-color: var(--color-secondary-fixed);   color: var(--color-secondary); }
.kpi-card__icon--primary   { background-color: var(--color-primary-container); color: var(--color-on-primary); }

.kpi-card__badge {
  font-size: 10px;
  font-weight: var(--font-weight-bold);
  padding: 3px 8px;
  border-radius: var(--radius-full);
}

.badge--success { background-color: var(--color-emerald-50);         color: var(--color-emerald-600); }
.badge--error   { background-color: var(--color-error-container);    color: var(--color-error); }
.badge--primary { background-color: var(--color-primary-fixed);      color: var(--color-primary); }
.badge--neutral { background-color: var(--color-surface-container);  color: var(--color-on-surface-variant); }

.kpi-card__label {
  font-size: var(--font-size-xs);
  color: var(--color-on-surface-variant);
  font-weight: var(--font-weight-medium);
  margin: 0 0 2px 0;
}

.kpi-card__value {
  font-size: 28px;
  font-weight: 900;
  color: var(--color-on-surface);
  margin: 0;
  letter-spacing: -0.02em;
}

.kpi-card__value--sm { font-size: 22px; }

/* ── Charts ──────────────────────────────────────────────────────────────────── */
.dashboard-charts {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 1024px) {
  .dashboard-charts { grid-template-columns: repeat(5, 1fr); }
}

.chart-card {
  background-color: var(--color-surface-container-lowest);
  padding: var(--space-5);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-dashboard-card);
}

.chart-card--span-3 { grid-column: span 3; }
.chart-card--span-2 { grid-column: span 2; }
.chart-card--flex   { display: flex; flex-direction: column; }

.chart-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.chart-card__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-on-surface);
  margin: 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: var(--font-weight-medium);
  color: var(--color-on-surface-variant);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
}

.legend-dot--primary { background-color: var(--color-primary); }

.chart-container {
  width: 100%;
  height: 180px;
}

.donut-wrapper {
  flex-grow: 1;
  position: relative;
  height: 190px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.donut-center {
  position: absolute;
  top: 38%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.donut-center__value {
  font-size: 20px;
  font-weight: 900;
  color: var(--color-on-surface);
  display: block;
}

.donut-center__label {
  font-size: 9px;
  color: var(--color-on-surface-variant);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}

/* ── Table ───────────────────────────────────────────────────────────────────── */
.table-section {
  background-color: var(--color-surface-container-lowest);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-dashboard-card);
  overflow: hidden;
}

.table-header {
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-surface-container-low);
}

.table-responsive { overflow-x: auto; }

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table thead tr {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 900;
  color: var(--color-on-surface-variant);
  border-bottom: 1px solid var(--color-surface-container-low);
  background-color: rgba(249, 249, 255, 0.5);
}

.data-table th {
  padding: var(--space-3) var(--space-5);
  font-weight: 900;
}

.data-table td {
  padding: var(--space-3) var(--space-5);
}

.data-table tbody tr {
  border-bottom: 1px solid var(--color-surface-container-low);
  transition: background-color var(--transition-base);
}

.data-table tbody tr:last-child { border-bottom: none; }

.clickable-row { cursor: pointer; }

.data-table tbody tr:hover {
  background-color: rgba(242, 243, 253, 0.5);
}

.client-cell {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background-color: rgba(0, 88, 190, 0.1);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: 10px;
  flex-shrink: 0;
}

.client-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-on-surface);
}

.td-service {
  font-size: var(--font-size-sm);
  color: var(--color-on-surface-variant);
}

.td-date {
  font-size: var(--font-size-xs);
  color: var(--color-on-surface-variant);
  white-space: nowrap;
}

.td-amount {
  font-size: var(--font-size-sm);
  font-weight: 900;
  color: var(--color-on-surface);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: var(--font-weight-bold);
}

.status-badge--completado { color: var(--color-emerald-600); }
.status-badge--cancelado  { color: var(--color-error); }
.status-badge--confirmado { color: var(--color-primary); }
.status-badge--pendiente  { color: var(--color-on-surface-variant); }

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
}

.status-dot--completado { background-color: var(--color-emerald-600); }
.status-dot--cancelado  { background-color: var(--color-error); }
.status-dot--confirmado { background-color: var(--color-primary); }
.status-dot--pendiente  { background-color: var(--color-on-surface-variant); }
</style>
