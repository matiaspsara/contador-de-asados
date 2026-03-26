import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const asados = await prisma.asado.findMany({
    where: { userId: session.user.id },
    orderBy: { fecha: 'desc' },
  })

  const currentYear = new Date().getFullYear()
  const esteAnio = asados.filter(
    (a) => new Date(a.fecha).getFullYear() === currentYear
  )

  const vecesAsador = esteAnio.filter((a) => a.fueAsador).length
  const totalPersonas = esteAnio.reduce((sum, a) => sum + a.cantidadPersonas, 0)
  const promedioPersonas = esteAnio.length > 0 ? totalPersonas / esteAnio.length : 0

  const conteoCortes: Record<string, number> = {}
  for (const a of esteAnio) {
    for (const c of a.cortes) {
      conteoCortes[c] = (conteoCortes[c] ?? 0) + 1
    }
  }
  const corteMasUsado =
    Object.keys(conteoCortes).sort((a, b) => conteoCortes[b] - conteoCortes[a])[0] ?? null

  const ratings = esteAnio.filter((a) => a.rating > 0).map((a) => a.rating)
  const promedioRating = ratings.length > 0 ? ratings.reduce((s, r) => s + r, 0) / ratings.length : 0

  return NextResponse.json({
    asados,
    stats: {
      totalEsteAnio: esteAnio.length,
      totalHistorico: asados.length,
      vecesAsador,
      promedioPersonas: Math.round(promedioPersonas * 10) / 10,
      corteMasUsado,
      promedioRating: Math.round(promedioRating * 10) / 10,
    },
  })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { fecha, cortes, fueAsador, cantidadPersonas, combustible, rating, carniceria, precioTotal } = body

  if (!fecha || !cortes?.length || fueAsador === undefined || !cantidadPersonas || !combustible || !rating) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const asado = await prisma.asado.create({
    data: {
      fecha: new Date(fecha),
      cortes,
      fueAsador,
      cantidadPersonas: Number(cantidadPersonas),
      combustible,
      rating: Number(rating),
      carniceria: carniceria || null,
      precioTotal: precioTotal ? Number(precioTotal) : null,
      userId: session.user.id,
    },
  })

  return NextResponse.json(asado, { status: 201 })
}
