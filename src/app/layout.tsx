import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Contador de Asados',
  description: 'Llevá el registro de tus asados',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="es-AR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-900 text-white min-h-screen`}>
        <nav className="border-b border-stone-800 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-bold text-lg text-orange-400 hover:text-orange-300 transition-colors">
              🔥 Contador de Asados
            </Link>

            {session?.user && (
              <div className="flex items-center gap-3">
                <span className="text-stone-400 text-sm hidden sm:block">{session.user.name}</span>
                <Link
                  href="/ranking"
                  className="text-stone-400 hover:text-stone-200 text-sm transition-colors hidden sm:block"
                >
                  🏆 Ranking
                </Link>
                <Link
                  href="/nuevo"
                  className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  + Registrar
                </Link>
                <form
                  action={async () => {
                    'use server'
                    await signOut({ redirectTo: '/login' })
                  }}
                >
                  <button
                    type="submit"
                    className="text-stone-400 hover:text-stone-200 text-sm transition-colors"
                  >
                    Salir
                  </button>
                </form>
              </div>
            )}
          </div>
        </nav>

        <main className="max-w-2xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
