'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/lib/game-store'
import { BarraRecursos } from './resource-bar'
import { PanelSupervivientes } from './survivor-panel'
import { PanelConstruccion } from './building-panel'
import { PanelMisiones } from './mission-panel'
import { PanelInventario } from './inventory-panel'
import { PanelCombate } from './combat-panel'
import { PanelTaller } from './crafting-panel'
import { SistemaNotificaciones } from './notification-system'
import { PantallaFinJuego } from './game-over-screen'
import { PantallaInicio } from './start-screen'
import { MapaCompound } from './compound-map'
import { 
  Home, 
  Users, 
  Package, 
  Map,
  Crosshair,
  Shield,
  Sun,
  Moon,
  Pause,
  Play,
  Hammer
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function GameMain() {
  const { 
    juegoIniciado,
    juegoPausado,
    juegoTerminado,
    dia,
    hora,
    esDeNoche,
    pestanaSeleccionada,
    establecerPestanaSeleccionada,
    tick,
    pausarJuego,
    reanudarJuego,
    hordasZombies
  } = useGameStore()

  // Bucle del juego
  useEffect(() => {
    if (!juegoIniciado || juegoPausado || juegoTerminado) return

    const intervalo = setInterval(() => {
      tick()
    }, 1000) // 1 segundo = 30 minutos en el juego

    return () => clearInterval(intervalo)
  }, [juegoIniciado, juegoPausado, juegoTerminado, tick])

  if (!juegoIniciado) {
    return <PantallaInicio />
  }

  if (juegoTerminado) {
    return <PantallaFinJuego />
  }

  const formatearHora = (h: number) => {
    const horas = Math.floor(h)
    const minutos = Math.floor((h % 1) * 60)
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`
  }

  const pestanas = [
    { id: 'compound', etiqueta: 'Compound', icono: Crosshair },
    { id: 'base', etiqueta: 'Base', icono: Home },
    { id: 'supervivientes', etiqueta: 'Supervivientes', icono: Users },
    { id: 'inventario', etiqueta: 'Inventario', icono: Package },
    { id: 'misiones', etiqueta: 'Misiones', icono: Map },
    { id: 'taller', etiqueta: 'Taller', icono: Hammer },
  ] as const

  const hayAtaqueZombie = hordasZombies.some(h => h.estado === 'atacando')

  return (
    <div className={cn(
      "min-h-screen flex flex-col transition-colors duration-1000",
      esDeNoche ? "bg-[oklch(0.08_0.015_250)]" : "bg-background"
    )}>
      {/* Encabezado */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Título del juego y día/hora */}
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-primary">
                LA ZONA MUERTA
                <span className="block text-xs font-normal text-muted-foreground">RESURGIR</span>
              </h1>
              
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Día</span>
                  <span className="text-lg font-bold text-foreground">{dia}</span>
                </div>
                <div className="w-px h-6 bg-border" />
                <div className="flex items-center gap-2">
                  {esDeNoche ? (
                    <Moon className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-yellow-400" />
                  )}
                  <span className="text-lg font-mono text-foreground">{formatearHora(hora)}</span>
                </div>
              </div>
            </div>

            {/* Controles */}
            <div className="flex items-center gap-2">
              {hayAtaqueZombie && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/20 border border-destructive/50 rounded-lg animate-pulse">
                  <Shield className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">¡BAJO ATAQUE!</span>
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={juegoPausado ? reanudarJuego : pausarJuego}
                className="gap-2"
              >
                {juegoPausado ? (
                  <>
                    <Play className="w-4 h-4" />
                    <span className="hidden sm:inline">Reanudar</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    <span className="hidden sm:inline">Pausar</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Barras de recursos */}
          <div className="mt-3">
            <BarraRecursos />
          </div>
        </div>
      </header>

      {/* Pestañas de navegación */}
      <nav className="border-b border-border/50 bg-card/50 sticky top-[140px] sm:top-[120px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {pestanas.map((pestana) => (
              <Button
                key={pestana.id}
                variant={pestanaSeleccionada === pestana.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => establecerPestanaSeleccionada(pestana.id)}
                className={cn(
                  "gap-2 shrink-0",
                  pestanaSeleccionada === pestana.id && "bg-primary text-primary-foreground"
                )}
              >
                <pestana.icono className="w-4 h-4" />
                {pestana.etiqueta}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Panel principal */}
          <div className="lg:col-span-2">
            {pestanaSeleccionada === 'compound' && <MapaCompound />}
            {pestanaSeleccionada === 'base' && <PanelConstruccion />}
            {pestanaSeleccionada === 'supervivientes' && <PanelSupervivientes />}
            {pestanaSeleccionada === 'inventario' && <PanelInventario />}
            {pestanaSeleccionada === 'misiones' && <PanelMisiones />}
            {pestanaSeleccionada === 'taller' && <PanelTaller />}
          </div>

          {/* Panel lateral - Registro de combate y acciones rápidas */}
          <div className="space-y-4">
            <PanelCombate />
          </div>
        </div>
      </main>

      {/* Notificaciones */}
      <SistemaNotificaciones />

      {/* Overlay de pausa */}
      {juegoPausado && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">PAUSADO</h2>
            <Button onClick={reanudarJuego} size="lg" className="gap-2">
              <Play className="w-5 h-5" />
              Reanudar Juego
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
