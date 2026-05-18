'use client'

import { useGameStore } from '@/lib/game-store'
import { cn } from '@/lib/utils'

export function SistemaNotificaciones() {
  const { notificaciones, limpiarNotificacion } = useGameStore()

  const estilosTipo = {
    info: 'bg-blue-900/90 border-blue-500/50 text-blue-100',
    advertencia: 'bg-yellow-900/90 border-yellow-500/50 text-yellow-100',
    peligro: 'bg-red-900/90 border-red-500/50 text-red-100',
    exito: 'bg-green-900/90 border-green-500/50 text-green-100',
  }

  if (notificaciones.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {notificaciones.map((notificacion) => (
        <div
          key={notificacion.id}
          onClick={() => limpiarNotificacion(notificacion.id)}
          className={cn(
            "px-4 py-3 rounded-lg border cursor-pointer transition-all duration-300 shadow-lg backdrop-blur-sm animate-in slide-in-from-right",
            estilosTipo[notificacion.tipo]
          )}
        >
          <p className="text-sm font-medium">{notificacion.mensaje}</p>
        </div>
      ))}
    </div>
  )
}
