<script setup lang="ts">
import { computed, ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import VehicleCard from '@/components/VehicleCard.vue'
import { CARS } from '@/data/vehicles'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const categories = ['Todos', ...new Set(CARS.map((c) => c.category))]
const selected = ref('Todos')

const visible = computed(() =>
  selected.value === 'Todos' ? CARS : CARS.filter((c) => c.category === selected.value),
)
</script>

<template>
  <AppHeader />
  <main class="catalog">
    <div class="catalog-head">
      <h1>Opciones de carros</h1>
      <p>Hola {{ auth.user?.name }}, estos son los carros disponibles para ti.</p>
    </div>

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
      <VehicleCard v-for="car in visible" :key="car.id" :vehicle="car" />
    </div>
  </main>
</template>
