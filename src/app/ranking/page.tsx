import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function RankingPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const currentYear = new Date().getFullYear()

  const usuarios = await prisma.user.findMany({
    include: {
      asados: {
        where: {
          fecha: {
            gte: new Date(`${currentYear}-01-01`),
            lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      },
    },
  })

  const stats = usuarios
    .map((u) => {
      const asados = u.asados
      const vecesAsador = asados.filter((a) => a.fueAsador).length
      const totalPersonas = asados.reduce((s, a) => s + a.cantidadPersonas, 0)
      const promedioPersonas = asados.length > 0 ? totalPersonas / asados.length : 0
      const ratings = asados.filter((a) => a.rating > 0).map((a) => a.rating)
      const promedioRating =
        ratings.length > 0 ? ratings.reduce((s, r) => s + r, 0) / ratings.length : 0
      const totalGastado = asados.reduce((s, a) => s + (a.precioTotal ?? 0), 0)

      const conteoCortes: Record<string, number> = {}
      for (const a of asados) {
        for (const c of a.cortes) {
          conteoCortes[c] = (conteoCortes[c] ?? 0) + 1
        }
      }
      const corteFavorito =
        Object.keys(conteoCortes).sort((a, b) => conteoCortes[b] - conteoCortes[a])[0] ?? null

      return {
        id: u.id,
        nombre: u.nombre,
        totalAsados: asados.length,
        vecesAsador,
        promedioPersonas: Math.round(promedioPersonas * 10) / 10,
        promedioRating: Math.round(promedioRating * 10) / 10,
        totalGastado,
        corteFavorito,
        esVos: u.id === session.user.id,
      }
    })
    .sort((a, b) => b.totalAsados - a.totalAsados)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">🏆 Ranking {currentYear}</h1>
        <p className="text-stone-400 mt-1 text-sm">¿Quién asó más este año?</p>
      </div>

      <div className="flex flex-col gap-3">
        {stats.map((u, i) => (
          <div
            key={u.id}
            className={`bg-stone-800 border rounded-xl p-4 flex flex-col gap-3 ${
              u.esVos ? 'border-orange-500/50' : 'border-stone-700'
            }`}
          >
            {/* Encabezado */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold w-8 text-center">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-white">
                  {u.nombre}
                  {u.esVos && (
                    <span className="ml-2 text-xs text-orange-400 font-normal">(vos)</span>
                  )}
                </p>
                <p className="text-stone-400 text-sm">
                  {u.totalAsados === 0
                    ? 'Todavía no registró ningún asado'
                    : `${u.totalAsados} asado${u.totalAsados !== 1 ? 's' : ''} este año`}
                </p>
              </div>
              {u.totalAsados > 0 && (
                <div className="text-right">
                  <p className="text-orange-400 font-bold text-xl">{u.totalAsados}</p>
                  <p className="text-stone-500 text-xs">asados</p>
                </div>
              )}
            </div>

            {/* Stats */}
            {u.totalAsados > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-stone-700">
                <div className="flex flex-col">
                  <span className="text-stone-400 text-xs">Veces asador</span>
                  <span className="text-white font-medium">🧑‍🍳 {u.vecesAsador}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-stone-400 text-xs">Rating promedio</span>
                  <span className="text-white font-medium">
                    ⭐ {u.promedioRating > 0 ? `${u.promedioRating}/5` : '—'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-stone-400 text-xs">Personas promedio</span>
                  <span className="text-white font-medium">
                    👥 {u.promedioPersonas > 0 ? u.promedioPersonas : '—'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-stone-400 text-xs">Corte favorito</span>
                  <span className="text-white font-medium text-sm">
                    🥩 {u.corteFavorito ?? '—'}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {stats.length === 0 && (
        <div className="text-center py-16 text-stone-500">
          <p className="text-5xl mb-4">🔥</p>
          <p>Nadie registró asados todavía.</p>
        </div>
      )}
    </div>
  )
}
