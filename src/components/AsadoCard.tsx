'use client'

interface Asado {
  id: number
  fecha: string
  cortes: string[]
  fueAsador: boolean
  cantidadPersonas: number
  combustible: string
  rating: number
  carniceria: string | null
  precioTotal: number | null
}

const combustibleLabel: Record<string, string> = {
  lena: '🪵 Leña',
  carbon: '⚫ Carbón',
  ambos: '🔥 Leña y Carbón',
}

function StarRating({ rating }: { rating: number }) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<span key={i} className="text-orange-400">★</span>)
    } else if (rating >= i - 0.5) {
      stars.push(<span key={i} className="text-orange-400 opacity-60">★</span>)
    } else {
      stars.push(<span key={i} className="text-stone-600">★</span>)
    }
  }
  return <span className="text-lg leading-none">{stars}</span>
}

export default function AsadoCard({
  asado,
  onDelete,
}: {
  asado: Asado
  onDelete: (id: number) => void
}) {
  const fecha = new Date(asado.fecha)
  const fechaFormateada = fecha.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  function handleDelete() {
    if (confirm('¿Seguro que querés eliminar este asado?')) {
      onDelete(asado.id)
    }
  }

  return (
    <div className="bg-stone-800 border border-stone-700 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-stone-400 text-sm capitalize">{fechaFormateada}</p>
          <p className="text-white font-semibold text-lg mt-0.5">🥩 {asado.cortes.join(', ')}</p>
        </div>
        <button
          onClick={handleDelete}
          className="text-stone-500 hover:text-red-400 transition-colors text-sm shrink-0"
          aria-label="Eliminar asado"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <span className="bg-stone-700 text-stone-300 px-2 py-1 rounded-lg">
          {combustibleLabel[asado.combustible] ?? asado.combustible}
        </span>
        <span className="bg-stone-700 text-stone-300 px-2 py-1 rounded-lg">
          👥 {asado.cantidadPersonas} {asado.cantidadPersonas === 1 ? 'persona' : 'personas'}
        </span>
        {asado.fueAsador && (
          <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-1 rounded-lg">
            🧑‍🍳 Fuiste el asador
          </span>
        )}
        {asado.carniceria && (
          <span className="bg-stone-700 text-stone-300 px-2 py-1 rounded-lg">
            🏪 {asado.carniceria}
          </span>
        )}
        {asado.precioTotal != null && (
          <span className="bg-stone-700 text-stone-300 px-2 py-1 rounded-lg">
            💸 ${asado.precioTotal.toLocaleString('es-AR')}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <StarRating rating={asado.rating} />
        <span className="text-stone-500 text-sm">{asado.rating}/5</span>
      </div>
    </div>
  )
}
