'use client'

import { useGameStore } from '@/lib/game-store'
import { Button } from '@/components/ui/button'
import { RefreshCw, Skull } from 'lucide-react'

export function PantallaFinJuego() {
  const { dia, razonFinJuego, supervivientes } = useGameStore()

  const reiniciar = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Animación de calavera */}
        <div className="mb-8">
          <Skull className="w-24 h-24 mx-auto text-destructive animate-pulse" />
        </div>

        {/* Texto de fin de juego */}
        <h1 className="text-5xl font-bold text-destructive mb-4">
          FIN DEL JUEGO
        </h1>

        <p className="text-xl text-foreground mb-2">{razonFinJuego}</p>

        {/* Estadísticas */}
        <div className="bg-card border border-border rounded-lg p-6 my-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Estadísticas Finales</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="text-3xl font-bold text-primary">{dia}</div>
              <div className="text-sm text-muted-foreground">Días Sobrevividos</div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="text-3xl font-bold text-destructive">{supervivientes.length}</div>
              <div className="text-sm text-muted-foreground">Supervivientes Perdidos</div>
            </div>
          </div>
        </div>

        {/* Botón de reinicio */}
        <Button 
          size="lg" 
          onClick={reiniciar}
          className="gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Intentar de Nuevo
        </Button>

        {/* Cita */}
        <p className="mt-8 text-sm text-muted-foreground italic">
          {"\"En este mundo, los muertos se levantan... pero nosotros también.\""}
        </p>
      </div>
    </div>
  )
}
