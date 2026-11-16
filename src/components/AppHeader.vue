<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

async function onLogout() {
  await auth.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <header v-if="auth.user" class="app-header">
    <span class="brand">🚘 AutoMoto</span>
    <div class="header-user">
      <span class="user-name">{{ auth.user.name }}</span>
      <span class="role-badge" :class="`role-${auth.user.role}`">
        {{ auth.isAdmin ? 'Admin' : 'Usuario' }}
      </span>
      <button type="button" class="btn-link" @click="onLogout">Cerrar sesión</button>
    </div>
  </header>
</template>
