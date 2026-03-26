import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import StatsPanel from '@/components/StatsPanel'
import AsadoList from '@/components/AsadoList'

export default async function Home() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const asados = await prisma.asado.findMany({
    where: { userId: session.user.id },
    orderBy: { fecha: 'desc' },
  })

  const currentYear = new Date().getFullYear()
  const esteAnio = asados.filter((a) => new Date(a.fecha).getFullYear() === currentYear)

  const vecesAsador = esteAnio.filter((a) => a.fueAsador).length
  const totalPersonas = esteAnio.reduce((sum, a) => sum + a.cantidadPersonas, 0)
  const promedioPersonas = esteAnio.length > 0 ? Math.round((totalPersonas / esteAnio.length) * 10) / 10 : 0

  const conteoCortes: Record<string, number> = {}
  for (const a of esteAnio) {
    for (const c of a.cortes) {
      conteoCortes[c] = (conteoCortes[c] ?? 0) + 1
    }
  }
  const corteMasUsado =
    Object.keys(conteoCortes).sort((a, b) => conteoCortes[b] - conteoCortes[a])[0] ?? null

  const ratings = esteAnio.filter((a) => a.rating > 0).map((a) => a.rating)
  const promedioRating =
    ratings.length > 0 ? Math.round((ratings.reduce((s, r) => s + r, 0) / ratings.length) * 10) / 10 : 0

  const asadosSerializados = asados.map((a) => ({
    ...a,
    fecha: a.fecha.toISOString(),
    creadoEn: a.creadoEn.toISOString(),
  }))

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Hola, {session.user.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-stone-400 mt-1">
          Tu resumen de {currentYear} ·{' '}
          <Link href="/ranking" className="text-orange-400 hover:text-orange-300 transition-colors">
            ver ranking 🏆
          </Link>
        </p>
      </div>

      <StatsPanel
        totalEsteAnio={esteAnio.length}
        totalHistorico={asados.length}
        vecesAsador={vecesAsador}
        promedioPersonas={promedioPersonas}
        corteMasUsado={corteMasUsado}
        promedioRating={promedioRating}
      />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Todos los asados</h2>
          <Link
            href="/nuevo"
            className="text-orange-400 hover:text-orange-300 text-sm transition-colors"
          >
            + Registrar uno nuevo
          </Link>
        </div>
        <AsadoList asados={asadosSerializados} />
      </div>
    </div>
  )
}
