import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import AsadoForm from '@/components/AsadoForm'

export default async function NuevoAsadoPage() {
  const session = await auth()
  if (!session?.user) redirect('/')

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-6">🥩 Registrá un asado</h1>
      <AsadoForm />
    </div>
  )
}
