'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    if (res?.error) {
      setError('Email o contraseña incorrectos.')
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-5xl mb-3">🔥</p>
          <h1 className="text-2xl font-bold text-white">Contador de Asados</h1>
          <p className="text-stone-400 mt-1 text-sm">Ingresá para ver tus asados</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-stone-300 text-sm font-medium">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="vos@email.com"
              required
              className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2.5 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-stone-300 text-sm font-medium">Contraseña</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
              className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2.5 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-lg px-6 py-3 transition-colors mt-1"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="text-stone-500 text-sm text-center mt-6">
          ¿No tenés cuenta?{' '}
          <Link href="/registro" className="text-orange-400 hover:text-orange-300 transition-colors">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  )
}
