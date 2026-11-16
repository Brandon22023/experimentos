<script setup lang="ts">
import { computed, ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import VehicleCard from '@/components/VehicleCard.vue'
import { MOTORCYCLES } from '@/data/vehicles'

const categories = ['Todas', ...new Set(MOTORCYCLES.map((m) => m.category))]
const selected = ref('Todas')

const visible = computed(() =>
  selected.value === 'Todas'
    ? MOTORCYCLES
    : MOTORCYCLES.filter((m) => m.category === selected.value),
)

const totalUnits = MOTORCYCLES.reduce((sum, m) => sum + m.stock, 0)
const outOfStock = MOTORCYCLES.filter((m) => m.stock === 0).length
const inventoryValue = new Intl.NumberFormat('es', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
}).format(MOTORCYCLES.reduce((sum, m) => sum + m.price * m.stock, 0))
</script>

<template>
  <AppHeader />
  <main class="catalog">
    <div class="catalog-head">
      <h1>Opciones de motos</h1>
      <p>Panel de administración: inventario de motos.</p>
    </div>

    <section class="stats" aria-label="Resumen del inventario">
      <div class="stat"><span>Modelos</span><strong>{{ MOTORCYCLES.length }}</strong></div>
      <div class="stat"><span>Unidades en stock</span><strong>{{ totalUnits }}</strong></div>
      <div class="stat"><span>Sin stock</span><strong>{{ outOfStock }}</strong></div>
      <div class="stat"><span>Valor del inventario</span><strong>{{ inventoryValue }}</strong></div>
    </section>

    <div class="filters" role="group" aria-label="Filtrar por categoría">
      <button
        v-for="cat in categories"
        :key="cat"
        type="button"
        class="chip"
        :class="{ active: selected === cat }"
        :aria-pressed="selected === cat"
        @click="selected = cat"
      >
        {{ cat }}
      </button>
    </div>

    <div class="grid">
      <VehicleCard v-for="moto in visible" :key="moto.id" :vehicle="moto" show-stock />
    </div>
  </main>
</template>
