export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

/** Usuario tal como se guarda en el almacenamiento (incluye el hash de la contraseña). */
export interface StoredUser extends User {
  passwordHash: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

/**
 * Contrato del servicio de autenticación.
 * Hoy lo implementa localStorage; mañana puede implementarlo una API real
 * sin tocar las vistas ni el store.
 */
export interface AuthService {
  login(payload: LoginPayload): Promise<User>
  register(payload: RegisterPayload): Promise<User>
  logout(): Promise<void>
  getCurrentUser(): User | null
}
