<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormField from '@/components/FormField.vue'
import { useAuthStore } from '@/stores/auth'
import {
  MIN_PASSWORD_LENGTH,
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirm,
} from '@/utils/validators'

const auth = useAuthStore()
const router = useRouter()

const form = reactive({ name: '', email: '', password: '', confirm: '' })
const errors = reactive<Record<keyof typeof form, string | null>>({
  name: null,
  email: null,
  password: null,
  confirm: null,
})
const submitError = ref<string | null>(null)
const loading = ref(false)

function validate(): boolean {
  errors.name = validateName(form.name)
  errors.email = validateEmail(form.email)
  errors.password = validatePassword(form.password)
  errors.confirm = validatePasswordConfirm(form.password, form.confirm)
  return Object.values(errors).every((e) => e === null)
}

async function onSubmit() {
  submitError.value = null
  if (!validate()) return

  loading.value = true
  try {
    await auth.register({ name: form.name, email: form.email, password: form.password })
    await router.push({ name: 'home' })
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : 'No se pudo crear la cuenta.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <form class="auth-card" novalidate @submit.prevent="onSubmit">
      <h1>Crear cuenta</h1>
      <p class="subtitle">Completa tus datos para registrarte</p>

      <p v-if="submitError" class="alert" role="alert">{{ submitError }}</p>

      <FormField
        id="name"
        v-model="form.name"
        label="Nombre"
        autocomplete="name"
        :error="errors.name"
      />
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
        :label="`Contraseña (mín. ${MIN_PASSWORD_LENGTH} caracteres)`"
        type="password"
        autocomplete="new-password"
        :error="errors.password"
      />
      <FormField
        id="confirm"
        v-model="form.confirm"
        label="Confirmar contraseña"
        type="password"
        autocomplete="new-password"
        :error="errors.confirm"
      />

      <button type="submit" class="btn-primary" :disabled="loading">
        {{ loading ? 'Creando cuenta…' : 'Registrarme' }}
      </button>

      <p class="switch">
        ¿Ya tienes cuenta?
        <RouterLink :to="{ name: 'login' }">Inicia sesión</RouterLink>
      </p>
    </form>
  </main>
</template>
