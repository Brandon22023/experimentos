import type { AuthService, LoginPayload, RegisterPayload, StoredUser, User } from '@/types/auth'

const USERS_KEY = 'auth:users'
const SESSION_KEY = 'auth:session'

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? (JSON.parse(raw) as StoredUser[]) : []
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

export const localAuthService: AuthService = {
  async register({ name, email, password }: RegisterPayload): Promise<User> {
    const users = readUsers()
    const normalized = normalizeEmail(email)

    if (users.some((u) => u.email === normalized)) {
      throw new AuthError('Ya existe una cuenta con ese correo.')
    }

    const stored: StoredUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalized,
      createdAt: new Date().toISOString(),
      passwordHash: await hashPassword(password),
    }

    writeUsers([...users, stored])
    const user = toPublicUser(stored)
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    return user
  },

  async login({ email, password }: LoginPayload): Promise<User> {
    const normalized = normalizeEmail(email)
    const stored = readUsers().find((u) => u.email === normalized)
    const hash = await hashPassword(password)

    if (!stored || stored.passwordHash !== hash) {
      throw new AuthError('Correo o contraseña incorrectos.')
    }

    const user = toPublicUser(stored)
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    return user
  },

  async logout(): Promise<void> {
    localStorage.removeItem(SESSION_KEY)
  },

  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? (JSON.parse(raw) as User) : null
    } catch {
      return null
    }
  },
}
