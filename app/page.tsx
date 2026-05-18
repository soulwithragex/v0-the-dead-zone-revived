"use client"

import dynamic from "next/dynamic"

const GameMain = dynamic(() => import("@/components/game/game-main").then(mod => ({ default: mod.GameMain })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-400 text-lg">Cargando La Zona Muerta...</p>
      </div>
    </div>
  ),
})

export default function Page() {
  return <GameMain />
}
