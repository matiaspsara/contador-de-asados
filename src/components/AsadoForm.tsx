'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CORTES = [
  'Tira de asado',
  'Costillar',
  'Vacío',
  'Falda',
  'Bife',
  'Matambre de vaca',
  'Matambre de cerdo',
  'Lomo',
  'Entraña',
  'Molleja',
  'Chorizo',
  'Morcilla',
  'Chinchulín',
  'Riñón',
  'Provoleta',
]

const COMBUSTIBLES = [
  { value: 'lena', label: '🪵 Leña' },
  { value: 'carbon', label: '⚫ Carbón' },
  { value: 'ambos', label: '🔥 Leña y Carbón' },
]

function StarRatingInput({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hovered, setHovered] = useState<number | null>(null)

  const options: number[] = []
  for (let i = 0.5; i <= 5; i += 0.5) options.push(i)

  const display = hovered ?? value

  return (
    <div className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        const full = display >= star
        const half = !full && display >= star - 0.5
        return (
          <span key={star} className="relative inline-block text-3xl cursor-pointer select-none">
            <span className="text-stone-700">★</span>
            {(full || half) && (
              <span
                className="absolute inset-0 text-orange-400 overflow-hidden"
                style={{ width: full ? '100%' : '50%' }}
              >
                ★
              </span>
            )}
            {/* Left half */}
            <span
              className="absolute inset-0 w-1/2 left-0"
              onMouseEnter={() => setHovered(star - 0.5)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onChange(star - 0.5)}
            />
            {/* Right half */}
            <span
              className="absolute inset-0 w-1/2 left-1/2"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onChange(star)}
            />
          </span>
        )
      })}
      {value > 0 && (
        <span className="text-stone-400 text-sm ml-2">{value}/5</span>
      )}
    </div>
  )
}

export default function AsadoForm() {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    fecha: today,
    cortes: [] as string[],
    fueAsador: '',
    cantidadPersonas: '',
    combustible: '',
    rating: 0,
    carniceria: '',
    precioTotal: '',
  })

  function toggleCorte(corte: string) {
    setForm((prev) => ({
      ...prev,
      cortes: prev.cortes.includes(corte)
        ? prev.cortes.filter((c) => c !== corte)
        : [...prev.cortes, corte],
    }))
  }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.cortes.length || !form.fueAsador || !form.cantidadPersonas || !form.combustible || form.rating === 0) {
      setError('Completá todos los campos antes de guardar.')
      return
    }
    setLoading(true)
    setError('')

    const res = await fetch('/api/asados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        fueAsador: form.fueAsador === 'si',
        cantidadPersonas: Number(form.cantidadPersonas),
      }),
    })

    if (!res.ok) {
      setError('Algo salió mal. Intentá de nuevo.')
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Fecha */}
      <div className="flex flex-col gap-2">
        <label className="text-stone-300 font-medium">Fecha del asado</label>
        <input
          type="date"
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Cortes */}
      <div className="flex flex-col gap-2">
        <label className="text-stone-300 font-medium">
          ¿Qué cortes hubo?{' '}
          <span className="text-stone-500 font-normal text-sm">(podés elegir varios)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CORTES.map((c) => {
            const selected = form.cortes.includes(c)
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleCorte(c)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  selected
                    ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                    : 'border-stone-700 text-stone-400 hover:border-stone-500'
                }`}
              >
                {selected ? '✓ ' : ''}{c}
              </button>
            )
          })}
        </div>
      </div>

      {/* Asador */}
      <div className="flex flex-col gap-2">
        <label className="text-stone-300 font-medium">¿Fuiste el asador?</label>
        <div className="flex gap-3">
          {[{ value: 'si', label: '🧑‍🍳 Sí, fui yo' }, { value: 'no', label: 'No, otro asó' }].map((opt) => (
            <label key={opt.value} className="flex-1">
              <input
                type="radio"
                name="fueAsador"
                value={opt.value}
                checked={form.fueAsador === opt.value}
                onChange={(e) => setForm({ ...form, fueAsador: e.target.value })}
                className="sr-only"
              />
              <div
                className={`border rounded-lg px-4 py-3 text-center cursor-pointer transition-colors ${
                  form.fueAsador === opt.value
                    ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                    : 'border-stone-700 text-stone-400 hover:border-stone-500'
                }`}
              >
                {opt.label}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Cantidad de personas */}
      <div className="flex flex-col gap-2">
        <label className="text-stone-300 font-medium">¿Cuántas personas vinieron?</label>
        <input
          type="number"
          min="1"
          value={form.cantidadPersonas}
          onChange={(e) => setForm({ ...form, cantidadPersonas: e.target.value })}
          placeholder="Ej: 8"
          className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 w-32"
        />
      </div>

      {/* Combustible */}
      <div className="flex flex-col gap-2">
        <label className="text-stone-300 font-medium">¿Qué usaste para el fuego?</label>
        <div className="flex gap-3 flex-wrap">
          {COMBUSTIBLES.map((opt) => (
            <label key={opt.value}>
              <input
                type="radio"
                name="combustible"
                value={opt.value}
                checked={form.combustible === opt.value}
                onChange={(e) => setForm({ ...form, combustible: e.target.value })}
                className="sr-only"
              />
              <div
                className={`border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                  form.combustible === opt.value
                    ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                    : 'border-stone-700 text-stone-400 hover:border-stone-500'
                }`}
              >
                {opt.label}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Carnicería */}
      <div className="flex flex-col gap-2">
        <label className="text-stone-300 font-medium">
          ¿Dónde compraste la carne?{' '}
          <span className="text-stone-500 font-normal text-sm">(opcional)</span>
        </label>
        <input
          type="text"
          value={form.carniceria}
          onChange={(e) => setForm({ ...form, carniceria: e.target.value })}
          placeholder="Ej: Carnicería Don José"
          className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Precio total */}
      <div className="flex flex-col gap-2">
        <label className="text-stone-300 font-medium">
          Precio total del asado{' '}
          <span className="text-stone-500 font-normal text-sm">(opcional)</span>
        </label>
        <div className="relative w-40">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">$</span>
          <input
            type="number"
            min="0"
            value={form.precioTotal}
            onChange={(e) => setForm({ ...form, precioTotal: e.target.value })}
            placeholder="0"
            className="bg-stone-800 border border-stone-700 rounded-lg pl-7 pr-3 py-2 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
          />
        </div>
      </div>

      {/* Rating */}
      <div className="flex flex-col gap-2">
        <label className="text-stone-300 font-medium">¿Cómo salió el asado?</label>
        <StarRatingInput
          value={form.rating}
          onChange={(v) => setForm({ ...form, rating: v })}
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-lg px-6 py-3 transition-colors"
      >
        {loading ? 'Guardando...' : '🔥 Registrar asado'}
      </button>
    </form>
  )
}
