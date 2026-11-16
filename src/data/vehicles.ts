import type { Vehicle } from '@/types/vehicle'

/** Catálogo simulado de carros (lo ve el rol 'user'). */
export const CARS: Vehicle[] = [
  { id: 'c1', kind: 'car', brand: 'Toyota', model: 'Corolla', year: 2025, price: 23500, category: 'Sedán', spec: '2.0 L · 169 hp', stock: 8, emoji: '🚗' },
  { id: 'c2', kind: 'car', brand: 'Honda', model: 'CR-V', year: 2025, price: 31200, category: 'SUV', spec: '1.5 L Turbo · 190 hp', stock: 5, emoji: '🚙' },
  { id: 'c3', kind: 'car', brand: 'Ford', model: 'Mustang', year: 2024, price: 42900, category: 'Deportivo', spec: '5.0 L V8 · 480 hp', stock: 2, emoji: '🏎️' },
  { id: 'c4', kind: 'car', brand: 'Kia', model: 'Picanto', year: 2025, price: 14900, category: 'Hatchback', spec: '1.2 L · 83 hp', stock: 12, emoji: '🚗' },
  { id: 'c5', kind: 'car', brand: 'Tesla', model: 'Model 3', year: 2025, price: 40200, category: 'Eléctrico', spec: '510 km de autonomía', stock: 3, emoji: '⚡' },
  { id: 'c6', kind: 'car', brand: 'Toyota', model: 'Hilux', year: 2024, price: 36800, category: 'Pickup', spec: '2.8 L Diésel · 201 hp', stock: 0, emoji: '🛻' },
]

/** Catálogo simulado de motos (lo ve el rol 'admin'). */
export const MOTORCYCLES: Vehicle[] = [
  { id: 'm1', kind: 'motorcycle', brand: 'Yamaha', model: 'MT-07', year: 2025, price: 8600, category: 'Naked', spec: '689 cc · 73 hp', stock: 4, emoji: '🏍️' },
  { id: 'm2', kind: 'motorcycle', brand: 'Honda', model: 'CB500X', year: 2025, price: 7400, category: 'Trail', spec: '471 cc · 47 hp', stock: 6, emoji: '🏍️' },
  { id: 'm3', kind: 'motorcycle', brand: 'Kawasaki', model: 'Ninja ZX-6R', year: 2024, price: 11300, category: 'Deportiva', spec: '636 cc · 127 hp', stock: 1, emoji: '🏁' },
  { id: 'm4', kind: 'motorcycle', brand: 'Suzuki', model: 'V-Strom 650', year: 2025, price: 9200, category: 'Trail', spec: '645 cc · 69 hp', stock: 3, emoji: '🏍️' },
  { id: 'm5', kind: 'motorcycle', brand: 'Vespa', model: 'Primavera 150', year: 2025, price: 4800, category: 'Scooter', spec: '155 cc · 13 hp', stock: 9, emoji: '🛵' },
  { id: 'm6', kind: 'motorcycle', brand: 'Harley-Davidson', model: 'Iron 883', year: 2023, price: 10900, category: 'Custom', spec: '883 cc · 50 hp', stock: 0, emoji: '🏍️' },
]
