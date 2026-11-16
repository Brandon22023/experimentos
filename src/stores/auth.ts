import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { localAuthService } from '@/services/localAuthService'
import type { AuthService, LoginPayload, RegisterPayload, User } from '@/types/auth'

// Para cambiar a una API real, basta con reemplazar esta implementación.
const authService: AuthService = localAuthService

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(authService.getCurrentUser())
  const isAuthenticated = computed(() => user.value !== null)

  async function login(payload: LoginPayload): Promise<void> {
    user.value = await authService.login(payload)
  }

  async function register(payload: RegisterPayload): Promise<void> {
    user.value = await authService.register(payload)
  }

  async function logout(): Promise<void> {
    await authService.logout()
    user.value = null
  }

  return { user, isAuthenticated, login, register, logout }
})
