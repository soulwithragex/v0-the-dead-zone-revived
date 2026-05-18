'use client'

import { useGameStore } from '@/lib/game-store'
import { Button } from '@/components/ui/button'
import { Play, Skull, Shield, Users, Package, Map } from 'lucide-react'

export function PantallaInicio() {
  const { iniciarJuego } = useGameStore()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">
      {/* Elementos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-destructive/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/20 rounded-full mb-4">
            <Skull className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground tracking-tight">
            LA ZONA MUERTA
          </h1>
          <p className="text-2xl sm:text-3xl font-light text-primary mt-2">
            RESURGIR
          </p>
        </div>

        {/* Eslogan */}
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Sobrevive al apocalipsis. Construye tu base. Lidera a tus supervivientes. 
          ¿Cuánto tiempo puedes aguantar en la zona muerta?
        </p>

        {/* Características */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-sm font-medium text-foreground">Defiende</div>
            <div className="text-xs text-muted-foreground">Tu Base</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-sm font-medium text-foreground">Gestiona</div>
            <div className="text-xs text-muted-foreground">Supervivientes</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-sm font-medium text-foreground">Recolecta</div>
            <div className="text-xs text-muted-foreground">Recursos</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <Map className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-sm font-medium text-foreground">Explora</div>
            <div className="text-xs text-muted-foreground">El Páramo</div>
          </div>
        </div>

        {/* Botón de inicio */}
        <Button 
          size="lg" 
          onClick={iniciarJuego}
          className="gap-2 text-lg px-8 py-6 h-auto"
        >
          <Play className="w-6 h-6" />
          Iniciar Supervivencia
        </Button>

        {/* Instrucciones */}
        <div className="mt-8 bg-card/50 border border-border rounded-lg p-4 text-left max-w-md mx-auto">
          <h3 className="text-sm font-semibold text-foreground mb-2">Guía Rápida:</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>- <strong className="text-foreground">Base:</strong> Construye estructuras para mejorar tu compound</li>
            <li>- <strong className="text-foreground">Supervivientes:</strong> Gestiona salud, hambre y asigna tareas</li>
            <li>- <strong className="text-foreground">Misiones:</strong> Envía supervivientes a buscar suministros</li>
            <li>- <strong className="text-foreground">Combate:</strong> Defiéndete de las hordas zombies por la noche</li>
          </ul>
        </div>

        {/* Pie de página */}
        <p className="mt-8 text-xs text-muted-foreground">
          Inspirado en The Last Stand: Dead Zone
        </p>
      </div>
    </div>
  )
}
