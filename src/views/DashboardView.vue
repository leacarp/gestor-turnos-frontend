<script setup lang="ts">
import { computed } from 'vue'
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
  ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const router = useRouter()

const barChartData = computed(() => {
  const currentMonth = new Date().getMonth()
  const backgroundColors = Array(12).fill('#edeeef')
  backgroundColors[currentMonth] = '#003256'

  return {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Turnos',
        backgroundColor: backgroundColors,
        hoverBackgroundColor: '#00497a',
        borderRadius: 8,
        data: [40, 55, 85, 65, 75, 90, 30, 20, 50, 70, 80, 95]
      }
    ]
  }
})

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      display: false,
      beginAtZero: true
    },
    x: {
      grid: {
        display: false,
        drawBorder: false
      }
    }
  }
}

const donutChartData = {
  labels: ['Corte', 'Coloración', 'Manicura', 'Pedicura'],
  datasets: [
    {
      backgroundColor: ['#003256', '#00497a', '#48626e', '#edeeef'],
      data: [45, 25, 15, 15],
      borderWidth: 0,
      cutout: '75%'
    }
  ]
}

const donutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          family: "'Inter', sans-serif",
          size: 12
        }
      }
    },
    tooltip: {
      callbacks: {
        label: (context: any) => ` ${context.label}: ${context.raw}%`
      }
    }
  }
}

function goToClient() {
  router.push('/clientes')
}
</script>

<template>
  <div class="dashboard-view">
    <div class="dashboard-content">
      <!-- KPI Metrics Section -->
      <section class="dashboard-kpi">
        <article class="kpi-card kpi-card--highlight-success">
          <div class="kpi-card__header">
            <div class="kpi-card__icon-wrapper kpi-card__icon-wrapper--primary-fixed">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">calendar_today</span>
            </div>
            <span class="kpi-card__badge kpi-card__badge--success">+12% vs mes anterior</span>
          </div>
          <div class="kpi-card__body">
            <p class="kpi-card__label">Turnos este mes</p>
            <h3 class="kpi-card__value">68</h3>
          </div>
        </article>
        
        <article class="kpi-card kpi-card--highlight-secondary">
          <div class="kpi-card__header">
            <div class="kpi-card__icon-wrapper kpi-card__icon-wrapper--secondary-fixed">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">how_to_reg</span>
            </div>
            <span class="kpi-card__badge kpi-card__badge--primary">Optima</span>
          </div>
          <div class="kpi-card__body">
            <p class="kpi-card__label">Tasa de asistencia</p>
            <h3 class="kpi-card__value">92%</h3>
          </div>
        </article>
        
        <article class="kpi-card kpi-card--highlight-primary">
          <div class="kpi-card__header">
            <div class="kpi-card__icon-wrapper kpi-card__icon-wrapper--primary-container">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">payments</span>
            </div>
            <span class="kpi-card__badge kpi-card__badge--neutral">Estimado</span>
          </div>
          <div class="kpi-card__body">
            <p class="kpi-card__label">Ingreso estimado</p>
            <h3 class="kpi-card__value">$204.000</h3>
          </div>
        </article>
      </section>

      <!-- Charts Section -->
      <section class="dashboard-charts">
        <article class="chart-card chart-card--span-3">
          <div class="chart-card__header-flex">
            <h4 class="chart-card__title">Turnos por mes</h4>
            <div class="chart-card__legend">
              <span class="chart-card__legend-item">
                <span class="chart-card__legend-dot chart-card__legend-dot--primary"></span> Este año
              </span>
            </div>
          </div>
          <div class="chart-container" style="height: 256px;">
            <Bar :data="barChartData" :options="barChartOptions" />
          </div>
        </article>

        <article class="chart-card chart-card--span-2 chart-card--flex">
          <h4 class="chart-card__title chart-card__title--mb-6">Servicios más pedidos</h4>
          <div class="donut-chart-wrapper" style="height: 256px; position: relative;">
            <Doughnut :data="donutChartData" :options="donutChartOptions" />
            <div class="donut-center-text">
              <span class="donut-chart__value">1,284</span>
              <p class="donut-chart__label">Total</p>
            </div>
          </div>
        </article>
      </section>

      <!-- Transactions Table Section -->
      <section class="transactions-section">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr @click="goToClient" class="clickable-row">
                <td class="data-table__id">#SL-2934</td>
                <td>
                  <div class="data-table__client">
                    <div class="data-table__avatar data-table__avatar--primary">MA</div>
                    <span class="data-table__client-name">Martina Alavez</span>
                  </div>
                </td>
                <td class="data-table__service">Balayage Premium</td>
                <td class="data-table__amount">$12.500</td>
                <td>
                  <span class="data-table__status data-table__status--success">
                    <span class="data-table__status-dot data-table__status-dot--success"></span> Completado
                  </span>
                </td>
              </tr>
              <tr @click="goToClient" class="clickable-row">
                <td class="data-table__id">#SL-2935</td>
                <td>
                  <div class="data-table__client">
                    <div class="data-table__avatar data-table__avatar--primary">JR</div>
                    <span class="data-table__client-name">Julián Rossi</span>
                  </div>
                </td>
                <td class="data-table__service">Corte Clásico</td>
                <td class="data-table__amount">$4.200</td>
                <td>
                  <span class="data-table__status data-table__status--success">
                    <span class="data-table__status-dot data-table__status-dot--success"></span> Completado
                  </span>
                </td>
              </tr>
              <tr @click="goToClient" class="clickable-row">
                <td class="data-table__id">#SL-2936</td>
                <td>
                  <div class="data-table__client">
                    <div class="data-table__avatar data-table__avatar--error">SP</div>
                    <span class="data-table__client-name">Sofia Paredes</span>
                  </div>
                </td>
                <td class="data-table__service">Manicura Gel</td>
                <td class="data-table__amount">$3.800</td>
                <td>
                  <span class="data-table__status data-table__status--error">
                    <span class="data-table__status-dot data-table__status-dot--error"></span> Cancelado
                  </span>
                </td>
              </tr>
              <tr @click="goToClient" class="clickable-row">
                <td class="data-table__id">#SL-2937</td>
                <td>
                  <div class="data-table__client">
                    <div class="data-table__avatar data-table__avatar--primary">LG</div>
                    <span class="data-table__client-name">Lucas Gómez</span>
                  </div>
                </td>
                <td class="data-table__service">Coloración Global</td>
                <td class="data-table__amount">$8.900</td>
                <td>
                  <span class="data-table__status data-table__status--success">
                    <span class="data-table__status-dot data-table__status-dot--success"></span> Completado
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard-view {
  position: relative;
  min-height: 100vh;
  font-family: var(--font-family-base);
  background-color: var(--color-background);
  color: var(--color-on-surface);
}

.dashboard-content {
  padding: var(--space-8);
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.dashboard-kpi {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .dashboard-kpi {
    grid-template-columns: repeat(3, 1fr);
  }
}

.kpi-card {
  background-color: var(--color-surface-container-lowest);
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-dashboard-card);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform var(--transition-slow);
}

.kpi-card:hover {
  transform: scale(1.02);
}

.kpi-card--highlight-success {
  border-left: 4px solid var(--color-emerald-600);
}

.kpi-card--highlight-secondary {
  border-left: 4px solid var(--color-secondary);
}

.kpi-card--highlight-primary {
  border-left: 4px solid var(--color-primary);
}

.kpi-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.kpi-card__icon-wrapper {
  padding: var(--space-3);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-card__icon-wrapper--primary-fixed {
  background-color: var(--color-primary-fixed);
  color: var(--color-primary);
}

.kpi-card__icon-wrapper--secondary-fixed {
  background-color: var(--color-secondary-fixed);
  color: var(--color-secondary);
}

.kpi-card__icon-wrapper--primary-container {
  background-color: var(--color-primary-container);
  color: var(--color-on-primary);
}

.kpi-card__badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  padding: 4px 8px;
  border-radius: var(--radius-full);
}

.kpi-card__badge--success {
  background-color: var(--color-emerald-50);
  color: var(--color-emerald-600);
}

.kpi-card__badge--primary {
  background-color: var(--color-primary-fixed);
  color: var(--color-primary);
}

.kpi-card__badge--neutral {
  background-color: var(--color-surface-container);
  color: var(--color-on-surface-variant);
}

.kpi-card__body {
  margin-top: var(--space-8);
}

.kpi-card__label {
  color: var(--color-on-surface-variant);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  margin: 0;
}

.kpi-card__value {
  font-size: 36px;
  font-weight: 900;
  color: var(--color-on-surface);
  margin: 4px 0 0 0;
  letter-spacing: -0.02em;
}

.dashboard-charts {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 1024px) {
  .dashboard-charts {
    grid-template-columns: repeat(5, 1fr);
  }
}

.chart-card {
  background-color: var(--color-surface-container-lowest);
  padding: var(--space-8);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-dashboard-card);
}

.chart-card--span-3 {
  grid-column: span 3;
}

.chart-card--span-2 {
  grid-column: span 2;
}

.chart-card--flex {
  display: flex;
  flex-direction: column;
}

.chart-card__header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-10);
}

.chart-card__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-on-surface);
  margin: 0;
}

.chart-card__title--mb-6 {
  margin-bottom: var(--space-6);
}

.chart-card__legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-on-surface-variant);
}

.chart-card__legend-dot {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-full);
}

.chart-card__legend-dot--primary {
  background-color: var(--color-primary);
}

.chart-container {
  width: 100%;
}

.donut-chart-wrapper {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.donut-center-text {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.donut-chart__value {
  font-size: 24px;
  font-weight: 900;
  color: var(--color-on-surface);
  display: block;
}

.donut-chart__label {
  font-size: 10px;
  color: var(--color-on-surface-variant);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}

.transactions-section {
  background-color: var(--color-surface-container-lowest);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-dashboard-card);
  overflow: hidden;
}

.transactions-section__header {
  padding: var(--space-6) var(--space-8);
  border-bottom: 1px solid var(--color-surface-container);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transactions-section__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-on-surface);
  margin: 0;
}

.transactions-section__view-all {
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  background: transparent;
  border: none;
  cursor: pointer;
}

.transactions-section__view-all:hover {
  text-decoration: underline;
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  text-align: left;
  border-collapse: collapse;
}

.data-table thead tr {
  color: var(--color-on-surface-variant);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 900;
  border-bottom: 1px solid var(--color-surface-container-low);
  background-color: rgba(249, 249, 255, 0.5);
}

.data-table th {
  padding: var(--space-4) var(--space-8);
  font-weight: 900;
}

.data-table tbody tr {
  border-bottom: 1px solid var(--color-surface-container-low);
  transition: background-color var(--transition-base);
}

.clickable-row {
  cursor: pointer;
}

.data-table tbody tr:hover {
  background-color: rgba(242, 243, 253, 0.5);
}

.data-table tbody tr:last-child {
  border-bottom: none;
}

.data-table td {
  padding: 20px var(--space-8);
}

.data-table__id {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
}

.data-table__client {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.data-table__avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-xs);
}

.data-table__avatar--primary {
  background-color: rgba(0, 88, 190, 0.1);
  color: var(--color-primary);
}

.data-table__avatar--error {
  background-color: var(--color-error-container);
  color: var(--color-error);
}

.data-table__client-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-on-surface);
}

.data-table__service {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-on-surface-variant);
}

.data-table__amount {
  font-size: var(--font-size-sm);
  font-weight: 900;
  color: var(--color-on-surface);
}

.data-table__method {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  background-color: rgba(210, 224, 253, 0.3);
  padding: 4px 12px;
  border-radius: var(--radius-full);
}

.data-table__method-icon {
  font-size: 14px;
}

.data-table__status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}

.data-table__status--success {
  color: var(--color-emerald-600);
}

.data-table__status--error {
  color: var(--color-error);
}

.data-table__status-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
}

.data-table__status-dot--success {
  background-color: var(--color-emerald-600);
}

.data-table__status-dot--error {
  background-color: var(--color-error);
}
</style>
