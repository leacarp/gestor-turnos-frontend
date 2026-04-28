<script setup lang="ts">
import { Icon } from '@iconify/vue'
// Logic for Pagos
</script>

<template>
  <div class="config-pagos">
    <div class="config-pagos__container">
      
      <!-- Header -->
      <div class="config-pagos__header">
        <h2 class="config-pagos__title">Configuración de Pagos</h2>
        <p class="config-pagos__description">
          Gestiona cómo recibes tus ingresos, integra pasarelas de pago y define tus políticas de reserva.
        </p>
      </div>

      <!-- Bento Grid -->
      <div class="config-pagos__grid">
        
        <!-- Integration Card -->
        <div class="config-pagos__integration config-pagos__card">
          <div class="config-pagos__integration-bg"></div>
          <div>
            <div class="config-pagos__integration-top">
              <div class="config-pagos__integration-icon">
                <Icon icon="simple-icons:mercadopago" class="config-pagos__brand-icon" />
              </div>
              <div>
                <h3 class="config-pagos__integration-title">MercadoPago</h3>
                <div class="config-pagos__integration-status">
                  <span class="config-pagos__status-dot"></span>
                  <span class="config-pagos__status-text">Conectado</span>
                </div>
              </div>
            </div>
            <p class="config-pagos__integration-desc">Tu cuenta está vinculada correctamente. Recibes los cobros de forma instantánea en tu billetera digital.</p>
          </div>
          <div class="config-pagos__integration-bottom">
            <span class="config-pagos__integration-id">ID: mp_8842...992</span>
            <button class="config-pagos__integration-link">Configurar cuenta</button>
          </div>
        </div>

        <!-- Policies Card -->
        <div class="config-pagos__policies config-pagos__card">
          <h3 class="config-pagos__policies-title">Políticas de Reserva</h3>
          <div class="config-pagos__policies-list">
            
            <label class="config-pagos__policy-item">
              <div class="config-pagos__policy-info">
                <div class="config-pagos__policy-icon">
                  <span class="material-symbols-outlined">book_online</span>
                </div>
                <div>
                  <span class="config-pagos__policy-name">Requerir seña</span>
                  <span class="config-pagos__policy-desc">Solicita un pago parcial para confirmar</span>
                </div>
              </div>
              <input type="checkbox" checked class="config-pagos__checkbox" />
            </label>

            <label class="config-pagos__policy-item">
              <div class="config-pagos__policy-info">
                <div class="config-pagos__policy-icon">
                  <span class="material-symbols-outlined">payments</span>
                </div>
                <div>
                  <span class="config-pagos__policy-name">Aceptar pago total</span>
                  <span class="config-pagos__policy-desc">Permite liquidar el 100% por adelantado</span>
                </div>
              </div>
              <input type="checkbox" class="config-pagos__checkbox" />
            </label>

            <label class="config-pagos__policy-item">
              <div class="config-pagos__policy-info">
                <div class="config-pagos__policy-icon">
                  <span class="material-symbols-outlined">cancel</span>
                </div>
                <div>
                  <span class="config-pagos__policy-name">Permitir cancelación</span>
                  <span class="config-pagos__policy-desc">Habilita devoluciones automáticas</span>
                </div>
              </div>
              <input type="checkbox" checked class="config-pagos__checkbox" />
            </label>

          </div>
        </div>

        <!-- Financial Controls Card -->
        <div class="config-pagos__controls config-pagos__card config-pagos__card--shadow">
          <div class="config-pagos__controls-inner">
            <div class="config-pagos__controls-left">
              <div>
                <h3 class="config-pagos__controls-title">Valores de Reserva</h3>
                <p class="config-pagos__controls-desc">Define los montos o porcentajes fijos que los clientes deben abonar para asegurar su lugar.</p>
              </div>
              
              <div class="config-pagos__inputs-grid">
                <div class="config-pagos__input-group">
                  <label class="config-pagos__label">Monto de seña ($)</label>
                  <div class="config-pagos__input-wrapper">
                    <span class="config-pagos__input-prefix">$</span>
                    <input type="number" placeholder="0.00" class="config-pagos__input config-pagos__input--prefix" />
                  </div>
                  <p class="config-pagos__input-hint">Monto fijo sugerido para servicios estándar.</p>
                </div>
                
                <div class="config-pagos__input-group">
                  <label class="config-pagos__label">% de seña</label>
                  <div class="config-pagos__input-wrapper">
                    <span class="config-pagos__input-suffix">%</span>
                    <input type="number" value="30" class="config-pagos__input" />
                  </div>
                  <p class="config-pagos__input-hint">Calculado sobre el valor total del servicio.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="config-pagos__actions">
            <div class="config-pagos__secure">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">lock</span>
              <span>Configuración protegida por SSL de 256 bits</span>
            </div>
            <button class="config-pagos__btn-save">
              <span class="material-symbols-outlined">save</span>
              Guardar configuración de pagos
            </button>
          </div>
        </div>

        <!-- Promotional -->
        <div class="config-pagos__promo">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkjpyynq3_PkFKwim26-Jwv7TfTTrDesKU25iIvIU71QT0l_NGbnlcB6R4L0GI493WO8vazoezqFe-Hkahgy6sliFTd4foV4BYKMUwY1CmOAHWHwZUXIWyhO5yuqHf6E1Fe8Mw-aGPvXCH6QvTriwn08zZOXNWadOAHckZ6GwNoJkIKjzUPWcQNCX_oXjjkH_I-sA20lANzQ3E3Th7rzyfwGi8Es4llJq7IGW4WJkTJirnPXdP45mJg0P_pXjqddwkuY99BCF2tuY" alt="Chart" />
          <div class="config-pagos__promo-overlay"></div>
          <div class="config-pagos__promo-content">
            <div class="config-pagos__promo-text">
              <h4 class="config-pagos__promo-title">Optimiza tu facturación</h4>
              <p class="config-pagos__promo-desc">El 85% de los profesionales que cobran seña reducen el ausentismo en un 60%.</p>
            </div>
            <button class="config-pagos__promo-btn">Ver reportes</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.config-pagos__container {
  max-width: 72rem; /* 6xl */
  margin: 0 auto;
}

.config-pagos__header {
  margin-bottom: var(--space-12);
}

.config-pagos__title {
  font-size: var(--font-size-3xl); /* matches 4xl approximately or xl */
  font-weight: 800; /* extrabold */
  letter-spacing: -0.025em;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.config-pagos__description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 42rem;
}

.config-pagos__grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6);
}

.config-pagos__card {
  border-radius: var(--radius-xl);
  padding: var(--space-8);
}

.config-pagos__integration {
  grid-column: span 12;
  background-color: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

@media (min-width: 1024px) {
  .config-pagos__integration {
    grid-column: span 5;
  }
}

.config-pagos__integration-bg {
  position: absolute;
  top: -2rem;
  right: -2rem;
  width: 8rem;
  height: 8rem;
  background-color: rgba(0, 73, 122, 0.05); /* primary/5 */
  border-radius: var(--radius-full);
  filter: blur(24px);
  transition: background-color var(--transition-fast);
}

.config-pagos__integration:hover .config-pagos__integration-bg {
  background-color: rgba(0, 73, 122, 0.1);
}

.config-pagos__integration-top {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
  position: relative;
  z-index: 10;
}

.config-pagos__integration-icon {
  width: 48px;
  height: 48px;
  background-color: #e5f6ff; /* light blue close to mercadopago branding */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  color: #009ee3; /* mercadopago blue */
}

.config-pagos__brand-icon {
  font-size: 28px;
}

.config-pagos__integration-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.config-pagos__integration-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
}

.config-pagos__status-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background-color: #10b981; /* emerald-500 */
}

.config-pagos__status-text {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: #059669; /* emerald-600 */
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.config-pagos__integration-desc {
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  position: relative;
  z-index: 10;
}

.config-pagos__integration-bottom {
  margin-top: var(--space-8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 10;
}

.config-pagos__integration-id {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.config-pagos__integration-link {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-container);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: var(--space-2) var(--space-6);
  border-radius: var(--radius-full);
  transition: background-color var(--transition-fast);
}

.config-pagos__integration-link:hover {
  background-color: var(--color-surface-container-high);
  text-decoration: none;
}

.config-pagos__policies {
  grid-column: span 12;
  background-color: var(--color-surface-container);
  box-shadow: var(--shadow-sm);
}

@media (min-width: 1024px) {
  .config-pagos__policies {
    grid-column: span 7;
  }
}

.config-pagos__policies-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-6);
}

.config-pagos__policies-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.config-pagos__policy-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background-color: var(--color-surface-container-lowest);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.config-pagos__policy-item:hover {
  background-color: var(--color-surface); /* bright equivalent */
}

.config-pagos__policy-info {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.config-pagos__policy-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background-color: rgba(0, 73, 122, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-container);
}

.config-pagos__policy-name {
  display: block;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.config-pagos__policy-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.config-pagos__checkbox {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-md);
  border-color: var(--color-outline-variant);
  color: var(--color-primary-container);
}

.config-pagos__controls {
  grid-column: span 12;
  background-color: var(--color-surface-container-lowest);
  border: 1px solid rgba(192, 200, 204, 0.1);
  margin-top: var(--space-4);
}

.config-pagos__card--shadow {
  box-shadow: 0 25px 50px -12px rgba(72, 98, 110, 0.05); /* roughly shadow-2xl */
}

.config-pagos__controls-inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  align-items: flex-start;
}

@media (min-width: 768px) {
  .config-pagos__controls-inner {
    flex-direction: row;
  }
}

.config-pagos__controls-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.config-pagos__controls-title {
  font-size: 1.5rem; /* 2xl */
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.config-pagos__controls-desc {
  color: var(--color-text-secondary);
}

.config-pagos__inputs-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}

@media (min-width: 768px) {
  .config-pagos__inputs-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.config-pagos__input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.config-pagos__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.config-pagos__input-wrapper {
  position: relative;
}

.config-pagos__input-prefix {
  position: absolute;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.config-pagos__input-suffix {
  position: absolute;
  right: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.config-pagos__input {
  width: 100%;
  background-color: var(--color-surface-container-low);
  border: none;
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  transition: all var(--transition-fast);
  color: var(--color-text-primary);
}

.config-pagos__input--prefix {
  padding-left: 2.5rem;
}

.config-pagos__input:focus {
  background-color: var(--color-surface-container-lowest);
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 73, 122, 0.2);
}

.config-pagos__input-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-disabled);
  font-style: italic;
}

.config-pagos__controls-right {
  width: 100%;
  background-color: var(--color-surface-container-low);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  border: 1px solid rgba(192, 200, 204, 0.1);
}

@media (min-width: 768px) {
  .config-pagos__controls-right {
    width: 20rem; /* 80 */
  }
}

.config-pagos__summary-title {
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.config-pagos__summary-title .material-symbols-outlined {
  color: var(--color-primary-container);
}

.config-pagos__summary-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.config-pagos__summary-item {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.config-pagos__summary-val {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.config-pagos__summary-divider {
  padding-top: var(--space-4);
  border-top: 1px solid rgba(192, 200, 204, 0.2);
}

.config-pagos__summary-item--bold {
  margin-bottom: var(--space-1);
}

.config-pagos__summary-val--primary {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-container);
}

.config-pagos__progress {
  width: 100%;
  background-color: var(--color-surface-container-high);
  height: 8px;
  border-radius: var(--radius-full);
  overflow: hidden;
}

.config-pagos__progress-bar {
  background-color: var(--color-primary-container);
  height: 100%;
}

.config-pagos__actions {
  margin-top: var(--space-12);
  padding-top: var(--space-8);
  border-top: 1px solid rgba(192, 200, 204, 0.2);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  justify-content: space-between;
}

@media (min-width: 768px) {
  .config-pagos__actions {
    flex-direction: row;
    align-items: center;
  }
}

.config-pagos__secure {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.config-pagos__secure .material-symbols-outlined {
  font-size: var(--font-size-sm);
}

.config-pagos__btn-save {
  background: var(--gradient-primary);
  color: #fff;
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  box-shadow: var(--shadow-primary);
  transition: all var(--transition-fast);
}

.config-pagos__btn-save:hover {
  transform: scale(1.02);
}

.config-pagos__btn-save:active {
  transform: scale(0.98);
}

.config-pagos__promo {
  grid-column: span 12;
  height: 12rem; /* 48 */
  border-radius: var(--radius-xl);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0 var(--space-10);
}

.config-pagos__promo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.config-pagos__promo-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 73, 122, 0.8);
  backdrop-filter: blur(4px);
}

.config-pagos__promo-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: 100%;
}

@media (min-width: 768px) {
  .config-pagos__promo-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.config-pagos__promo-text {
  color: #fff;
}

.config-pagos__promo-title {
  font-size: 1.5rem; /* 2xl */
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-1);
}

.config-pagos__promo-desc {
  opacity: 0.8;
}

.config-pagos__promo-btn {
  margin-top: var(--space-4);
  padding: var(--space-2) var(--space-6);
  background-color: var(--color-surface-container-lowest);
  color: var(--color-primary-container);
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

@media (min-width: 768px) {
  .config-pagos__promo-btn {
    margin-top: 0;
  }
}

.config-pagos__promo-btn:hover {
  background-color: #fff;
}
</style>
