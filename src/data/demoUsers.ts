import type { Role } from '@/types/auth'

export interface DemoAccount {
  name: string
  email: string
  password: string
  role: Role
}

/**
 * Cuentas simuladas que se crean automáticamente en localStorage.
 * Solo para desarrollo: en producción los admins los crea el backend.
 */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  { name: 'Usuario Demo', email: 'usuario@demo.com', password: 'usuario123', role: 'user' },
  { name: 'Admin Demo', email: 'admin@demo.com', password: 'admin123', role: 'admin' },
]
