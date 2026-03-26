'use client'

import { useRouter } from 'next/navigation'
import AsadoCard from './AsadoCard'

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

export default function AsadoList({ asados }: { asados: Asado[] }) {
  const router = useRouter()

  async function handleDelete(id: number) {
    await fetch(`/api/asados/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  if (asados.length === 0) {
    return (
      <div className="text-center py-16 text-stone-500">
        <p className="text-5xl mb-4">🔥</p>
        <p className="text-lg">Todavía no registraste ningún asado.</p>
        <p className="text-sm mt-1">¡Animate a registrar el primero!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {asados.map((asado) => (
        <AsadoCard key={asado.id} asado={asado} onDelete={handleDelete} />
      ))}
    </div>
  )
}
