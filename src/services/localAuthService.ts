import { DEMO_ACCOUNTS } from '@/data/demoUsers'
import type {
  AuthService,
  LoginPayload,
  RegisterPayload,
  Role,
  StoredUser,
  User,
} from '@/types/auth'

const USERS_KEY = 'auth:users'
const SESSION_KEY = 'auth:session'

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

function isRole(value: unknown): value is Role {
  return value === 'user' || value === 'admin'
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    const users = raw ? (JSON.parse(raw) as StoredUser[]) : []
    // Usuarios creados antes de existir los roles pasan a ser 'user'.
    return users.map((u) => (isRole(u.role) ? u : { ...u, role: 'user' }))
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function toPublicUser({ passwordHash: _omit, ...user }: StoredUser): User {
  return user
}

/**
 * SHA-256 de la contraseña. Solo evita guardarla en texto plano en esta demo;
 * NO es seguridad real: en producción el hash lo hace el backend (bcrypt/argon2).
 */
async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** Crea las cuentas demo (usuario y admin) si todavía no existen. */
let seeding: Promise<void> | null = null
function ensureDemoAccounts(): Promise<void> {
  seeding ??= (async () => {
    const users = readUsers()
    const missing = DEMO_ACCOUNTS.filter((d) => !users.some((u) => u.email === d.email))
    if (missing.length === 0) return

    const created = await Promise.all(
      missing.map(
        async (d): Promise<StoredUser> => ({
          id: crypto.randomUUID(),
          name: d.name,
          email: d.email,
          role: d.role,
          createdAt: new Date().toISOString(),
          passwordHash: await hashPassword(d.password),
        }),
      ),
    )
    writeUsers([...users, ...created])
  })()
  return seeding
}

function saveSession(user: User): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export const localAuthService: AuthService = {
  async register({ name, email, password }: RegisterPayload): Promise<User> {
    await ensureDemoAccounts()
    const users = readUsers()
    const normalized = normalizeEmail(email)

    if (users.some((u) => u.email === normalized)) {
      throw new AuthError('Ya existe una cuenta con ese correo.')
    }

    // El registro público siempre crea cuentas con rol 'user'.
    const stored: StoredUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalized,
      role: 'user',
      createdAt: new Date().toISOString(),
      passwordHash: await hashPassword(password),
    }

    writeUsers([...users, stored])
    const user = toPublicUser(stored)
    saveSession(user)
    return user
  },

  async login({ email, password }: LoginPayload): Promise<User> {
    await ensureDemoAccounts()
    const normalized = normalizeEmail(email)
    const stored = readUsers().find((u) => u.email === normalized)
    const hash = await hashPassword(password)

    if (!stored || stored.passwordHash !== hash) {
      throw new AuthError('Correo o contraseña incorrectos.')
    }

    const user = toPublicUser(stored)
    saveSession(user)
    return user
  },

  async logout(): Promise<void> {
    localStorage.removeItem(SESSION_KEY)
  },

  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (!raw) return null
      const user = JSON.parse(raw) as User
      // Sesiones antiguas sin rol: se fuerza a iniciar sesión de nuevo.
      return isRole(user.role) ? user : null
    } catch {
      return null
    }
  },
}
