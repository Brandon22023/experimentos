<script setup lang="ts">
import { computed } from 'vue'
import type { Vehicle } from '@/types/vehicle'

const props = defineProps<{
  vehicle: Vehicle
  /** Muestra el stock (vista de admin). */
  showStock?: boolean
}>()

const price = computed(() =>
  new Intl.NumberFormat('es', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
    props.vehicle.price,
  ),
)
</script>

<template>
  <article class="vehicle-card">
    <div class="vehicle-emoji" aria-hidden="true">{{ vehicle.emoji }}</div>
    <div class="vehicle-body">
      <span class="badge">{{ vehicle.category }}</span>
      <h3>{{ vehicle.brand }} {{ vehicle.model }}</h3>
      <p class="vehicle-meta">{{ vehicle.year }} · {{ vehicle.spec }}</p>
      <div class="vehicle-footer">
        <strong class="vehicle-price">{{ price }}</strong>
        <span
          v-if="showStock"
          class="stock"
          :class="{ 'stock-out': vehicle.stock === 0, 'stock-low': vehicle.stock > 0 && vehicle.stock <= 2 }"
        >
          {{ vehicle.stock === 0 ? 'Sin stock' : `Stock: ${vehicle.stock}` }}
        </span>
      </div>
    </div>
  </article>
</template>
