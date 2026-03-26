interface StatsPanelProps {
  totalEsteAnio: number
  totalHistorico: number
  vecesAsador: number
  promedioPersonas: number
  corteMasUsado: string | null
  promedioRating: number
}

function StatCard({ label, value, emoji }: { label: string; value: string | number; emoji: string }) {
  return (
    <div className="bg-stone-800 border border-stone-700 rounded-xl p-4 flex flex-col gap-1">
      <span className="text-2xl">{emoji}</span>
      <span className="text-2xl font-bold text-orange-400">{value}</span>
      <span className="text-sm text-stone-400">{label}</span>
    </div>
  )
}

export default function StatsPanel({
  totalEsteAnio,
  totalHistorico,
  vecesAsador,
  promedioPersonas,
  corteMasUsado,
  promedioRating,
}: StatsPanelProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <StatCard emoji="🥩" label="Asados este año" value={totalEsteAnio} />
      <StatCard emoji="🧑‍🍳" label="Veces que fuiste el asador" value={vecesAsador} />
      <StatCard emoji="👥" label="Personas promedio" value={promedioPersonas || '—'} />
      <StatCard emoji="🏆" label="Corte preferido" value={corteMasUsado ?? '—'} />
      <StatCard emoji="⭐" label="Rating promedio" value={promedioRating ? `${promedioRating}/5` : '—'} />
      <StatCard emoji="📅" label="Total histórico" value={totalHistorico} />
    </div>
  )
}
