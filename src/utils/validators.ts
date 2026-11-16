const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const MIN_PASSWORD_LENGTH = 8

export function validateName(name: string): string | null {
  if (!name.trim()) return 'El nombre es obligatorio.'
  if (name.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.'
  return null
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'El correo es obligatorio.'
  if (!EMAIL_RE.test(email.trim())) return 'Introduce un correo válido.'
  return null
}

export function validatePassword(password: string): string | null {
  if (!password) return 'La contraseña es obligatoria.'
  if (password.length < MIN_PASSWORD_LENGTH)
    return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
  return null
}

export function validatePasswordConfirm(password: string, confirm: string): string | null {
  if (!confirm) return 'Confirma tu contraseña.'
  if (password !== confirm) return 'Las contraseñas no coinciden.'
  return null
}
