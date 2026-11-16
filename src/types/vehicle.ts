export type VehicleKind = 'car' | 'motorcycle'

export interface Vehicle {
  id: string
  kind: VehicleKind
  brand: string
  model: string
  year: number
  /** Precio en USD. */
  price: number
  /** Categoría: Sedán, SUV, Deportiva, Naked… */
  category: string
  /** Detalle técnico principal (motor, cilindrada…). */
  spec: string
  stock: number
  emoji: string
}
