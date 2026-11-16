<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormField from '@/components/FormField.vue'
import { useAuthStore } from '@/stores/auth'
import { validateEmail } from '@/utils/validators'
import { DEMO_ACCOUNTS, type DemoAccount } from '@/data/demoUsers'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const errors = reactive<{ email: string | null; password: string | null }>({
  email: null,
  password: null,
})
const submitError = ref<string | null>(null)
const loading = ref(false)

function validate(): boolean {
  errors.email = validateEmail(form.email)
  errors.password = form.password ? null : 'La contraseña es obligatoria.'
  return !errors.email && !errors.password
}

function fillDemo(account: DemoAccount) {
  form.email = account.email
  form.password = account.password
  errors.email = null
  errors.password = null
}

async function onSubmit() {
  submitError.value = null
  if (!validate()) return

  loading.value = true
  try {
    await auth.login({ email: form.email, password: form.password })
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.push(redirect)
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : 'No se pudo iniciar sesión.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <form class="auth-card" novalidate @submit.prevent="onSubmit">
      <h1>Iniciar sesión</h1>
      <p class="subtitle">Bienvenido de nuevo</p>

      <p v-if="submitError" class="alert" role="alert">{{ submitError }}</p>

      <FormField
        id="email"
        v-model="form.email"
        label="Correo electrónico"
        type="email"
        autocomplete="email"
        :error="errors.email"
      />
      <FormField
        id="password"
        v-model="form.password"
        label="Contraseña"
        type="password"
        autocomplete="current-password"
        :error="errors.password"
      />

      <button type="submit" class="btn-primary" :disabled="loading">
        {{ loading ? 'Entrando…' : 'Entrar' }}
      </button>

      <p class="switch">
        ¿No tienes cuenta?
        <RouterLink :to="{ name: 'register' }">Regístrate</RouterLink>
      </p>

      <div class="demo-box">
        <p>Cuentas de prueba (clic para rellenar):</p>
        <div class="demo-actions">
          <button
            v-for="account in DEMO_ACCOUNTS"
            :key="account.email"
            type="button"
            class="chip"
            @click="fillDemo(account)"
          >
            {{ account.role === 'admin' ? 'Admin' : 'Usuario' }}
          </button>
        </div>
      </div>
    </form>
  </main>
</template>
