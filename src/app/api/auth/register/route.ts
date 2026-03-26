import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const { email, password, nombre } = await request.json()

  if (!email || !password || !nombre) {
    return NextResponse.json({ error: 'Completá todos los campos.' }, { status: 400 })
  }

  const existe = await prisma.user.findUnique({ where: { email } })
  if (existe) {
    return NextResponse.json({ error: 'Ya existe una cuenta con ese email.' }, { status: 409 })
  }

  const hash = await bcrypt.hash(password, 12)
  await prisma.user.create({ data: { email, nombre, password: hash } })

  return NextResponse.json({ ok: true }, { status: 201 })
}
