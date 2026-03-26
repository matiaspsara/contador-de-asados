import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const asado = await prisma.asado.findUnique({
    where: { id: Number(params.id) },
  })

  if (!asado || asado.userId !== session.user.id) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  await prisma.asado.delete({ where: { id: Number(params.id) } })

  return new NextResponse(null, { status: 204 })
}
