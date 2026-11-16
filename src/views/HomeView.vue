<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const memberSince = computed(() =>
  auth.user ? new Date(auth.user.createdAt).toLocaleDateString('es') : '',
)

async function onLogout() {
  await auth.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <main class="auth-page">
    <section v-if="auth.user" class="auth-card">
      <h1>Hola, {{ auth.user.name }} 👋</h1>
      <p class="subtitle">Has iniciado sesión correctamente.</p>

      <dl class="profile">
        <dt>Correo</dt>
        <dd>{{ auth.user.email }}</dd>
        <dt>Miembro desde</dt>
        <dd>{{ memberSince }}</dd>
      </dl>

      <button type="button" class="btn-secondary" @click="onLogout">Cerrar sesión</button>
    </section>
  </main>
</template>
